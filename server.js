'use strict';
// No npm dependencies. Serves the studio and supplies optional local integrations.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {spawn, spawnSync} = require('node:child_process');
const crypto = require('node:crypto');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT || 4178);
const PUBLIC = path.join(__dirname, 'public');
const MAX_JSON = 1024 * 1024;
const MAX_VIDEO = 400 * 1024 * 1024;
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'};
function respond(res, status, data, headers={}) {
  res.writeHead(status, {'Access-Control-Allow-Origin': 'http://localhost:'+PORT, 'Cache-Control':'no-store', ...headers});
  res.end(data);
}
function json(res, status, value) { respond(res, status, JSON.stringify(value), {'Content-Type':'application/json; charset=utf-8'}); }
function body(req, max) { return new Promise((resolve,reject) => {
  let size=0; const chunks=[];
  req.on('data', c => {size+=c.length; if(size>max) {reject(new Error('Request too large')); req.destroy();} else chunks.push(c);});
  req.on('end',()=>resolve(Buffer.concat(chunks)));
  req.on('error',reject);
}); }
async function jsonBody(req) { return JSON.parse((await body(req, MAX_JSON)).toString('utf8')); }
function availability(command) {try {return spawnSync(command, ['-version'],{stdio:'ignore', timeout:2000}).status===0;} catch {return false;}}
const ffmpegOK=availability('ffmpeg');
const iconKeys = ['lightbulb','book','heart','tree','person','people','home','sun','clock','cross','mountain','road','scales','globe','flame','water','crown','key','brain','shield','question','star','door','seed','chain','eye','speech','dove','lamb','cloud','scroll','hand','compass','gift','ladder','flower'];
function extractJSON(text) {
  try { return JSON.parse(text); } catch {}
  const start=text.indexOf('{'); const end=text.lastIndexOf('}');
  if(start>=0 && end>start) { try {return JSON.parse(text.slice(start,end+1));} catch {} }
  const a=text.indexOf('['), b=text.lastIndexOf(']');
  if(a>=0 && b>a) { try {return JSON.parse(text.slice(a,b+1));} catch{} }
  throw new Error('Model did not return valid JSON. Try the instant generator.');
}
async function ollamaRequest(endpoint, payload=null, timeout=120000){
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeout);
  try { const r=await fetch('http://127.0.0.1:11434'+endpoint,{
    method:payload?'POST':'GET', headers:payload?{'Content-Type':'application/json'}:{},body:payload?JSON.stringify(payload):undefined, signal:controller.signal});
    if(!r.ok) throw new Error('Ollama error '+r.status); return await r.json();
  } finally {clearTimeout(timer);}
}
function words(text){return (text.match(/\S+/g)||[]).length;}
async function handleGenerate(req,res){
  const {text,model,sceneCount}=await jsonBody(req);
  if(typeof text!=='string'||text.trim().length<15||text.length>45000) return json(res,400,{error:'Essay must be 15–45,000 characters.'});
  if(typeof model!=='string'||!model.trim()) return json(res,400,{error:'Select an Ollama model.'});
  const target=Math.min(32,Math.max(3,Number(sceneCount)||Math.ceil(words(text)/48)));
  const prompt=`You make simple black-marker whiteboard animations from essays. Turn the following essay into approximately ${target} chronologically ordered scenes. Preserve the essay's meaning and order; do not invent claims. Each scene has: "title" (2-6 simple words), "caption" (short compelling sentence of max 95 characters), "icon" (ONE from this list: ${iconKeys.join(', ')}), and "body" (the ORIGINAL essay passage belonging to that scene, unmodified). Cover the essay sequentially, avoid omission, do not add an introduction or conclusion not found in the text. Return ONLY JSON: {"scenes":[{"title":"...","caption":"...","icon":"...","body":"..."}]}. Essay:\n\n${text}`;
  const output=await ollamaRequest('/api/generate', {model,prompt,stream:false,format:'json',options:{temperature:0.15,num_predict:7000}},180000);
  const parsed=extractJSON(output.response||''); const scenes=Array.isArray(parsed)?parsed:parsed.scenes;
  if(!Array.isArray(scenes)||!scenes.length) throw new Error('Model returned no scenes.');
  const good=scenes.slice(0,48).map((x,i)=>({
    title:String(x.title||'Scene '+(i+1)).slice(0,80), caption:String(x.caption||'').slice(0,220),
    icon:iconKeys.includes(x.icon)?x.icon:'book', body:String(x.body||'').slice(0,1500), duration:0
  }));
  // AI may summarize or rewrite the speech: keep original essay for generated TTS.
  return json(res,200,{scenes:good});
}
async function handleTTS(req,res){
  const {text,rate}=await jsonBody(req);
  if(typeof text!=='string'||text.length<1||text.length>45000) return json(res,400,{error:'Narration text must be 1–45,000 characters.'});
  if(process.platform!=='win32') return json(res,422,{error:'Built-in offline narration is provided for Windows. On other systems, import an audio file.'});
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'whiteboard-tts-'));
  const input=path.join(tmp,'input.json'); const output=path.join(tmp,'voice.wav'); const script=path.join(tmp,'speak.ps1');
  fs.writeFileSync(input,JSON.stringify({text,rate:Math.max(-5,Math.min(5,Number(rate)||0))}),'utf8');
  fs.writeFileSync(script,`$ErrorActionPreference='Stop'\nAdd-Type -AssemblyName System.Speech\n$data=Get-Content -Raw -Encoding UTF8 -LiteralPath '${input.replace(/'/g,"''")}' | ConvertFrom-Json\n$s=New-Object System.Speech.Synthesis.SpeechSynthesizer\ntry {\n  $s.Rate=[int]$data.rate\n  $s.SetOutputToWaveFile('${output.replace(/'/g,"''")}')\n  $s.Speak([string]$data.text)\n} finally { $s.Dispose() }\n`,'utf8');
  try{
    await new Promise((resolve,reject)=>{const p=spawn('powershell.exe',['-NoProfile','-NonInteractive','-ExecutionPolicy','Bypass','-File',script],{windowsHide:true});let err='';
      p.stderr.on('data',d=>err+=d);p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(err.trim()||'Windows narration failed')));});
    const wav=fs.readFileSync(output);
    respond(res,200,wav,{'Content-Type':'audio/wav','Content-Length':wav.length});
  }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
async function handleConvert(req,res){
  if(!ffmpegOK) return json(res,422,{error:'FFmpeg is not installed. Export WebM or install FFmpeg and restart the app to enable MP4.'});
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'whiteboard-convert-'));
  const src=path.join(tmp,'input.webm'), dst=path.join(tmp,'output.mp4');
  try {
    await new Promise((resolve,reject)=>{let total=0;const target=fs.createWriteStream(src);
      req.on('data',c=>{total+=c.length;if(total>MAX_VIDEO)req.destroy(new Error('Video is too large'));});
      req.on('error',reject);target.on('error',reject);target.on('finish',resolve);req.pipe(target);});
    await new Promise((resolve,reject)=>{
      const args=['-hide_banner','-loglevel','error','-y','-i',src,'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',dst];
      const p=spawn('ffmpeg',args,{windowsHide:true});let err='';p.stderr.on('data',d=>err=(err+d).slice(-8000));
      p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error('FFmpeg: '+err)));
    });
    const stat=fs.statSync(dst); res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':stat.size,'Content-Disposition':'attachment; filename="whiteboard-animation.mp4"'});
    await new Promise((resolve,reject)=>{const stream=fs.createReadStream(dst);stream.on('error',reject);res.on('close',resolve);stream.on('end',resolve);stream.pipe(res);});
  } finally {fs.rmSync(tmp,{recursive:true,force:true});}
}
const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://'+HOST+':'+PORT);
    if(req.method==='GET'&&url.pathname==='/api/status') return json(res,200,{ffmpeg:ffmpegOK,windowsTTS:process.platform==='win32',ollama:false,version:'0.1.0'});
    if(req.method==='GET'&&url.pathname==='/api/ollama-models') {
      try { const result=await ollamaRequest('/api/tags',null,3000);return json(res,200,{models:(result.models||[]).map(m=>m.name)});}
      catch{return json(res,200,{models:[],offline:true});}
    }
    if(req.method==='POST'&&url.pathname==='/api/ollama-plan')return await handleGenerate(req,res);
    if(req.method==='POST'&&url.pathname==='/api/tts')return await handleTTS(req,res);
    if(req.method==='POST'&&url.pathname==='/api/convert')return await handleConvert(req,res);
    if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
    let requested=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
    const file=path.resolve(PUBLIC,'.'+requested);
    if(!file.startsWith(PUBLIC+path.sep))return respond(res,403,'Forbidden');
    let stat;try{stat=fs.statSync(file);}catch{return respond(res,404,'Not found');}
    if(!stat.isFile())return respond(res,404,'Not found');
    res.writeHead(200,{'Content-Type':MIME[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  }catch(e){console.error(e);if(!res.headersSent)json(res,500,{error:e.message||'Server error'});else res.destroy();}
});
server.listen(PORT,HOST,()=>console.log(`\nWhiteboard Studio is ready: http://localhost:${PORT}\nStop with Ctrl+C.\n`));

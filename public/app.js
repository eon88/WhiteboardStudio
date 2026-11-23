(() => {
'use strict';
const $ = id => document.getElementById(id);
const canvas = $('board');
const ctx = canvas.getContext('2d', {alpha:false});
const W=1280, H=720;
const svgNS='http://www.w3.org/2000/svg';

// Each doodle is made of genuine vector strokes, revealed in the order a marker would trace them.
const ICONS = {
 lightbulb:['M50 10 C29 10 19 25 22 44 C25 56 35 60 38 71 L62 71 C65 58 78 54 78 37 C78 22 66 10 50 10 Z','M39 79 L61 79','M40 86 L60 86','M44 93 L56 93','M49 20 L43 38 L54 42 L46 62','M17 10 L10 3','M83 10 L90 3','M9 45 L2 45','M91 45 L98 45'],
 book:['M50 21 C38 12 22 12 8 16 L8 83 C23 77 38 79 50 88 C64 79 79 77 92 83 L92 16 C76 12 62 12 50 21 Z','M50 21 L50 88','M17 28 C28 24 37 26 43 30','M17 40 C26 37 37 39 43 43','M58 30 C65 26 74 24 83 28','M58 43 C66 39 75 37 83 40'],
 heart:['M50 86 C-13 47 12 8 37 15 C46 17 49 22 50 29 C51 22 62 14 72 15 C102 18 107 52 50 86 Z','M21 38 C20 28 27 22 37 23'],
 tree:['M48 88 L48 61','M48 61 C30 69 17 55 20 43 C8 34 19 15 34 20 C43 3 64 11 68 23 C83 16 95 32 84 45 C89 61 70 68 59 61 L48 71','M20 89 L79 89','M48 56 L35 41','M53 54 L69 34'],
 person:['M50 11 C37 11 30 20 30 31 C30 43 39 49 50 49 C61 49 70 42 70 31 C70 19 62 11 50 11 Z','M16 90 C17 65 28 54 50 54 C71 54 83 67 84 90','M39 28 L40 29','M60 28 L61 29','M43 39 C48 43 54 43 58 39'],
 people:['M31 24 C20 24 17 35 19 43 C22 51 28 53 33 53 C42 53 46 44 44 36 C43 29 38 24 31 24 Z','M68 24 C57 24 54 35 56 43 C59 51 65 53 70 53 C79 53 83 44 81 36 C80 29 75 24 68 24 Z','M4 89 C5 68 14 59 30 59 C42 59 47 67 50 76','M50 76 C55 63 61 59 70 59 C87 59 96 72 96 89','M31 15 L31 5','M68 15 L68 5'],
 home:['M9 47 L50 12 L91 47','M18 40 L18 90 L82 90 L82 40','M40 90 L40 58 L60 58 L60 90','M67 55 L76 55 L76 68 L67 68','M25 31 L25 17 L35 17'],
 sun:['M50 22 C33 22 22 34 22 50 C22 66 34 78 50 78 C66 78 78 66 78 50 C78 34 66 22 50 22 Z','M50 14 L50 2','M50 86 L50 99','M14 50 L2 50','M86 50 L98 50','M24 24 L14 14','M76 76 L86 86','M76 24 L86 14','M24 76 L14 86'],
 clock:['M50 10 C27 10 10 28 10 50 C10 73 27 90 50 90 C73 90 90 72 90 50 C90 28 73 10 50 10 Z','M50 24 L50 52 L71 63','M50 15 L50 18','M50 82 L50 86','M15 50 L19 50','M81 50 L85 50'],
 cross:['M41 6 L60 6 L60 35 L86 35 L86 54 L60 54 L60 94 L41 94 L41 54 L14 54 L14 35 L41 35 Z','M47 13 L53 13','M20 43 L32 43'],
 mountain:['M6 85 L34 37 L48 56 L68 12 L95 85 Z','M20 62 L34 37 L43 49','M55 45 L68 12 L82 47','M5 91 L95 91'],
 road:['M38 92 C43 65 26 55 39 32 C46 18 60 13 58 5','M64 92 C59 65 76 55 63 32 C56 18 42 13 44 5','M51 84 L51 71','M52 57 L52 46','M52 31 L52 23'],
 scales:['M50 10 L50 83','M24 83 L76 83','M16 91 L84 91','M17 31 L83 31','M50 13 L50 2','M22 31 L9 58 L35 58 Z','M78 31 L65 58 L91 58 Z','M9 58 C11 76 33 76 35 58','M65 58 C67 76 89 76 91 58'],
 globe:['M50 8 C27 8 9 27 9 50 C9 73 27 92 50 92 C73 92 91 73 91 50 C91 27 73 8 50 8 Z','M10 50 L90 50','M50 8 C29 25 29 75 50 92','M50 8 C71 25 71 75 50 92','M18 27 C40 34 61 34 82 27','M18 73 C40 66 61 66 82 73'],
 flame:['M51 92 C30 92 21 80 24 62 C26 44 42 32 43 8 C56 20 55 39 54 48 C63 41 66 30 68 25 C86 49 90 65 82 79 C75 89 65 93 51 92 Z','M51 91 C41 82 44 70 55 56 C54 69 65 74 60 85'],
 water:['M50 5 C36 27 17 50 17 65 C17 84 32 95 50 95 C68 95 83 83 83 65 C83 50 65 25 50 5 Z','M29 67 C29 80 37 84 42 85'],
 crown:['M12 80 L8 27 L32 48 L50 9 L68 48 L92 27 L88 80 Z','M12 88 L88 88','M19 70 L80 70','M50 20 L50 15'],
 key:['M34 42 C22 42 12 33 12 22 C12 10 22 3 34 3 C46 3 54 12 54 22 C54 33 46 42 34 42 Z','M47 36 L87 77 L87 91 L75 91 L75 82 L66 82 L66 73 L37 42','M28 18 C32 14 37 17 37 22'],
 brain:['M49 20 C42 3 21 10 21 26 C5 25 6 47 19 52 C8 62 18 80 31 76 C34 93 47 93 50 80','M51 20 C58 3 79 10 79 26 C95 25 94 47 81 52 C92 62 82 80 69 76 C66 93 53 93 50 80','M50 20 L50 80','M22 32 C31 30 33 42 30 47','M21 60 C30 56 33 64 33 71','M78 32 C69 30 67 42 70 47','M79 60 C70 56 67 64 67 71'],
 shield:['M50 8 L85 20 L81 55 C79 73 62 88 50 94 C38 88 21 73 19 55 L15 20 Z','M32 50 L45 62 L70 37'],
 question:['M29 28 C31 15 40 11 50 11 C67 11 74 19 74 32 C74 45 64 50 55 57 L51 67','M51 84 L51 90','M42 84 L58 84'],
 star:['M50 5 L63 36 L96 39 L71 59 L79 92 L50 75 L21 92 L29 59 L4 39 L37 36 Z','M49 14 L55 33'],
 door:['M22 92 L22 11 L78 11 L78 92','M33 92 L33 22 L67 22 L67 92','M56 58 L60 58','M11 92 L88 92'],
 seed:['M50 91 L50 50','M50 57 C23 63 16 42 15 25 C42 23 51 37 50 57 Z','M50 46 C50 23 65 16 87 18 C85 42 71 49 50 46 Z','M37 91 L64 91','M50 60 L44 44'],
 chain:['M45 45 L58 31 C66 23 79 26 86 34 C93 43 89 55 81 62 L69 73 C61 80 49 80 42 73','M57 53 L43 67 C35 75 22 72 15 64 C8 55 12 43 20 36 L32 25 C40 18 52 18 59 25','M34 51 L65 46'],
 eye:['M7 50 C30 17 71 17 93 50 C72 83 29 83 7 50 Z','M50 32 C38 32 31 40 31 50 C31 61 40 69 50 69 C61 69 69 61 69 50 C69 39 61 32 50 32 Z','M50 39 C43 39 40 43 40 50'],
 speech:['M15 15 L85 15 L85 69 L50 69 L26 91 L26 69 L15 69 Z','M29 34 L71 34','M29 45 L67 45','M29 56 L58 56'],
 dove:['M9 72 C21 60 23 56 32 46 C23 33 13 20 12 11 C29 14 44 21 52 35 C66 29 78 32 88 23 C84 44 73 58 58 66 C40 75 28 79 9 72 Z','M52 35 L65 17 L80 14','M87 25 L95 27','M58 66 L54 82'],
 lamb:['M16 59 C8 55 11 43 19 39 C15 28 25 20 36 24 C43 14 57 15 64 23 C75 19 84 29 79 39 C91 47 84 59 75 60','M24 60 L24 85 L34 85 L34 66','M65 61 L65 85 L75 85 L75 59','M76 44 C93 34 97 56 84 65 L74 67','M17 42 L11 37','M87 48 L92 45'],
 cloud:['M25 71 C11 71 6 60 12 48 C17 38 26 36 35 39 C37 22 49 14 62 20 C74 23 78 34 76 42 C92 37 100 47 96 59 C94 67 87 71 75 71 Z'],
 scroll:['M19 17 L81 17 L81 85 L20 85 C9 85 9 72 20 72 C30 72 31 84 20 85','M20 17 C8 17 8 29 19 29 C30 29 30 17 19 17 Z','M29 36 L69 36','M29 47 L69 47','M29 58 L61 58'],
 hand:['M20 77 L13 67 C5 56 14 47 22 54 L35 65 L35 15 C35 3 48 3 48 15 L48 44 L52 30 C55 20 68 24 65 36 C72 26 83 32 78 43 C86 36 95 44 88 57 L74 80 C67 91 55 94 41 94 Z'],
 compass:['M50 9 C27 9 10 27 10 50 C10 72 28 91 50 91 C72 91 90 72 90 50 C90 27 72 9 50 9 Z','M66 34 L58 59 L34 66 L42 41 Z','M50 9 L50 2','M50 91 L50 98','M10 50 L3 50','M90 50 L97 50'],
 gift:['M14 43 L86 43 L86 88 L14 88 Z','M10 34 L90 34 L90 43 L10 43 Z','M47 34 L47 88','M55 34 L55 88','M52 33 C29 35 24 19 32 13 C43 6 49 20 52 33 Z','M52 33 C75 35 80 19 72 13 C61 6 55 20 52 33 Z'],
 ladder:['M25 7 L18 94','M75 7 L82 94','M24 22 L76 22','M23 41 L78 41','M21 61 L80 61','M19 81 L81 81'],
 flower:['M49 47 C33 26 40 13 51 23 C63 8 73 20 62 37 C84 37 86 53 65 56 C72 75 52 79 48 60 C28 77 17 63 34 49 C10 44 18 26 40 37 Z','M49 45 C39 45 40 58 50 59 C61 59 61 45 49 45 Z','M51 60 L51 93','M51 79 C31 66 23 75 36 84 L51 85','M51 75 C69 61 82 71 66 81 L51 85']
};
const iconNames = Object.keys(ICONS);
const MATCHERS = [
 ['cross',/christ|jesus|saviour|savior|crucifi|gospel|messiah|cross|resurrect|lord/i],
 ['lamb',/lamb|sacrifice|shepherd|flock|sheep/i],['book',/bible|scripture|reading|read|learn|teach|knowledge|wisdom|essay|words/i],
 ['heart',/love|affection|marriage|desire|compassion|kindness/i],['brain',/mind|thinking|thought|idea|reason|intelligence|understand|conscious/i],
 ['road',/journey|way|path|walk|travel|direction|choice|step/i],['clock',/time|year|day|hour|minute|season|wait|patience/i],['tree',/tree|fruit|garden|eden|root|growth|branch|forest/i],
 ['seed',/seed|sow|harvest|plant|soil|grow|farm/i],['scales',/justice|judg|balance|fair|right|wrong|law|equity/i],
 ['people',/humanity|community|crowd|family|society|everyone|people|together/i],
 ['person',/man|woman|individual|self|person|human|identity|yourself/i],
 ['home',/home|house|shelter|family|room|building/i],['mountain',/mountain|challenge|struggle|obstacle|trial|difficult|climb/i],
 ['shield',/protect|defend|safe|fear|danger|guard|battle|strength/i],
 ['crown',/king|queen|throne|reign|authority|rule|victory|conquer/i],
 ['key',/key|unlock|open|access|secret|doorway|freedom/i],
 ['water',/water|river|sea|ocean|wash|rain|baptis/i],
 ['flame',/fire|burn|passion|spirit|lightning|heat/i],
 ['globe',/world|earth|creation|planet|nations|global/i],
 ['chain',/prison|bond|slave|bound|captiv|addiction|trap/i],
 ['eye',/see|look|vision|behold|watch|perceive|notice/i],
 ['speech',/speak|say|voice|tell|conversation|question|answer/i],
 ['gift',/grace|gift|blessing|offer|receive|give|generos/i],
 ['dove',/peace|holy spirit|dove|calm|gentle/i],
 ['sun',/sun|light|morning|daybreak|shine|bright/i],
 ['cloud',/cloud|sky|heaven|storm|rainfall/i],
 ['star',/star|hope|promise|future|dream|celestial/i],
 ['door',/door|knock|enter|leave|threshold|opportunit/i],
 ['lightbulb',/insight|discover|realiz|solution|invention|innovation/i],
 ['scroll',/prophet|revelation|letter|message|scroll|history/i]
];
const state={scenes:[],essay:'',selected:0,position:0,playing:false,raf:null,startTime:0,mode:'instant',audioUrl:null,audioBlob:null,audioDuration:null,audioPreview:null,busy:false,ffmpeg:false,windowsTTS:false,exporting:false,drawAbort:null};
let toastTimer=null, saveTimer=null;
function toast(msg,error=false){const el=$('toast');el.textContent=msg;el.className='toast visible'+(error?' error':'');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className='toast',5200);}
function wordCount(s){return (String(s||'').match(/\S+/g)||[]).length;}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function formatted(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function h(s){return String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');}
function nameCase(s){return s.slice(0,1).toUpperCase()+s.slice(1).replace(/([a-z])([A-Z])/g,'$1 $2');}
function chooseIcon(text){for(const [icon,re] of MATCHERS)if(re.test(text))return icon;return 'lightbulb';}
function clipString(s,max){s=String(s||'').trim();return s.length>max?s.slice(0,max-1).replace(/\s+\S*$/,'')+'…':s;}
function makeTitle(text){const source=text.replace(/[“”"'‘’]+/g,'').replace(/^[^A-Za-z0-9]*/, '').split(/[.!?:;,\n]/)[0].trim();return clipString(source.split(/\s+/).slice(0,5).join(' '),46)||'A new idea';}
function instantScenes(text){
  const clean=text.replace(/\r/g,'').trim();
  let units=clean.split(/(?<=[.!?])\s+(?=[A-Z“"'(])|\n\s*\n/g).map(x=>x.trim()).filter(Boolean);
  if(!units.length)units=[clean];
  // Long unpunctuated sentences are split at semicolons and commas.
  units=units.flatMap(u=>wordCount(u)>90?u.split(/(?<=[;:])\s+|(?<=,)\s+(?=[a-zA-Z])/g).filter(Boolean):[u]);
  const wanted=Math.min(55,Math.max(3,Math.ceil(wordCount(clean)/43)));
  const targetWords=Math.max(12,Math.ceil(wordCount(clean)/wanted));
  const chunks=[];let part=[],n=0;
  for(const unit of units){const wc=wordCount(unit);
    if(part.length && n+wc>targetWords*1.35 && chunks.length<wanted-1){chunks.push(part.join(' '));part=[];n=0;}
    part.push(unit);n+=wc;
    if(n>=targetWords*.83 && chunks.length<wanted-1){chunks.push(part.join(' '));part=[];n=0;}
  }
  if(part.length) chunks.push(part.join(' '));
  return chunks.map(body=>{
    const first=body.split(/(?<=[.!?])\s+/)[0];
    return {title:makeTitle(first),caption:clipString(first,116),body,icon:chooseIcon(body.slice(0,250)),duration:clamp(Math.round((wordCount(body)/2.4)*2)/2,4.5,65)};
  });
}
function safeDrawingPaths(input){
 if(!Array.isArray(input)||input.length<2||input.length>16)return null;
 const re=/^[\d\s,.+\-MLHVCQZmlhvcqz]+$/;
 if(!input.every(d=>typeof d==='string'&&d.length>=4&&d.length<=1000&&re.test(d)&&/^[Mm]/.test(d.trim())&&!(d.match(/[-+]?(?:\d+(?:\.\d*)?|\.\d+)/g)||[]).some(n=>!Number.isFinite(Number(n))||Math.abs(Number(n))>150)))return null;
 return input.map(d=>d.trim());
}
function normalizedScene(s){return {title:String(s.title||'New idea').slice(0,80),caption:String(s.caption||'').slice(0,220),body:String(s.body||'').slice(0,2000),icon:iconNames.includes(s.icon)?s.icon:'lightbulb',duration:clamp(Number(s.duration)||7,2,90),drawingPaths:safeDrawingPaths(s.drawingPaths)};}
function currentTimings(){
  if(!state.scenes.length)return [];
  if(state.audioDuration && Number.isFinite(state.audioDuration)){
    const weights=state.scenes.map(s=>Math.max(3,wordCount(s.body)||wordCount(s.caption)||5));
    const total=weights.reduce((a,b)=>a+b,0);
    return weights.map(w=>state.audioDuration*w/total);
  }
  return state.scenes.map(s=>clamp(Number(s.duration)||7,2,90));
}
function totalDuration(){return currentTimings().reduce((a,b)=>a+b,0);}
function locateTime(time){let t=Math.max(0,time),ds=currentTimings();for(let i=0;i<ds.length;i++){if(t<ds[i]||i===ds.length-1)return {index:i,local:Math.min(t,ds[i]),duration:ds[i]};t-=ds[i];}return {index:0,local:0,duration:0};}
function timeForScene(i){return currentTimings().slice(0,i).reduce((a,b)=>a+b,0);}
function setPosition(time, audioSeek=true){state.position=clamp(Number(time)||0,0,totalDuration());drawAt(state.position);if(audioSeek && state.audioPreview&&state.audioDuration){try{state.audioPreview.currentTime=clamp(state.position,0,Math.max(0,state.audioDuration-0.01));}catch{}}updatePlayerUI();}
function stopPlayback(){state.playing=false;cancelAnimationFrame(state.raf);state.raf=null;if(state.audioPreview)state.audioPreview.pause();updatePlayerUI();}
async function togglePlayback(){
 if(state.exporting)return;
 if(!state.scenes.length)return toast('Create some scenes first.');
 if(state.playing){stopPlayback();return;}
 if(state.position>=totalDuration()-.05)state.position=0;
 state.playing=true;state.startTime=performance.now()-state.position*1000;
 if(state.audioPreview){try{state.audioPreview.currentTime=Math.min(state.position,Math.max(0,(state.audioDuration||0)-.02));await state.audioPreview.play();}catch(e){stopPlayback();return toast('The narration could not play: '+e.message,true);}}
 function frame(now){if(!state.playing)return;let pos=(now-state.startTime)/1000;if(state.audioPreview && !state.audioPreview.paused && state.audioDuration)pos=state.audioPreview.currentTime;
   setPosition(pos,false);
   if(pos>=totalDuration()-.05){stopPlayback();setPosition(totalDuration(),false);return;}
   state.raf=requestAnimationFrame(frame);
 }
 state.raf=requestAnimationFrame(frame);updatePlayerUI();
}
function updatePlayerUI(){
 const dur=totalDuration();$('timeReadout').textContent=formatted(state.position)+' / '+formatted(dur);
 $('scrubber').value=dur?Math.round(state.position/dur*1000):0;
 $('playBtn').textContent=state.playing?'❚❚':'▶'; $('playBtn').setAttribute('aria-label',state.playing?'Pause':'Play');
 const loc=locateTime(state.position);$('sceneBadge').textContent=state.scenes.length?`SCENE ${loc.index+1} / ${state.scenes.length}`:'NO SCENES YET';
}
const pointCache=new Map();
function samplesForIcon(key,drawingPaths=null){
 const paths=drawingPaths||ICONS[key]||ICONS.lightbulb;
 const cacheKey=drawingPaths?'ai:'+paths.join('|'):key;
 if(pointCache.has(cacheKey))return pointCache.get(cacheKey);
 const samples=[];
 for(const d of paths){try{const el=document.createElementNS(svgNS,'path');el.setAttribute('d',d);$('svgMeasure').appendChild(el);
   const len=el.getTotalLength();let pts=[];const steps=Math.max(3,Math.ceil(len/1.4));for(let i=0;i<=steps;i++){let p=el.getPointAtLength(len*i/steps);pts.push([p.x,p.y]);}
   el.remove();samples.push({points:pts,length:len});}catch(e){console.warn('Invalid icon path',key,e);}}
 if(pointCache.size>200)pointCache.clear();
 pointCache.set(cacheKey,samples);return samples;
}
function iconSVG(key,drawingPaths=null){const paths=drawingPaths||ICONS[key]||ICONS.lightbulb;return `<svg viewBox="0 0 100 100" fill="none" stroke="#262821" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8" aria-hidden="true">${paths.map(d=>`<path d="${h(d)}"/>`).join('')}</svg>`;}
function traceIcon(key,x,y,size,progress,drawingPaths=null){
 const strokes=samplesForIcon(key,drawingPaths),total=strokes.reduce((a,s)=>a+s.length,0),cut=total*clamp(progress,0,1);let spent=0,tip=null;
 ctx.save();ctx.translate(x-size/2,y-size/2);ctx.scale(size/100,size/100);ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='#292a28';ctx.lineWidth=2.35;
 for(const s of strokes){const frac=clamp((cut-spent)/s.length,0,1),idx=Math.round((s.points.length-1)*frac);
   if(idx>0){ctx.beginPath();ctx.moveTo(...s.points[0]);for(let i=1;i<=idx;i++)ctx.lineTo(...s.points[i]);ctx.stroke();tip=s.points[idx];}
   spent+=s.length;if(spent>cut)break;
 }
 ctx.restore();return tip?{x:x-size/2+tip[0]*size/100,y:y-size/2+tip[1]*size/100}:null;
}
function drawMarker(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(-.75);ctx.shadowColor='#0002';ctx.shadowBlur=6;ctx.shadowOffsetY=4;ctx.fillStyle='#f6f0dc';ctx.strokeStyle='#4b4840';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(-11,-10,22,103,6);ctx.fill();ctx.stroke();ctx.fillStyle='#222';ctx.fillRect(-11,0,22,30);ctx.fillStyle='#272726';ctx.beginPath();ctx.moveTo(-9,-10);ctx.lineTo(0,-31);ctx.lineTo(9,-10);ctx.closePath();ctx.fill();ctx.restore();}
function drawLine(x1,y1,x2,y2,progress=1){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+(x2-x1)*progress,y1+(y2-y1)*progress);ctx.stroke();}
function wrap(s,maxWidth,font,maxLines){ctx.font=font;const tokens=String(s||'').split(/\s+/),lines=[];let line='';for(const word of tokens){const next=line?line+' '+word:word;
  if(ctx.measureText(next).width>maxWidth && line){lines.push(line);line=word;}else line=next;
 } if(line)lines.push(line);if(lines.length>maxLines){let last=lines.slice(maxLines-1).join(' ');while(last.length && ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);return [...lines.slice(0,maxLines-1),last+'…'];}return lines;}
function drawAt(position, showMarker=true){
 ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.globalAlpha=1;ctx.fillStyle='#fdfcf8';ctx.fillRect(0,0,W,H);
 // Paper texture and the visible whiteboard frame.
 ctx.strokeStyle='#efece5';ctx.lineWidth=2;ctx.strokeRect(30,30,1220,660);
 ctx.fillStyle='#adafa5';ctx.font='bold 17px Segoe UI, sans-serif';ctx.fillText('WHITEBOARD   /   STORIES IN MOTION',87,81);
 if(!state.scenes.length){
   ctx.fillStyle='#252721';ctx.textAlign='center';ctx.font='64px Georgia,serif';ctx.fillText('Your story starts here.',640,322);
   ctx.fillStyle='#969a91';ctx.font='24px Segoe UI, sans-serif';ctx.fillText('Paste an essay  →  Create scenes  →  Press play',640,376);ctx.textAlign='left';
   ctx.strokeStyle='#e28c66';ctx.lineWidth=5;drawLine(445,412,835,412);return;
 }
 const loc=locateTime(position),s=state.scenes[loc.index],d=Math.max(.1,loc.duration);
 let t=loc.local;
 const fade=clamp(t/.35,0,1);
 ctx.globalAlpha=fade;
 // Title enters ahead of the sketch.
 const headline=clipString(s.title,72);
 ctx.fillStyle='#272824';ctx.font='normal 58px Georgia,serif';
 const titleLines=wrap(headline,488,'normal 58px Georgia,serif',2);
 titleLines.forEach((line,i)=>ctx.fillText(line,90,228+i*71));
 ctx.strokeStyle='#e17955';ctx.lineWidth=6;ctx.lineCap='round';drawLine(90,260+(titleLines.length-1)*71,390,260+(titleLines.length-1)*71,clamp((t-.3)/.8,0,1));
 ctx.fillStyle='#70746d';ctx.font='24px "Segoe Print", "Comic Sans MS", sans-serif';
 const captionText=s.caption||s.body||'';
 const maxChars=Math.ceil(captionText.length*clamp((t-.65)/Math.min(2,d*.36),0,1));
 const captionLines=wrap(captionText.slice(0,maxChars),480,'24px "Segoe Print", "Comic Sans MS", sans-serif',5);
 let captionStart=340+(titleLines.length-1)*54;
 captionLines.forEach((line,i)=>ctx.fillText(line,91,captionStart+i*45));
 const animStart=Math.min(.6,d*.1), animStop=Math.max(animStart+.15,d-.28);
 const sketchP=clamp((t-animStart)/(animStop-animStart),0,1);
 let tip=traceIcon(s.icon,900,375,365,sketchP,s.drawingPaths);
 if(showMarker && t>animStart&&sketchP<.995&&tip)drawMarker(tip.x,tip.y);
 ctx.fillStyle='#b4b7ad';ctx.font='bold 16px Segoe UI, sans-serif';ctx.fillText('SCENE '+String(loc.index+1).padStart(2,'0'),90,630);
 ctx.textAlign='right';ctx.fillText(String(loc.index+1).padStart(2,'0')+' / '+String(state.scenes.length).padStart(2,'0'),1188,630);ctx.textAlign='left';
 ctx.globalAlpha=1;
 // Very subtle transition wash between scenes.
 if(t<.17){ctx.fillStyle=`rgba(253,252,248,${(1-t/.17)*.75})`;ctx.fillRect(33,33,1214,654);}
}
function renderScenes(){
 const box=$('sceneStrip'); if(!state.scenes.length){box.innerHTML='<div class="empty-scenes">Your scenes will appear here after you paste an essay and create your storyboard. <span>↗</span></div>';$('editorPanel').classList.add('hidden');$('sceneCount').textContent='0 scenes';return;}
 $('sceneCount').textContent=state.scenes.length+' scene'+(state.scenes.length===1?'':'s');
 box.innerHTML=state.scenes.map((s,i)=>`<button type="button" class="scene-tile${i===state.selected?' selected':''}" data-scene="${i}" aria-label="Edit scene ${i+1}: ${h(s.title)}"><div class="scene-art">${iconSVG(s.icon,s.drawingPaths)}${s.drawingPaths?'<span class="ai-sketch-label">AI SKETCH</span>':''}</div><div class="scene-text"><div class="scene-meta"><span>SCENE ${String(i+1).padStart(2,'0')}</span><span>${Math.round(currentTimings()[i]||0)}s</span></div><div class="scene-name">${h(s.title)}</div></div></button>`).join('');
 box.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>selectScene(Number(b.dataset.scene))));
 fillEditor();
}
function selectScene(i){if(!state.scenes.length)return;stopPlayback();state.selected=clamp(i,0,state.scenes.length-1);setPosition(timeForScene(state.selected)+Math.min(7,currentTimings()[state.selected]*.6));renderScenes();}
function fillEditor(){const s=state.scenes[state.selected];if(!s){$('editorPanel').classList.add('hidden');return;}
 $('editorPanel').classList.remove('hidden');$('editingNumber').textContent=String(state.selected+1).padStart(2,'0');
 $('sceneTitleInput').value=s.title;$('sceneCaptionInput').value=s.caption;$('iconSelect').value=s.icon;$('durationInput').value=s.duration;$('sceneBodyInput').value=s.body;
 $('useIconBtn').classList.toggle('hidden',!s.drawingPaths);
 $('moveLeftBtn').disabled=state.selected===0;$('moveRightBtn').disabled=state.selected===state.scenes.length-1;
}
function scheduleSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem('whiteboard-studio-draft',JSON.stringify({essay:$('essay').value,scenes:state.scenes,selected:state.selected}));}catch{}},600);}
function updateDraft(){state.essay=$('essay').value;$('wordCount').textContent=wordCount(state.essay)+' words';scheduleSave();}
function redrawAndSave(){drawAt(state.position);scheduleSave();}
function updateAudioControls(){if(state.audioUrl){$('audioStatus').textContent=`Narration attached · ${formatted(state.audioDuration)}. Scene timings follow the voiceover.`;$('removeAudioBtn').classList.remove('hidden');}else{$('audioStatus').textContent='No audio attached. The video will be silent.';$('removeAudioBtn').classList.add('hidden');}renderScenes();updatePlayerUI();}
async function setAudio(blob){if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);if(state.audioPreview){state.audioPreview.pause();state.audioPreview=null;}
 const url=URL.createObjectURL(blob);const a=new Audio(url);a.preload='metadata';
 const duration=await new Promise((resolve,reject)=>{a.onloadedmetadata=()=>resolve(a.duration);a.onerror=()=>reject(new Error('Unsupported audio file'));setTimeout(()=>reject(new Error('Timed out reading audio')),15000);});
 if(!Number.isFinite(duration)||duration<=0){URL.revokeObjectURL(url);throw new Error('Invalid audio duration.');}
 state.audioBlob=blob;state.audioUrl=url;state.audioPreview=a;state.audioDuration=duration;stopPlayback();setPosition(0);updateAudioControls();
}
function removeAudio(){stopPlayback();if(state.audioUrl)URL.revokeObjectURL(state.audioUrl);state.audioUrl=null;state.audioPreview=null;state.audioDuration=null;state.audioBlob=null;setPosition(0);updateAudioControls();}
function download(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}
function lockUI(busy){state.busy=busy;for(const id of ['generateBtn','mp4Btn','webmBtn','makeVoiceBtn','aiBtn','instantBtn','drawAllBtn','regenDrawBtn'])$(id).disabled=busy;}
async function findModels(){
 try{const r=await fetch('/api/ollama-models');const x=await r.json();const el=$('modelSelect');el.innerHTML='';if(!x.models.length){el.innerHTML='<option value="">Ollama is not running</option>';toast('No local Ollama models found. Use Instant scenes instead.');return;}
 x.models.forEach(model=>{const o=document.createElement('option');o.textContent=model;o.value=model;el.appendChild(o);});toast(x.models.length+' Ollama model'+(x.models.length===1?'':'s')+' available.');
 }catch(e){toast('Could not connect to Ollama: '+e.message,true);}
}
async function getDrawingModel(){
 const preferred=$('modelSelect').value;
 if(preferred)return preferred;
 const r=await fetch('/api/ollama-models');if(!r.ok)throw new Error('Cannot read Ollama models.');
 const list=(await r.json()).models||[];
 if(!list.length)throw new Error('No Ollama model is running locally. Start Ollama first or use built-in sketches.');
 return list[0];
}
async function drawSceneWithModel(scene,model,signal){
 const r=await fetch('/api/generate-scene-svg',{
   method:'POST',headers:{'Content-Type':'application/json'},signal,
   body:JSON.stringify({model,title:scene.title,caption:scene.caption,body:scene.body})
 });
 const answer=await r.json();
 if(!r.ok)throw new Error(answer.error||'Drawing generation failed.');
 const paths=safeDrawingPaths(answer.paths);
 if(!paths)throw new Error('The model returned unsafe paths.');
 scene.drawingPaths=paths;
 renderScenes();drawAt(state.position);scheduleSave();
}
async function drawAllScenes(single=false){
 if(state.busy)return;
 if(!state.scenes.length)return toast('Create your storyboard first.');
 stopPlayback();let model;
 try{model=await getDrawingModel();}catch(e){return toast(e.message,true);}
 state.drawAbort=new AbortController();lockUI(true);
 $('stopDrawBtn').classList.remove('hidden');
 const targets=single?[state.scenes[state.selected]]:state.scenes.slice();
 let completed=0,failed=0,attempted=0;
 try{
   for(const scene of targets){
     if(state.drawAbort.signal.aborted)break;
     attempted++;
     $('drawStatus').textContent='Drawing '+attempted+' of '+targets.length+' with '+model+'…';
     try{await drawSceneWithModel(scene,model,state.drawAbort.signal);completed++;}
     catch(e){if(e.name==='AbortError')break;failed++;console.warn('Sketch fallback:',e.message);}
   }
   const cancelled=state.drawAbort.signal.aborted;
   $('drawStatus').textContent=cancelled?'Stopped. '+completed+' sketches kept; the rest use library icons.':'Complete: '+completed+' custom sketches, '+failed+' library fallbacks.';
   toast(cancelled?'Stopped drawing.':'Custom sketches: '+completed+'; fallback icons: '+failed+'.');
 }finally{state.drawAbort=null;$('stopDrawBtn').classList.add('hidden');lockUI(false);renderScenes();scheduleSave();}
}
async function createScenes(){const essay=$('essay').value.trim();if(wordCount(essay)<5)return toast('Paste at least a few sentences to begin.',true);
 if(essay.length>45000)return toast('This first version supports essays up to 45,000 characters.',true);
 let autoDraw=false;
 stopPlayback();lockUI(true);$('generateBtn').textContent='Generating storyboard…';
 try{
   let scenes;
   if(state.mode==='ai'){
     const model=$('modelSelect').value;if(!model)throw new Error('Choose an Ollama model first or switch to Instant scenes.');
     const resp=await fetch('/api/ollama-plan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:essay,model,sceneCount:Math.ceil(wordCount(essay)/42)})});
     const result=await resp.json();if(!resp.ok)throw new Error(result.error||'Ollama planning failed');scenes=result.scenes;
   }else scenes=instantScenes(essay);
   if(!scenes.length)throw new Error('No scenes were generated');
   state.scenes=scenes.map(normalizedScene);state.selected=0;setPosition(Math.min(currentTimings()[0]*.6,7));renderScenes();scheduleSave();
   toast(`Created ${state.scenes.length} scenes. Choose one to edit, or press Play.`);
   autoDraw=$('smartDrawToggle').checked;
   $('storyboardSection').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(e){toast(e.message,true);}finally{lockUI(false);$('generateBtn').innerHTML='<span>✳</span> Create my storyboard <span class="btn-arrow">→</span>';}
 if(autoDraw)await drawAllScenes();
}
async function generateVoice(){if(state.busy)return;const essay=$('essay').value.trim();if(!essay)return toast('Paste your essay first.',true);
 if(!state.windowsTTS)return toast('Windows speech synthesis is unavailable here. Import a narration file instead.',true);
 lockUI(true);$('audioStatus').textContent='Generating narration locally on Windows…';
 try {const r=await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:essay,rate:Number($('voiceRate').value)})});
   if(!r.ok){const x=await r.json();throw new Error(x.error||'Voice generation failed');}
   await setAudio(await r.blob());toast('Offline narration is ready.');
 }catch(e){$('audioStatus').textContent='Could not generate narration. Import an audio file instead.';toast(e.message,true);}finally{lockUI(false);}
}
function setExportProgress(p,text){$('exportProgress').classList.remove('hidden');$('progressBar').style.width=Math.round(p*100)+'%';$('progressText').textContent=text;}
async function exportVideo(format){
 if(state.exporting||state.busy)return;
 if(!state.scenes.length)return toast('Create your storyboard first.',true);
 if(format==='mp4'&&!state.ffmpeg)return toast('MP4 needs FFmpeg. Install FFmpeg and restart, or export WebM now.',true);
 if(!canvas.captureStream||!window.MediaRecorder)return toast('Video recording needs Chrome or Edge.',true);
 const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(m=>MediaRecorder.isTypeSupported(m));
 if(!mime)return toast('This browser cannot record WebM. Use current Chrome or Edge.',true);
 stopPlayback();state.exporting=true;lockUI(true);$('mp4Btn').textContent='Recording…';$('webmBtn').textContent='Recording…';
 const oldPosition=state.position;let media=null, audioContext=null, sourceAudio=null, stream=null;
 try{
   const duration=totalDuration();const videoStream=canvas.captureStream(30);
   stream=new MediaStream(videoStream.getVideoTracks());
   if(state.audioUrl){
     sourceAudio=new Audio(state.audioUrl);sourceAudio.preload='auto';
     await new Promise((resolve,reject)=>{sourceAudio.oncanplay=resolve;sourceAudio.onerror=()=>reject(new Error('Unable to load narration.'));sourceAudio.load();});
     audioContext=new (window.AudioContext||window.webkitAudioContext)();const destination=audioContext.createMediaStreamDestination();
     const source=audioContext.createMediaElementSource(sourceAudio);source.connect(destination);source.connect(audioContext.destination);
     for(const track of destination.stream.getAudioTracks())stream.addTrack(track);
     await audioContext.resume();
   }
   const chunks=[];media=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2500000});
   const finished=new Promise((resolve,reject)=>{media.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};media.onerror=e=>reject(new Error('Video encoder failed: '+(e.error?.message||'Unknown error')));media.onstop=()=>resolve(new Blob(chunks,{type:mime}));});
   drawAt(0,false);media.start(300);
   if(sourceAudio)await sourceAudio.play();
   const began=performance.now();
   await new Promise(resolve=>{
     const tick=now=>{const t=clamp((now-began)/1000,0,duration);drawAt(t,false);
       setExportProgress(duration?t/duration:1,`Recording scene ${locateTime(t).index+1} of ${state.scenes.length} · ${formatted(t)} / ${formatted(duration)}`);
       if(t>=duration){resolve();return;}requestAnimationFrame(tick);
     };requestAnimationFrame(tick);
   });
   if(media.state!=='inactive')media.stop();const blob=await finished;
   if(blob.size<1000)throw new Error('The browser produced an empty video.');
   if(format==='webm'){download(blob,'whiteboard-animation.webm');toast('WebM video saved.');}
   else{
     setExportProgress(.98,'Converting to MP4 using local FFmpeg…');
     const r=await fetch('/api/convert',{method:'POST',headers:{'Content-Type':'video/webm'},body:blob});
     if(!r.ok){let m='MP4 conversion failed';try{m=(await r.json()).error||m;}catch{}throw new Error(m);}
     const mp4=await r.blob();download(mp4,'whiteboard-animation.mp4');toast('MP4 video saved.');
   }
   setExportProgress(1,'Your video has been downloaded.');
 }catch(e){toast(e.message||'Export failed',true);setExportProgress(0,'Export failed. You can try again.');}
 finally{
   if(sourceAudio){sourceAudio.pause();sourceAudio.src='';}
   if(media&&media.state!=='inactive')try{media.stop();}catch{}
   if(stream)stream.getTracks().forEach(t=>t.stop());if(audioContext)try{await audioContext.close();}catch{}
   state.exporting=false;lockUI(false);$('mp4Btn').innerHTML='↓ Export MP4 <span class="btn-arrow">→</span>';$('webmBtn').textContent='Export WebM';setPosition(oldPosition);
 }
}
function saveProject(){const obj={format:'whiteboard-studio-project',version:1,saved:new Date().toISOString(),essay:$('essay').value,scenes:state.scenes};download(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),'whiteboard-project.json');toast('Project saved as JSON. Import narration separately next time.');}
async function openProject(file){try{const obj=JSON.parse(await file.text());if(obj.format!=='whiteboard-studio-project'||!Array.isArray(obj.scenes)||typeof obj.essay!=='string')throw new Error('This is not a valid Whiteboard Studio project.');
   if(obj.scenes.length>60||obj.essay.length>45000)throw new Error('Project is too large.');
   stopPlayback();removeAudio();$('essay').value=obj.essay;updateDraft();state.scenes=obj.scenes.map(normalizedScene);state.selected=0;setPosition(Math.min(currentTimings()[0]*.6,7));renderScenes();scheduleSave();toast('Project opened.');
 }catch(e){toast(e.message,true);}}
function attachEvents(){
 $('essay').addEventListener('input',updateDraft);
 $('instantBtn').addEventListener('click',()=>setMode('instant'));
 $('aiBtn').addEventListener('click',()=>setMode('ai'));
 $('refreshModelsBtn').addEventListener('click',findModels);
 $('generateBtn').addEventListener('click',createScenes);
 $('drawAllBtn').addEventListener('click',()=>drawAllScenes(false));
 $('regenDrawBtn').addEventListener('click',()=>drawAllScenes(true));
 $('stopDrawBtn').addEventListener('click',()=>state.drawAbort?.abort());
 $('useIconBtn').addEventListener('click',()=>{const scene=state.scenes[state.selected];if(!scene)return;scene.drawingPaths=null;renderScenes();drawAt(state.position);scheduleSave();});
 $('playBtn').addEventListener('click',togglePlayback);
 $('restartBtn').addEventListener('click',()=>{stopPlayback();setPosition(0);});
 $('scrubber').addEventListener('input',e=>{const was=state.playing;stopPlayback();setPosition(totalDuration()*Number(e.target.value)/1000);if(was)togglePlayback();});
 $('addSceneBtn').addEventListener('click',()=>{stopPlayback();const i=state.scenes.length?state.selected+1:0;state.scenes.splice(i,0,{title:'A new idea',caption:'Explain your next point…',icon:'lightbulb',body:'',duration:6});state.selected=i;setPosition(timeForScene(i)+Math.min(3,currentTimings()[i]*.5));renderScenes();scheduleSave();});
 $('moveLeftBtn').addEventListener('click',()=>moveScene(-1));$('moveRightBtn').addEventListener('click',()=>moveScene(1));
 $('deleteSceneBtn').addEventListener('click',()=>{if(!state.scenes.length)return;stopPlayback();state.scenes.splice(state.selected,1);state.selected=Math.max(0,Math.min(state.selected,state.scenes.length-1));setPosition(timeForScene(state.selected));renderScenes();scheduleSave();});
 const inputs=[['sceneTitleInput','title'],['sceneCaptionInput','caption'],['iconSelect','icon'],['durationInput','duration'],['sceneBodyInput','body']];
 for(const [id,key] of inputs){$(id).addEventListener((id==='iconSelect'||id==='durationInput')?'change':'input',e=>{const s=state.scenes[state.selected];if(!s)return;s[key]=key==='duration'?clamp(Number(e.target.value)||2,2,90):e.target.value;if(key==='icon')s.drawingPaths=null;const pos=state.position;renderScenes();setPosition(Math.min(pos,totalDuration()),false);if(id!=='iconSelect'){const field=$(id);field.focus();if(field.type!=='number' && typeof field.setSelectionRange==='function'){try{field.setSelectionRange(e.target.selectionStart||0,e.target.selectionEnd||0);}catch{}}}scheduleSave();});}
 $('saveProjectBtn').addEventListener('click',saveProject);$('openProjectBtn').addEventListener('click',()=>$('openProjectInput').click());
 $('openProjectInput').addEventListener('change',async e=>{if(e.target.files[0])await openProject(e.target.files[0]);e.target.value='';});
 $('makeVoiceBtn').addEventListener('click',generateVoice);
 $('audioFileInput').addEventListener('change',async e=>{const file=e.target.files[0];if(file)try{await setAudio(file);toast('Narration imported.');}catch(err){toast(err.message,true);}e.target.value='';});
 $('removeAudioBtn').addEventListener('click',removeAudio);
 $('voiceRate').addEventListener('input',e=>{$('voiceRateValue').textContent=({'-4':'Slowest','-3':'Slower','-2':'Slow','-1':'Relaxed','0':'Normal','1':'Brisk','2':'Fast','3':'Faster','4':'Fastest'})[e.target.value]||'Normal';});
 $('mp4Btn').addEventListener('click',()=>exportVideo('mp4'));
 $('webmBtn').addEventListener('click',()=>exportVideo('webm'));
 document.addEventListener('keydown',e=>{if(e.code==='Space'&&!['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement.tagName)){e.preventDefault();togglePlayback();}});
}
function moveScene(by){const i=state.selected,j=i+by;if(j<0||j>=state.scenes.length)return;stopPlayback();[state.scenes[i],state.scenes[j]]=[state.scenes[j],state.scenes[i]];state.selected=j;setPosition(timeForScene(j));renderScenes();scheduleSave();}
function setMode(mode){state.mode=mode;$('instantBtn').classList.toggle('active',mode==='instant');$('aiBtn').classList.toggle('active',mode==='ai');$('aiOptions').classList.toggle('hidden',mode!=='ai');if(mode==='ai'&&!$('modelSelect').value)findModels();}
async function init(){
 $('iconSelect').innerHTML=iconNames.map(x=>`<option value="${x}">${nameCase(x)}</option>`).join('');attachEvents();
 try{const saved=JSON.parse(localStorage.getItem('whiteboard-studio-draft')||'null');if(saved && typeof saved.essay==='string' && Array.isArray(saved.scenes)){$('essay').value=saved.essay;state.scenes=saved.scenes.slice(0,60).map(normalizedScene);state.selected=clamp(Number(saved.selected)||0,0,Math.max(0,state.scenes.length-1));}}
 catch{}
 updateDraft();renderScenes();drawAt(0);updatePlayerUI();
 try{const r=await fetch('/api/status');const s=await r.json();state.ffmpeg=!!s.ffmpeg;state.windowsTTS=!!s.windowsTTS;$('ffmpegStatus').textContent=state.ffmpeg?'MP4 / WebM':'WebM (MP4 needs FFmpeg)';if(!state.windowsTTS){$('makeVoiceBtn').disabled=true;$('makeVoiceBtn').title='Offline voice generation is available on Windows';}}
 catch{$('ffmpegStatus').textContent='WebM available';}
}
init();
})();

/* BCON flythrough: self-playing bass film, then bending brand chapters with break-throughs. */
import * as THREE from 'three';
import { CH } from './brands';

export function startFlight(){
const BRANDS=CH.map(c=>[c.name,c.crafts]);


const chipsFor=(ul,c)=>{ul.innerHTML="";c.forEach(x=>{const li=document.createElement("li");li.textContent=x;ul.append(li)})};
const wall=document.getElementById("wall");
BRANDS.forEach(([n,c])=>{const d=document.createElement("article");d.className="card";const h=document.createElement("h3");h.textContent=n;const u=document.createElement("ul");u.className="chips";chipsFor(u,c);d.append(h,u);wall.append(d)});

const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};

function sampleText(text,count,worldW){
  const W=1400,H=440,c=document.createElement("canvas");c.width=W;c.height=H;
  const x=c.getContext("2d",{willReadFrequently:true});
  x.fillStyle="#fff";x.textAlign="center";x.textBaseline="middle";
  let size=340;x.font=`800 ${size}px Syne, "Arial Black", sans-serif`;
  const m=x.measureText(text).width;if(m>W*.94){size*=W*.94/m;x.font=`800 ${size}px Syne, "Arial Black", sans-serif`}
  x.fillText(text,W/2,H/2);
  const d=x.getImageData(0,0,W,H).data,pts=[];
  for(let j=0;j<H;j+=2)for(let i=0;i<W;i+=2)if(d[(j*W+i)*4+3]>128)pts.push(i,j);
  const out=new Float32Array(count*3),k=worldW/W;
  for(let n=0;n<count;n++){const p=Math.floor(Math.random()*pts.length/2)*2;
    out[n*3]=(pts[p]-W/2+Math.random()*2)*k;out[n*3+1]=-(pts[p+1]-H/2+Math.random()*2)*k;out[n*3+2]=(Math.random()-.5)*.25}
  return out}

/* Original bassline, synthesized live with Web Audio. No samples or third-party music. */
const Sound={ctx:null,master:null,an:null,buf:null,filter:null,on:false,timer:null,
  start(){
    if(this.ctx){return}
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
    const c=this.ctx=new AC();
    this.master=c.createGain();this.master.gain.value=.85;
    const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;
    this.an=c.createAnalyser();this.an.fftSize=512;this.an.smoothingTimeConstant=.55;
    this.buf=new Uint8Array(this.an.frequencyBinCount);
    this.master.connect(comp);comp.connect(this.an);this.an.connect(c.destination);
    this.filter=c.createBiquadFilter();this.filter.type="lowpass";this.filter.frequency.value=180;this.filter.Q.value=13;
    this.filter.connect(this.master);
    const n=c.sampleRate*.4;this.noise=c.createBuffer(1,n,c.sampleRate);
    const d=this.noise.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
    this.next=c.currentTime+.08;this.step=0;this.on=true;
    this.timer=setInterval(()=>this.schedule(),25)},
  schedule(){
    const c=this.ctx,s16=60/126/4;
    while(this.next<c.currentTime+.14){
      const st=this.step%32,bar=st%16,t=this.next;
      const line=[33,0,33,33,0,33,0,36,33,0,33,0,31,0,28,31,33,0,33,33,0,36,0,40,38,0,36,0,33,0,31,28];
      if(bar%4===0)this.kick(t);
      if(line[st])this.bass(t,line[st],s16*1.5);
      if(this.level>.08&&bar%4===2)this.hit(t,"highpass",7500,.05,.16);
      if(this.level>.22&&(bar===4||bar===12))this.hit(t,"bandpass",1700,.14,.3);
      this.next+=s16;this.step++}},
  kick(t){const c=this.ctx,o=c.createOscillator(),g=c.createGain();
    o.type="sine";o.frequency.setValueAtTime(155,t);o.frequency.exponentialRampToValueAtTime(44,t+.11);
    g.gain.setValueAtTime(1,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);
    o.connect(g);g.connect(this.master);o.start(t);o.stop(t+.32)},
  bass(t,midi,dur){const c=this.ctx,f=440*Math.pow(2,(midi-69)/12),g=c.createGain();
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.62,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    g.connect(this.filter);
    [["sawtooth",1,0],["square",.5,7],["sine",.5,0]].forEach(([type,mul,det])=>{const o=c.createOscillator();
      o.type=type;o.frequency.value=f*mul;o.detune.value=det;o.connect(g);o.start(t);o.stop(t+dur+.02)})},
  hit(t,type,freq,dur,vol){const c=this.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
    s.buffer=this.noise;fl.type=type;fl.frequency.value=freq;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
    s.connect(fl);fl.connect(g);g.connect(this.master);s.start(t);s.stop(t+dur+.02)},
  level:0,
  riser(t,dur){const c=this.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();
    s.buffer=this.noise;s.loop=true;fl.type="bandpass";fl.Q.value=4;
    fl.frequency.setValueAtTime(300,t);fl.frequency.exponentialRampToValueAtTime(7000,t+dur);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.4,t+dur);g.gain.setValueAtTime(.0001,t+dur+.01);
    s.connect(fl);fl.connect(g);g.connect(this.master);s.start(t);s.stop(t+dur+.02)},
  fadeOut(){if(!this.ctx||!this.on)return;
    this.master.gain.setTargetAtTime(.5,this.ctx.currentTime,.5)},
  update(p,vel){
    if(!this.ctx)return 0;
    this.level=p;
    const c=this.ctx,now=c.currentTime,rate=126/60*(Math.abs(vel)>.25?4:2);
    const wob=.5+.5*Math.sin(now*Math.PI*2*rate);
    const open=clamp(.08+p*.6+Math.abs(vel)*.9);
    this.filter.frequency.setTargetAtTime(150+open*2900*(.25+.75*wob),now,.018);
    this.an.getByteFrequencyData(this.buf);
    return this.on?Math.pow((this.buf[0]+this.buf[1]+this.buf[2])/765,3):0},
  toggle(){if(!this.ctx)return;this.on=!this.on;
    this.master.gain.setTargetAtTime(this.on?.85:0,this.ctx.currentTime,.05);return this.on}};
document.addEventListener("visibilitychange",()=>{if(!Sound.ctx)return;document.hidden?Sound.ctx.suspend():Sound.ctx.resume()});

/* The film plays itself on the music grid: logo hold, drop, flight past the brands, CODE, then the page. */
const BAR=60/126*4,HOLD=2,FLIGHT=22,TAIL=2;
const Play={started:false,done:false,t0:0,
  now(){return Sound.ctx?Sound.ctx.currentTime:performance.now()/1000},
  elapsed(){return this.started?this.now()-this.t0:0},
  begin(){
    this.started=true;this.t0=this.now();
    scrollTo(0,0);document.documentElement.classList.add("locked");
    document.getElementById("skip").hidden=false;
    if(Sound.ctx){Sound.next=this.t0+.02;Sound.riser(this.t0+BAR,BAR);Sound.hit(this.t0+HOLD*BAR,"highpass",2800,1.4,.4)}},
  finish(){
    if(this.done)return;this.done=true;
    Sound.fadeOut();
    document.getElementById("skip").hidden=true;
    const veil=document.getElementById("veil");veil.style.opacity=1;
    setTimeout(()=>{document.documentElement.classList.remove("locked");World.enter();veil.style.opacity=0},560)}};

/* Act two: page content stays real HTML, and WebGL planes follow it, bending with scroll speed. */

const World={active:false,planes:[],zones:[],cache:{},y:0,prev:0,v:0,bass:0,
  build(){
    const host=document.getElementById("chapters");
    CH.forEach((c,i)=>{
      const sec=document.createElement("article");
      const hero=document.createElement("section");hero.className="ch-hero";hero.dataset.src=c.hero;hero.dataset.ch=i;
      const h=document.createElement("h3");h.textContent=c.name;h.style.fontSize=`min(${(88/(c.name.length*1.24)).toFixed(1)}vw,210px)`;hero.append(h);
      const body=document.createElement("div");body.className="ch-body";
      const meta=document.createElement("div");meta.className="ch-meta";
      const p=document.createElement("p");p.textContent=c.line;
      const d1=document.createElement("div");d1.innerHTML="<h4>WHAT WE MADE</h4>";const u=document.createElement("ul");u.className="chips";chipsFor(u,c.crafts);d1.append(u);
      const d2=document.createElement("div");d2.innerHTML="<h4>CLIENT</h4>";d2.append(document.createTextNode(c.sector));
      if(c.live){const a=document.createElement("a");a.href=c.live;a.target="_blank";a.rel="noopener";a.textContent="Visit live ↗";a.style.display="block";a.style.marginTop="10px";d2.append(a)}
      meta.append(p,d1,d2);
      const st=document.createElement("div");st.className="stagger";
      c.items.forEach(it=>{
        const f=document.createElement("figure");f.className="fig";f.style.setProperty("--c",it.c);f.style.setProperty("--t",it.t);
        const b=document.createElement("div");b.className="box";b.style.setProperty("--ar",it.ar);b.dataset.src=it.src;
        if(!it.src.endsWith(".mp4")&&!it.src.endsWith(".art")){const im=document.createElement("img");im.src="/flight/assets/"+it.src;im.alt=it.cap;im.loading="lazy";b.append(im)}
        const cap=document.createElement("figcaption");cap.textContent=it.cap;f.append(b,cap);st.append(f)});
      body.append(meta,st);sec.append(hero,body);
      if(i<CH.length-1){const z=document.createElement("div");z.className="zone";z.dataset.next=i+1;sec.append(z)}
      host.append(sec)})},
  tex(src){
    if(this.cache[src])return this.cache[src];
    return this.cache[src]=fetch("/flight/assets/"+src).then(r=>{if(!r.ok)throw 0;return r.blob()}).then(bl=>{
      const url=URL.createObjectURL(bl);
      if(src.endsWith(".mp4")){const v=document.createElement("video");v.src=url;v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute("playsinline","");v.preload="auto";
        return new Promise(res=>{v.addEventListener("loadeddata",()=>{const t=new THREE.VideoTexture(v);t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;res({t,w:v.videoWidth,h:v.videoHeight,video:v})},{once:true});v.load()})}
      return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{const t=new THREE.Texture(im);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;res({t,w:im.naturalWidth,h:im.naturalHeight})};im.onerror=rej;im.src=url})}).catch(()=>this.art(src))},
  /* Generated stand-in artwork, used whenever a footage file isn't available. */
  art(src){
    const chapter=CH.find(c=>c.hero===src||c.items.some(i=>i.src===src));
    const item=chapter.items.find(i=>i.src===src);
    let w=1920,h=1080;
    if(item){const [a,b]=item.ar.split("/").map(Number);w=1024;h=Math.round(1024*b/a)}
    const pal={s2k:["#052f36","#0f7f78","#7fe7c8"],proxe:["#090a2a","#6a35e8","#ff8a3c"],ss:["#0e3a2c","#c98f2e","#f4d58a"],boil:["#3a0d05","#e2541c","#ffc14d"]}[src.split("-")[0]]||["#111","#333","#cdfc2e"];
    const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");
    const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,pal[0]);g.addColorStop(1,pal[1]);x.fillStyle=g;x.fillRect(0,0,w,h);
    let seed=0;for(const ch of src)seed=(seed*31+ch.charCodeAt(0))%9973;
    const rnd=()=>(seed=(seed*16807)%2147483647||7)/2147483647;
    for(let i=0;i<7;i++){const px=rnd()*w,py=rnd()*h,r=(.25+rnd()*.5)*Math.max(w,h),b=x.createRadialGradient(px,py,0,px,py,r);
      b.addColorStop(0,pal[i%2?2:1]+"99");b.addColorStop(1,pal[i%2?2:1]+"00");x.fillStyle=b;x.fillRect(0,0,w,h)}
    if(src.includes("-app-")){x.fillStyle="rgba(255,255,255,.14)";for(let i=0;i<6;i++){const y=h*(.2+i*.12);x.beginPath();x.roundRect(w*.08,y,w*.84,h*.09,28);x.fill()}}
    x.fillStyle="#fff";x.textBaseline="bottom";
    const big=item?item.cap:chapter.name;let size=item?Math.round(w*.11):Math.round(w*.03);
    x.font=`800 ${size}px Syne, "Arial Black", sans-serif`;
    if(item)x.fillText(big,w*.06,h*.94);
    const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;
    return {t,w,h}},
  init(renderer,calm){
    this.r=renderer;this.calm=calm;document.documentElement.classList.add("gl-on");
    this.scene=new THREE.Scene();this.cam=new THREE.PerspectiveCamera(50,1,10,4000);this.cam.position.z=800;
    this.U={uVel:{value:0},uT:{value:0},uVh:{value:innerHeight},uBass:{value:0}};
    const geo=new THREE.PlaneGeometry(1,1,44,44);
    const vs=`varying vec2 vUv;uniform float uVel,uT,uVh;
      void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.);
        float ny=w.y/uVh,nx=w.x/uVh,v=uVel;
        w.y+=sin(uv.x*3.14159)*v*20.;
        w.x+=sin(ny*3.+uT*.6)*v*5.;
        w.z-=(ny*ny*2.2+nx*nx*.6)*(12.+abs(v)*55.);
        w.z+=sin(uv.y*3.14159)*abs(v)*14.;
        gl_Position=projectionMatrix*viewMatrix*w;}`;
    const fs=`varying vec2 vUv;uniform sampler2D uTex;uniform vec2 uScale;uniform float uVel,uA,uHas,uT,uBass;
      float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
      void main(){vec2 uv=(vUv-.5)*uScale+.5;float s=abs(uVel)*.007+uBass*.0015+.0003;vec3 c=vec3(.06,.07,.05);
        if(uHas>.5)c=vec3(texture2D(uTex,uv+vec2(0.,s)).r,texture2D(uTex,uv).g,texture2D(uTex,uv-vec2(0.,s)).b);
        c+=(rnd(vUv*900.+uT)-.5)*.045;
        gl_FragColor=vec4(c,uA);}`;
    document.querySelectorAll("[data-src]").forEach(el=>{
      const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:vs,fragmentShader:fs,uniforms:{uVel:this.U.uVel,uT:this.U.uT,uVh:this.U.uVh,uBass:this.U.uBass,uTex:{value:null},uScale:{value:new THREE.Vector2(1,1)},uA:{value:1},uHas:{value:0}}});
      const m=new THREE.Mesh(geo,mat);m.frustumCulled=false;m.visible=false;this.scene.add(m);
      const pl={el,m,src:el.dataset.src,hero:el.classList.contains("ch-hero"),ch:el.dataset.ch,top:0,left:0,w:1,h:1,info:null};
      this.planes.push(pl)});
    this.pearl=new THREE.Mesh(new THREE.SphereGeometry(1,96,96),new THREE.ShaderMaterial({
      uniforms:{uT:this.U.uT,uBass:this.U.uBass},
      vertexShader:`varying vec3 vN;varying vec3 vP;uniform float uT,uBass;
        void main(){vec3 n=normalize(position);float d=sin(n.x*5.+uT)*sin(n.y*6.-uT*.7)*sin(n.z*4.+uT*.5);
          vec3 p=position+n*d*(.035+uBass*.22);vN=normalMatrix*n;vec4 mv=modelViewMatrix*vec4(p,1.);vP=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
      fragmentShader:`varying vec3 vN;varying vec3 vP;uniform float uT,uBass;
        void main(){vec3 n=normalize(vN),e=normalize(vP);float f=1.-max(dot(n,e),0.);
          vec3 ir=.5+.5*cos(6.2831*(f*1.5+n.y*.35+uT*.04+vec3(0.,.33,.67)));
          vec3 lime=vec3(.80,.99,.18),pur=vec3(.47,.30,1.);
          vec3 c=mix(vec3(.035,.04,.03),mix(pur,lime,ir.g)*(.5+ir.r*.7),pow(f,1.5));
          float sp=pow(max(dot(reflect(-normalize(vec3(.5,.7,.6)),n),e),0.),48.);
          c+=sp*.9+lime*uBass*pow(f,3.)*.8;gl_FragColor=vec4(c,1.);}`}));
    this.pearl.frustumCulled=false;this.scene.add(this.pearl);
    this.quad=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShaderMaterial({transparent:true,depthTest:false,depthWrite:false,
      uniforms:{uB:{value:0},uTex:{value:null},uScale:{value:new THREE.Vector2(1,1)},uAsp:{value:1},uT:this.U.uT,uBass:this.U.uBass},
      vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader:`varying vec2 vUv;uniform sampler2D uTex;uniform vec2 uScale;uniform float uB,uAsp,uT,uBass;
        void main(){vec2 q=(vUv-.5)*vec2(uAsp,1.);float r=length(q),a=atan(q.y,q.x);
          float corner=sqrt(uAsp*uAsp+1.)*.5+.3;
          float R=pow(uB,1.55)*corner;
          float grow=smoothstep(0.,.2,uB)*(1.-smoothstep(.75,1.,uB));
          float jag=(sin(a*7.+1.3)*.5+sin(a*17.+uT*.3)*.3+sin(a*41.)*.2)*.11*grow;
          float edge=R+jag+uBass*.012*grow;
          float m=1.-smoothstep(edge-.008,edge,r);
          float crack=pow(abs(sin(a*5.+sin(a*2.)*1.6)),90.)*smoothstep(edge+.75,edge,r)*smoothstep(edge-.01,edge,r)*smoothstep(0.,.08,uB)*(1.-smoothstep(.45,.8,uB));
          float rim=smoothstep(edge-.05,edge-.008,r)*m*grow;
          if(m+crack<.003)discard;
          vec2 uv=(vUv-.5)*(1.-(1.-uB)*.3)+.5;
          uv=(uv-.5)*uScale+.5;
          float s=.004+rim*.03;
          vec3 c=vec3(texture2D(uTex,uv+vec2(s,0.)).r,texture2D(uTex,uv).g,texture2D(uTex,uv-vec2(s,0.)).b);
          c=c*m+vec3(.80,.99,.18)*(rim*1.1+crack*.9);
          gl_FragColor=vec4(c,clamp(m+crack,0.,1.));}`}));
    this.quad.frustumCulled=false;this.quad.renderOrder=10;this.quad.visible=false;this.scene.add(this.quad);
    addEventListener("resize",()=>{if(this.active)this.layout()})},
  load(){
    const all=[...new Set(this.planes.map(p=>p.src))];
    const jobs=all.map(s=>this.tex(s).catch(()=>null));
    this.planes.forEach(p=>this.tex(p.src).then(info=>{p.info=info;const u=p.m.material.uniforms;u.uTex.value=info.t;u.uHas.value=1;this.fit(p)}).catch(()=>{}));
    return Promise.race([Promise.all(jobs),new Promise(r=>setTimeout(r,12000))])},
  fit(p){if(!p.info)return;const pa=p.w/p.h,ta=p.info.w/p.info.h,s=p.m.material.uniforms.uScale.value;
    if(pa>ta)s.set(1,ta/pa);else s.set(pa/ta,1)},
  layout(){
    const vw=innerWidth,vh=innerHeight;this.vw=vw;this.vh=vh;
    this.cam.aspect=vw/vh;this.cam.fov=2*Math.atan(vh/2/800)*180/Math.PI;this.cam.updateProjectionMatrix();this.U.uVh.value=vh;
    const cur=this.y;
    this.planes.forEach(p=>{const r=p.el.getBoundingClientRect();p.top=r.top+cur;p.left=r.left;p.w=r.width||1;p.h=r.height||1;p.m.scale.set(p.w,p.h,1);this.fit(p)});
    this.zones=[...document.querySelectorAll(".zone")].map(z=>{const r=z.getBoundingClientRect();return{top:r.top+cur,h:r.height,next:+z.dataset.next,fired:false}});
    const o=document.querySelector(".opener").getBoundingClientRect();this.opTop=o.top+cur;this.opH=o.height;
    const R=Math.min(vw,vh)*.3;this.pearl.scale.set(R,R,R);
    this.quad.scale.set(vw,vh,1);this.quad.position.set(0,0,1);this.quad.material.uniforms.uAsp.value=vw/vh;
    document.getElementById("scroller").style.height=document.getElementById("world").offsetHeight+"px"},
  enter(){
    const w=document.getElementById("world");w.hidden=false;
    document.querySelector(".hud.bottom").style.display="none";
    document.querySelector(".vignette").style.opacity=.35;
    scrollTo(0,0);this.y=0;this.prev=0;this.layout();this.active=true;
    setTimeout(()=>{if(this.active)this.layout()},700)},
  frame(dt){
    const vh=this.vh,vw=this.vw,U=this.U;
    if(!this.calm)U.uT.value+=dt;
    this.y+=(scrollY-this.y)*(this.calm?1:1-Math.pow(.0012,dt));
    document.getElementById("world").style.transform=`translate3d(0,${-this.y}px,0)`;
    const raw=clamp((this.y-this.prev)/Math.max(dt,.001)/2100,-1,1);this.prev=this.y;
    this.v+=(raw-this.v)*.14;U.uVel.value=this.calm?this.v*.25:this.v;
    let active=null,b=0,hudOp=0,hudName="";
    this.zones.forEach(z=>{const raw=(this.y-z.top)/z.h;
      if(raw>-.5&&raw<1){hudOp=Math.max(hudOp,smooth(-.5,-.05,raw)*(1-smooth(.5,.82,raw)));hudName=CH[z.next].name}
      if(raw>0&&raw<1){active=z;b=raw}
      if(raw>=.97&&!z.fired){z.fired=true;if(Sound.ctx&&Sound.on){const t=Sound.ctx.currentTime;Sound.kick(t);Sound.hit(t,"highpass",2600,1.2,.42)}}
      if(raw<.5)z.fired=false});
    const hud=document.getElementById("breakhud");hud.style.opacity=hudOp;if(hudOp>0)document.getElementById("breakname").textContent=hudName;
    const nextHero=active?this.planes.find(p=>p.hero&&+p.ch===active.next):null;
    this.planes.forEach(p=>{const sy=p.top-this.y,vis=sy<vh*1.25&&sy+p.h>-vh*.25;
      p.m.visible=vis&&p!==nextHero;
      if(vis){p.m.position.set(p.left+p.w/2-vw/2,vh/2-(sy+p.h/2),0);
        p.m.material.uniforms.uA.value=p.hero?1:smooth(0,.3,(vh-sy)/vh)}
      if(p.info&&p.info.video){const v=p.info.video,want=vis||p===nextHero;
        if(want&&v.paused){const q=v.play();if(q&&q.catch)q.catch(()=>{})}else if(!want&&!v.paused)v.pause()}});
    const q=this.quad;q.visible=!!(active&&nextHero&&nextHero.info);
    if(q.visible){const u=q.material.uniforms;u.uB.value=b;u.uTex.value=nextHero.info.t;
      const pa=vw/vh,ta=nextHero.info.w/nextHero.info.h;if(pa>ta)u.uScale.value.set(1,ta/pa);else u.uScale.value.set(pa/ta,1)}
    const sy=this.opTop-this.y;this.pearl.visible=sy+this.opH>-vh*.2;
    this.pearl.position.set(0,vh/2-(sy+this.opH/2),-120);
    this.pearl.rotation.y=U.uT.value*.15+this.v*1.2;this.pearl.rotation.x=this.v*.8;
    const level=clamp(.18+Math.abs(this.v)*.6+(active?b*.8:0));
    this.bass+=(Sound.update(level,Math.abs(this.v)+(active?b*.6:0))-this.bass)*.4;U.uBass.value=this.bass;
    const total=Math.max(1,document.documentElement.scrollHeight-vh);
    document.getElementById("bar").style.transform=`scaleX(${clamp(scrollY/total)})`;
    this.r.render(this.scene,this.cam)}};

async function start(){
  try{await Promise.race([document.fonts.load('800 300px Syne'),new Promise(r=>setTimeout(r,2500))])}catch(e){}
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas:document.getElementById("gl"),antialias:false,powerPreference:"high-performance"})}
  catch(e){document.documentElement.classList.add("nogl");return}
  const calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr=Math.min(devicePixelRatio||1,2);renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0x07080a,1);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(55,(innerWidth&&innerHeight)?innerWidth/innerHeight:16/9,.1,400);
  const N=BRANDS.length,GAP=14,START=14,END=-(N+1)*GAP;
  const small=(innerWidth||screen.width)<760,COUNT=small?45000:130000;
  const visW=2*START*Math.tan(27.5*Math.PI/180)*camera.aspect,textW=Math.min(visW*.86,23);

  const g=new THREE.BufferGeometry();
  const home=sampleText("BCON",COUNT,textW),end=sampleText("CODE",COUNT,textW);
  for(let i=0;i<COUNT;i++)end[i*3+2]+=END;
  const scatter=new Float32Array(COUNT*3),seed=new Float32Array(COUNT);
  for(let i=0;i<COUNT;i++){const a=Math.random()*Math.PI*2,r=3.5+Math.pow(Math.random(),.6)*13;
    scatter[i*3]=Math.cos(a)*r;scatter[i*3+1]=Math.sin(a)*r;scatter[i*3+2]=8-Math.random()*(8-END+10);seed[i]=Math.random()}
  g.setAttribute("position",new THREE.BufferAttribute(home,3));
  g.setAttribute("aScatter",new THREE.BufferAttribute(scatter,3));
  g.setAttribute("aEnd",new THREE.BufferAttribute(end,3));
  g.setAttribute("aSeed",new THREE.BufferAttribute(seed,1));
  const U={uBass:{value:0},uTime:{value:0},uMorph:{value:0},uEnd:{value:0},uMouse:{value:new THREE.Vector2(99,99)},uVel:{value:0},uSize:{value:30*dpr*(innerHeight/800)},uMax:{value:13*dpr}};
  const mat=new THREE.ShaderMaterial({uniforms:U,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
    vertexShader:`
      attribute vec3 aScatter;attribute vec3 aEnd;attribute float aSeed;
      uniform float uTime,uMorph,uEnd,uVel,uSize,uMax,uBass;uniform vec2 uMouse;
      varying float vMix;varying float vA;
      void main(){
        float d=aSeed*.35;
        float m=smoothstep(d,d+.65,uMorph);
        float e=smoothstep(d,d+.65,uEnd);
        vec3 p=mix(position,aScatter,m);
        p=mix(p,aEnd,e);
        float fly=m*(1.-e);
        float rest=1.-fly;
        float ang=uTime*.06*fly+fly*p.z*.035;
        float c=cos(ang),s=sin(ang);
        p.xy=mat2(c,-s,s,c)*p.xy;
        p+=vec3(sin(uTime*.7+aSeed*40.+p.y*.6),cos(uTime*.6+aSeed*31.+p.x*.6),sin(uTime*.5+aSeed*23.))*(.025*rest+.42*fly);
        p.z+=uVel*(aSeed-.5)*26.*fly;
        vec2 dm=p.xy-uMouse;float r=length(dm);
        float push=exp(-r*r/3.2)*rest;
        p.xy+=normalize(dm+.0001)*push*(1.5+aSeed*2.2);
        p.z+=push*2.2*(aSeed-.3);
        p.xy*=1.+uBass*(.05*rest+.22*fly)*(.4+aSeed);
        p.z+=uBass*sin(aSeed*90.+uTime*3.)*(.5*rest+1.4*fly);
        vec4 mv=modelViewMatrix*vec4(p,1.);
        gl_Position=projectionMatrix*mv;
        gl_PointSize=min(uMax,uSize*(.45+aSeed)*(1.+uBass*1.1+fly*.35)/max(.5,-mv.z));
        vMix=clamp(aSeed*.4+fly*aSeed*.35+push*.8,0.,1.);
        vA=smoothstep(.2,3.,-mv.z)*(1.-smoothstep(30.,90.,-mv.z))*(1.-fly*.45);
      }`,
    fragmentShader:`
      varying float vMix;varying float vA;
      void main(){
        float r=length(gl_PointCoord-.5);
        float a=1.-smoothstep(.05,.5,r);
        vec3 lime=vec3(.80,.99,.18),pur=vec3(.50,.32,1.);
        gl_FragColor=vec4(mix(lime,pur,vMix),a*vA*.55);
      }`});
  const cloud=new THREE.Points(g,mat);cloud.frustumCulled=false;scene.add(cloud);

  /* Speed streaks through the tunnel */
  const SN=small?1100:2800,sp=new Float32Array(SN*6),sc=new Float32Array(SN*6);
  const cA=new THREE.Color(0xcdfc2e),cB=new THREE.Color(0x8a5cff);
  for(let i=0;i<SN;i++){const a=Math.random()*Math.PI*2,r=2.6+Math.pow(Math.random(),.7)*17,z=10-Math.random()*(10-END+14),len=1.5+Math.random()*7,c=Math.random()>.45?cA:cB,o=i*6;
    sp[o]=sp[o+3]=Math.cos(a)*r;sp[o+1]=sp[o+4]=Math.sin(a)*r;sp[o+2]=z;sp[o+5]=z-len;
    sc[o]=c.r;sc[o+1]=c.g;sc[o+2]=c.b;sc[o+3]=c.r*.1;sc[o+4]=c.g*.1;sc[o+5]=c.b*.1}
  const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));sg.setAttribute("color",new THREE.BufferAttribute(sc,3));
  const streaks=new THREE.LineSegments(sg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
  streaks.frustumCulled=false;scene.add(streaks);

  const planes=BRANDS.map(([n,c],i)=>{
    const cv=document.createElement("canvas");cv.width=1400;cv.height=460;const x=cv.getContext("2d");
    let size=190;x.font=`800 ${size}px Syne, "Arial Black", sans-serif`;
    const w=x.measureText(n).width;if(w>1340){size*=1340/w;x.font=`800 ${size}px Syne, "Arial Black", sans-serif`}
    x.fillStyle="#f4f6ea";x.textBaseline="middle";x.fillText(n,30,190);
    x.font='500 38px "JetBrains Mono", monospace';x.fillStyle="#cdfc2e";x.fillText(c.join("  /  ").toUpperCase(),34,350);
    const t=new THREE.CanvasTexture(cv);t.anisotropy=4;
    const pw=small?9:12.5;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(pw,pw*460/1400),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0,depthWrite:false}));
    const side=i%2?1:-1;
    m.position.set(small?0:side*Math.min(visW*.17,4.2),small?1.2:(i%3-1)*.9,-(i+1)*GAP);
    m.userData.side=side;scene.add(m);return m});

  /* Real film clips fly past behind their brand names */
  const media=[];
  planes.forEach((m,i)=>{const ch=CH.find(c=>c.name===BRANDS[i][0]);if(!ch)return;
    const mm=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,color:0xffffff});
    const w=small?11:19,mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,w*9/16),mm);
    mesh.position.set(m.position.x*.35,m.position.y*.3,m.position.z-2);mesh.renderOrder=-1;scene.add(mesh);
    const item={mesh,info:null};media.push(item);
    World.tex(ch.hero).then(info=>{item.info=info;mm.map=info.t;mm.needsUpdate=true})});

  const $=id=>document.getElementById(id);const el={bar:$("bar"),intro:$("intro"),now:$("now"),idx:$("idx"),name:$("name"),chips:$("chips")};
  let p=0,mx=0,my=0,cx=0,cy=0,shown=-2,hasMouse=false;
  addEventListener("pointermove",e=>{mx=e.clientX/innerWidth*2-1;my=-(e.clientY/innerHeight*2-1);hasMouse=true},{passive:true});
  addEventListener("resize",()=>{if(!innerWidth||!innerHeight)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);U.uSize.value=30*dpr*(innerHeight/800)});

  const clock=new THREE.Clock();
  function frame(){
    const dt=Math.min(clock.getDelta(),.05);
    if(World.active){World.frame(dt);requestAnimationFrame(frame);return}
    if(!calm)U.uTime.value+=dt;
    const bars=Play.elapsed()/BAR;
    p=clamp((bars-HOLD)/FLIGHT);
    const vel=(p>0&&p<1)?(Math.floor(bars)%4===3?.5:.15):0;
    U.uBass.value+=(Sound.update(p,vel)-U.uBass.value)*.4;
    U.uVel.value+=(U.uBass.value*.5-U.uVel.value)*.12;
    if(Play.started&&bars>=HOLD+FLIGHT+TAIL)Play.finish();
    U.uMorph.value=smooth(.0,.13,p);
    U.uEnd.value=smooth(.87,.985,p);
    const t=clamp((p-.03)/.87),dist=t*(START-END-START);
    const camZ=START-dist;
    cx+=(mx-cx)*.06;cy+=(my-cy)*.06;
    const shake=calm?0:U.uBass.value*.14;
    camera.position.set(cx*1.5+(Math.random()-.5)*shake,cy*.9+(Math.random()-.5)*shake,camZ);
    camera.lookAt(cx*.3,cy*.2,camZ-14);
    camera.rotation.z=U.uVel.value*.14;
    const punch=calm?0:U.uBass.value*9;
    camera.fov=55+punch+U.uMorph.value*(1-U.uEnd.value)*12;camera.updateProjectionMatrix();
    streaks.material.opacity=U.uMorph.value*(1-U.uEnd.value)*(.42+U.uBass.value*.55);
    media.forEach(it=>{const d=camZ-it.mesh.position.z,o=it.info?smooth(40,18,d)*smooth(4,10,d):0;
      it.mesh.material.opacity=o;it.mesh.visible=o>.002;
      if(it.info&&it.info.video){const v=it.info.video;if(o>.002&&v.paused){const q=v.play();if(q&&q.catch)q.catch(()=>{})}else if(o<=.002&&!v.paused&&!World.active)v.pause()}});
    const vh=2*START*Math.tan(27.5*Math.PI/180);
    if(hasMouse)U.uMouse.value.set(mx*vh*camera.aspect/2+cx*1.5,my*vh/2+cy*.9);
    planes.forEach(m=>{const d=camZ-m.position.z;
      m.material.opacity=smooth(34,15,d)*smooth(1.2,5,d);
      m.rotation.y=-m.userData.side*.22+cx*.1;m.rotation.x=cy*.06;
      m.scale.setScalar(1+U.uBass.value*.07);
      m.visible=m.material.opacity>.002});
    const i=Math.floor((dist+2)/GAP)-1,active=(i>=0&&i<N&&U.uEnd.value<.15)?i:-1;
    if(active!==shown){shown=active;
      if(active>=0){el.idx.textContent=String(active+1).padStart(2,"0")+" / "+N;el.name.hidden=true;chipsFor(el.chips,BRANDS[active][1])}
      el.now.style.opacity=active>=0?1:0}
    el.intro.style.opacity=(p<.015||p>.93)?1:0;
    el.bar.style.transform=`scaleX(${p})`;
    renderer.render(scene,camera);
    requestAnimationFrame(frame)}
  window.__bcon={renderer,scene,g,textW,visW,U,get p(){return p}};
  World.init(renderer,calm);
  frame();
  await World.load()}

const gate=document.getElementById("gate"),count=document.getElementById("count"),actions=document.getElementById("gateActions"),snd=document.getElementById("snd");
let shownCount=0,sceneReady=false;
const counter=setInterval(()=>{
  const cap=sceneReady?100:92;
  shownCount=Math.min(cap,shownCount+(sceneReady?6:3));
  count.textContent=String(shownCount).padStart(3,"0");
  if(shownCount>=100){clearInterval(counter);count.hidden=true;actions.hidden=false;document.getElementById("enterSound").focus({preventScroll:true})}},40);
/* The eye follows the cursor, blinks, and is the door into the film. */
const eyeEl=document.getElementById("eye"),irisEl=document.getElementById("iris");
let lookX=0,lookY=0,curX=0,curY=0,pointerSeen=false,eyeRun=true;
addEventListener("pointermove",e=>{pointerSeen=true;const r=eyeEl.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy)||1,pull=Math.min(1,len/(r.width*.9));lookX=dx/len*pull*44;lookY=dy/len*pull*20},{passive:true});
function eyeTick(){if(!eyeRun)return;
  if(!pointerSeen){const t=performance.now()/1000;lookX=Math.sin(t*.8)*26;lookY=Math.sin(t*1.3)*8}
  curX+=(lookX-curX)*.14;curY+=(lookY-curY)*.14;
  irisEl.setAttribute("transform","translate("+curX.toFixed(2)+" "+curY.toFixed(2)+")");
  requestAnimationFrame(eyeTick)}
eyeTick();
function blink(){if(!eyeRun)return;eyeEl.classList.add("blink");setTimeout(()=>eyeEl.classList.remove("blink"),130);setTimeout(blink,2400+Math.random()*3200)}
setTimeout(blink,1800);
["enterSound","enterSilent"].forEach(id=>{const b=document.getElementById(id);b.addEventListener("pointerenter",()=>eyeEl.classList.add("wide"));b.addEventListener("pointerleave",()=>eyeEl.classList.remove("wide"))});
let entering=false;
function enter(withSound){
  if(entering)return;entering=true;
  if(withSound){Sound.start();if(Sound.ctx){Sound.ctx.resume();snd.hidden=false}}
  lookX=0;lookY=0;pointerSeen=true;
  const calmEntry=matchMedia("(prefers-reduced-motion: reduce)").matches;
  gate.classList.add("entering");
  setTimeout(()=>{Play.begin();gate.classList.add("gone");eyeRun=false;setTimeout(()=>{gate.hidden=true},500)},calmEntry?60:780)}
document.getElementById("enterSound").addEventListener("click",()=>enter(true));
document.getElementById("enterSilent").addEventListener("click",()=>enter(false));
document.getElementById("skip").addEventListener("click",()=>Play.finish());
snd.addEventListener("click",()=>{snd.textContent=Sound.toggle()?"SOUND ON":"SOUND OFF"});
World.build();
start().catch(()=>document.documentElement.classList.add("nogl")).finally(()=>{sceneReady=true});

}

const images = Array.from({length:14},(_,i)=>`images/foto-${String(i+1).padStart(2,'0')}.jpeg`);
const videoNames = ["video-01.mp4","video-02.mp4","video-03.mp4"];
let idx=0, timer=null, lang='es';

const $=s=>document.querySelector(s);
const slides=$('#slides'), thumbs=$('#thumbs');
images.forEach((src,i)=>{
  const s=document.createElement('div'); s.className='slide'; s.innerHTML=`<img src="${src}" alt="Recuerdo ${i+1}" loading="${i?'lazy':'eager'}">`; slides.appendChild(s);
  const b=document.createElement('button'); b.innerHTML=`<img src="${src}" alt="">`; b.onclick=()=>go(i,true); thumbs.appendChild(b);
});
$('#total').textContent=images.length;

function go(n,manual=false){
 idx=(n+images.length)%images.length;
 document.querySelectorAll('.slide').forEach((x,i)=>x.classList.toggle('active',i===idx));
 document.querySelectorAll('.thumbs button').forEach((x,i)=>x.classList.toggle('active',i===idx));
 $('#current').textContent=String(idx+1).padStart(2,'0');
 $('#progressBar').style.width=((idx+1)/images.length*100)+'%';
 if(manual) restart();
}
function restart(){clearInterval(timer);timer=setInterval(()=>go(idx+1),6500)}
$('#prev').onclick=()=>go(idx-1,true); $('#next').onclick=()=>go(idx+1,true);

const hero=$('#heroPhoto'); hero.style.backgroundImage=`url("${images[0]}")`;
go(0); restart();

videoNames.forEach((v,i)=>{
 const card=document.createElement('div'); card.innerHTML=`<video src="videos/${v}" controls playsinline preload="metadata"></video>`; $('#videos').appendChild(card);
});

const translations={
es:{hero:'Hoy celebramos 24 años de una historia llena de momentos, sonrisas y recuerdos inolvidables.',final:'Que nunca te falten motivos para sonreír. ✨'},
en:{hero:'Today we celebrate 24 years of a story full of moments, smiles and unforgettable memories.',final:'May you always have reasons to smile. ✨'},
fr:{hero:'Aujourd’hui, nous célébrons 24 ans remplis de moments, de sourires et de souvenirs inoubliables.',final:'Que tu aies toujours des raisons de sourire. ✨'},
de:{hero:'Heute feiern wir 24 Jahre voller Momente, Lächeln und unvergesslicher Erinnerungen.',final:'Mögest du immer Gründe zum Lächeln haben. ✨'}
};
function setLang(l){lang=l;document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=translations[l][e.dataset.i18n]);$('#langBtn').textContent=l.toUpperCase();document.querySelectorAll('.quote').forEach(e=>e.style.display=e.dataset.lang===l?'block':'none')}
$('#langBtn').onclick=()=>setLang(['es','en','fr','de'][(['es','en','fr','de'].indexOf(lang)+1)%4]); setLang('es');

$('#enterBtn').onclick=()=>{
 $('#loader').style.display='none'; $('#site').classList.remove('hidden'); window.scrollTo(0,0); burst();
};
$('#scrollGallery').onclick=()=>$('#gallery').scrollIntoView({behavior:'smooth'});
$('#againBtn').onclick=()=>{window.scrollTo({top:0,behavior:'smooth'}); $('#loader').style.display='grid';$('#site').classList.add('hidden')};
$('#wishBtn').onclick=()=>{burst(80); alert('✨ Deseo pedido. ¡Que tus 24 años sean maravillosos, Luisa!');};

let audioCtx;

const music = new Audio("cancion/Manuel Lizarazo.mp3");

music.loop = true;
music.volume = 0.45;

let musicOn = false;

$('#musicBtn').onclick = () => {

    if (!musicOn) {

        music.play()
            .then(() => {
                musicOn = true;
                $('#musicBtn').textContent = '♫ ON';
                $('#musicBtn').classList.add('music-playing');
            })
            .catch(error => {
                console.log("No se pudo reproducir la música:", error);
            });

    } else {

        music.pause();

        musicOn = false;

        $('#musicBtn').textContent = '♫';
        $('#musicBtn').classList.remove('music-playing');
    }
};


function playChime(){
 if(!musicOn)return; const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=440;o.type='sine';g.gain.value=.035;o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.7);
 setTimeout(playChime,2200);
}

const canvas=$('#stars'),ctx=canvas.getContext('2d');let pts=[];
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;pts=Array.from({length:100},()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.5+.2,v:Math.random()*.25+.05}))}
function stars(){ctx.clearRect(0,0,canvas.width,canvas.height);pts.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=canvas.height;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.globalAlpha=.35;ctx.fill()});requestAnimationFrame(stars)}
addEventListener('resize',resize);resize();stars();

function burst(count=45){
 for(let i=0;i<count;i++){const e=document.createElement('span');e.textContent=['✦','✧','♥','•'][Math.floor(Math.random()*4)];e.style.cssText=`position:fixed;left:50%;top:45%;z-index:30;color:${Math.random()>.5?'#f3a9d4':'#f4d59a'};font-size:${10+Math.random()*20}px;pointer-events:none;transition:transform 1.5s ease,opacity 1.5s ease;`;document.body.appendChild(e);requestAnimationFrame(()=>{e.style.transform=`translate(${(Math.random()-.5)*700}px,${(Math.random()-.5)*500}px) rotate(${Math.random()*600}deg)`;e.style.opacity=0});setTimeout(()=>e.remove(),1600)}
}
let sx=0;slides.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});slides.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)go(idx+(dx<0?1:-1),true)},{passive:true});

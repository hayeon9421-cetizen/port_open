// ODDAY Section 1: original scene timings + continuous looping.
// Works with jQuery when available and falls back to native DOM events offline.
(function () {
  'use strict';
  const section = document.getElementById('sub4_1s');
  const replay = section.querySelector('.replay');
  const modelBg = section.querySelector('.gif-bg');
  const frames = Array.from({length:10}, (_,i) => `img/sub4_img/model_bg_frames/model_bg_${String(i+1).padStart(2,'0')}.jpg`);
  frames.forEach(src => { const image = new Image(); image.src = src; });
  let frameInterval = null, frameStart = null, frameStop = null, loopTimer = null;
  let index = 0;
  const LOOP_MS = 8400; // original ending at 7.95s; hold last pose briefly

  function stopTimers() {
    clearInterval(frameInterval); clearTimeout(frameStart);
    clearTimeout(frameStop); clearTimeout(loopTimer);
  }
  function playSection() {
    stopTimers();
    index = 0;
    modelBg.src = frames[0];
    section.classList.remove('play');
    void section.offsetWidth; // restart CSS keyframe animations
    section.classList.add('play');
    frameStart = setTimeout(() => {
      frameInterval = setInterval(() => {
        index = (index + 1) % frames.length;
        modelBg.src = frames[index];
      }, 100);
    }, 4600);
    frameStop = setTimeout(() => clearInterval(frameInterval), 7950);
    loopTimer = setTimeout(playSection, LOOP_MS);
  }
  if (window.jQuery) {
    window.jQuery(replay).on('click', playSection);
    window.jQuery(window).on('load', playSection);
  } else {
    replay.addEventListener('click', playSection);
    window.addEventListener('load', playSection);
  }
})();


// SECTION 03 — three synchronized jewelry/model pairs; start with pair #2 centered.
(function () {
  const section3 = document.getElementById('sub4_3s');
  if (!section3) return;
  const cards = Array.from(section3.querySelectorAll('.s3-product'));
  const model = section3.querySelector('.s3-model-image');
  const modelPaths = ['img/sub4_img/sub4_3s_1th.png','img/sub4_img/sub4_3s_2th.png','img/sub4_img/sub4_3s_3th.png'];
  const labels = ['첫 번째','두 번째','세 번째'];
  modelPaths.forEach(src => { const img = new Image(); img.src = src; });
  let active = 1;
  let changeTimer;
  function render() {
    cards.forEach((card, i) => {
      const relative = (i - active + cards.length) % cards.length;
      const position = relative === 0 ? 'center' : relative === 1 ? 'right' : 'left';
      card.dataset.position = position;
      card.setAttribute('aria-current', position === 'center' ? 'true' : 'false');
    });
    model.classList.add('is-changing');
    clearTimeout(changeTimer);
    changeTimer = setTimeout(() => {
      model.src = modelPaths[active];
      model.alt = labels[active] + ' 주얼리를 착용한 모델';
      model.classList.remove('is-changing');
    }, 220);
  }
  section3.querySelector('.s3-prev').addEventListener('click', () => {
    active = (active - 1 + cards.length) % cards.length;
    render();
  });
  section3.querySelector('.s3-next').addEventListener('click', () => {
    active = (active + 1) % cards.length;
    render();
  });
  render();
})();

// SECTION 04: click a hat to update the corresponding model
(() => {
 const model=document.getElementById('s4-model-image');
 const hats=[...document.querySelectorAll('.s4-hat')];
 hats.forEach(btn=>btn.addEventListener('click',()=>{
  const n=btn.dataset.hat; model.classList.add('s4-fade');
  const next=new Image();next.onload=()=>{model.src=next.src;model.alt=`${n}번째 모자를 착용한 모델`;model.classList.remove('s4-fade')};next.src=`img/sub4_img/sub4_4s_${n}th.png`;
  hats.forEach(b=>{const selected=b===btn;b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected))});
 }));
})();
// SECTION 05: item-specific 1920 × 320 information strips
(() => {
 const image=document.getElementById('s5-info-image');
 const info=document.getElementById('s5-info');
 const mapping={'모자':'sub4_5s_cap.png','에코백':'sub4_5s_bag.png','신발':'sub4_5s_shoes.png','백팩':'sub4_5s_backpack.png','키링':'sub4_5s_keyring.png'};
 document.querySelectorAll('#sub4_5s .s5-hotspot').forEach(button=>{
  button.addEventListener('click',()=>{
   const item=button.dataset.item;
   image.src='img/sub4_img/'+mapping[item];
   image.alt=item+' 상품 정보';
   info.hidden=false;
   document.querySelectorAll('#sub4_5s .s5-hotspot').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
 });
})();

// SECTION 02: start staggered cards only after scrolling into the section.
(() => {
 const section=document.getElementById('sub4_2s');
 if(!section)return;
 if(!('IntersectionObserver' in window)){section.classList.add('s2-visible');return;}
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(entry.isIntersecting){section.classList.add('s2-visible');observer.disconnect();break;}
  }
 },{threshold:0,rootMargin:'0px 0px -45% 0px'});
 observer.observe(section);
})();

;
/* Shared header eyes and TOP button — uses jQuery already installed on the site */
(function($){
 $(function(){
   var $eyes=$('.od-shared-header .odc-od-pupil');
   var tx=0,ty=0,x=0,y=0;
   function draw(){x+=(tx-x)*.18;y+=(ty-y)*.18;$eyes.css('transform','translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px)');requestAnimationFrame(draw)}
   if($eyes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){draw();}
   $(document).on('mousemove.oddayShared',function(e){
     var el=$eyes[0];if(!el)return;var r=el.getBoundingClientRect();
     var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy)||1;
     tx=dx/len*Math.min(4,Math.abs(dx)/27);ty=dy/len*Math.min(5,Math.abs(dy)/27);
   });
   // For same-origin iframes such as section 03.
   $('iframe').on('load.oddayShared',function(){var frame=this;try{$(frame.contentDocument).on('mousemove.oddayShared',function(e){var r=frame.getBoundingClientRect();$(document).trigger($.Event('mousemove',{clientX:r.left+e.clientX,clientY:r.top+e.clientY}))})}catch(err){}});
   var $top=$('.od-shared-top');function updateTop(){var section=document.getElementById('sub4_7s');if(!section)return;var threshold=section.getBoundingClientRect().top + window.scrollY - window.innerHeight*0.45;$top.toggleClass('is-visible',window.scrollY>=threshold)}
   $(window).on('scroll.oddayShared',updateTop);updateTop();
   $top.on('click',function(){$('html,body').stop(true).animate({scrollTop:0},650)});
 });
})(jQuery);

/* 포트폴리오 공통 JS · 화면 비례 / 메뉴 / 작품 / 팝업 / 애니메이션 */
'use strict';
const BASE_WIDTH=1920,SECTION_HEIGHT=1080,SECTION_COUNT=6;
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
/* 01. 비례 축소: 소수점 스케일에서도 원본 SECTION 좌표는 1080으로 유지 */
const stage=$('.container');const wrapper=document.createElement('div');wrapper.className='portfolio-scale-wrapper';stage.parentNode.insertBefore(wrapper,stage);wrapper.appendChild(stage);
let scale=1;
const mobileLayout=()=>window.innerWidth<=1279;
/* 모바일에서는 축소 좌표계를 해제하고 실제 카드 높이에 따라 문서가 늘어납니다. */
function resizeStage(){
  if(mobileLayout()){
    scale=1;stage.style.transform='none';wrapper.style.width='100%';wrapper.style.height='auto';
  }else{
    scale=Math.min(1,window.innerWidth/BASE_WIDTH);
    stage.style.transform=`scale(${scale})`;
    wrapper.style.width=`${BASE_WIDTH*scale}px`;
    wrapper.style.height=`${SECTION_HEIGHT*SECTION_COUNT*scale}px`;
  }
  syncNav();
}
window.addEventListener('resize',resizeStage,{passive:true});resizeStage();
/* 02. 메뉴 이동: 임의 -1px, 1079px 보정 없이 원본 1080px 사용 */
$$('.sidebar [data-target]').forEach(btn=>btn.addEventListener('click',()=>{const section=$('#'+btn.dataset.target);if(!section)return;if(btn.dataset.target==='section1')window.dispatchEvent(new Event('portfolio:intro-nav'));window.scrollTo({top:mobileLayout()?section.getBoundingClientRect().top+window.scrollY:section.offsetTop*scale,behavior:'smooth'});}));
function syncNav(){
  let idx;
  if(mobileLayout()){
    const sections=$$('.contentbox');
    idx=sections.reduce((best,el,i)=>el.getBoundingClientRect().top<=window.innerHeight*.4?i:best,0);
  }else idx=Math.min(5,Math.max(0,Math.round(window.scrollY/(SECTION_HEIGHT*scale))));
  $$('.sidebar [data-target]').forEach((b,i)=>b.classList.toggle('active',i===idx));
}
/* 공통: 단락 전환 시 우측 메뉴가 오른쪽에서 기존 위치로 진입 */
let lastNavSection=-1;
function animateSidebarOnSection(){
  const active=$$('.sidebar [data-target]').findIndex(b=>b.classList.contains('active'));
  if(active===lastNavSection)return;
  lastNavSection=active;
  const sidebar=$('.sidebar');
  sidebar.classList.remove('sidebar-enter');
  void sidebar.offsetWidth;
  sidebar.classList.add('sidebar-enter');
}
window.addEventListener('scroll',()=>{syncNav();animateSidebarOnSection();},{passive:true});
window.addEventListener('resize',()=>{syncNav();animateSidebarOnSection();},{passive:true});
syncNav();animateSidebarOnSection();
/* 03. 작품 데이터: SECTION 02·03은 HTML의 이미지 파일 경로를 자동 사용.
   SECTION 04~06은 레이아웃 확정 후 이 목록에 작품 경로를 연결합니다. */
const projects={
 '2-1':{title:'웹 메인 디자인',image:''},'2-2':{title:'스케이트보드 광고',image:''},'2-3':{title:'한달음 광고',image:''},'2-4':{title:'한달음 포스터',image:''},
 '3-1':{title:'카드뉴스 01',image:''},'3-2':{title:'카드뉴스 02',image:''},'3-3':{title:'이벤트 프로모션 01',image:''},'3-4':{title:'이벤트 프로모션 02',image:''},
 '4-1':{title:'상세페이지 01',image:''},'4-2':{title:'상세페이지 02',image:''},'4-3':{title:'상세페이지 03',image:''},
 '5-1':{title:'영상 프로젝트 01',image:'',video:''},'5-2':{title:'모션그래픽 01',image:'',video:''},'5-3':{title:'모션그래픽 02',image:'',video:''},'5-4':{title:'숏폼 영상',image:'',video:''},
 '6-1':{title:'ODDAY',image:'',url:'sites/odday/index1.html'},'6-2':{title:'POPIN',image:'',url:'sites/popin/index2.html'},'6-3':{title:'개인 포트폴리오',image:'',url:''}
};
/* SECTION 02·03: 카드에 넣은 작품 이미지를 기존 미리보기 기능에서도 사용.
   파일 경로를 HTML과 JS 양쪽에 중복 입력할 필요가 없습니다. */
$$('.project-preview').forEach(button=>{
  const key=`${button.dataset.section}-${button.dataset.index}`;
  const item=projects[key];
  if(!item)return;
  const artwork=button.querySelector('.card-artwork');
  if(artwork){
    const syncArtwork=()=>{if(artwork.naturalWidth>0)item.image=artwork.getAttribute('src');};
    artwork.addEventListener('load',syncArtwork);
    if(artwork.complete)syncArtwork();
  }else if(item.image){
    const img=document.createElement('img');
    img.src=item.image;
    img.alt=item.title;
    button.replaceChildren(img);
  }
  if(['2','3','4'].includes(button.dataset.section)){
    button.addEventListener('click',()=>{window.location.href=`project.html?section=${button.dataset.section}&item=${button.dataset.index}`;});
  }
});
/* SECTION 04: 대표 이미지 한 장만 표시. 이미지가 없으면 안내 문구 유지. */
$$('#section4 .project-preview').forEach(button=>{
  const img=$('.detail-preview-image',button);
  if(!img)return;
  const ready=()=>{
    if(!img.naturalWidth)return;
    img.hidden=false;
    button.classList.add('has-artwork');
    const item=projects[`4-${button.dataset.index}`];
    if(item)item.image=img.getAttribute('src');
  };
  img.addEventListener('load',ready);
  img.addEventListener('error',()=>{img.hidden=true;});
  img.hidden=false;
  if(img.complete)ready();
});
/* 04. 이미지·영상·웹 미리보기: 파일 미등록 시 안내만 표시 */
const popup=$('#popup'),videoPopup=$('#video-popup'),video=$('#video-frame');
function previewItem(item,kind){if(kind==='video'&&item.video){video.src=item.video;videoPopup.classList.add('open');video.play().catch(()=>{});return;}if(kind==='link'&&item.url){window.open(item.url,'_blank','noopener');return;}if(item.image){$('#popup-image').src=item.image;popup.classList.add('open');return;}window.alert('아직 작품 파일이 연결되지 않았습니다. script.js의 projects 항목에 경로를 등록해 주세요.');}
$$('.project-action-preview').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('.project-card'),p=$('.project-preview',card);previewItem(projects[`${p.dataset.section}-${p.dataset.index}`],p.dataset.kind);}));
/* SECTION 05: 첫 번째 HOLIDAY 카드는 페이지 위 독립형 영상 팝업으로 재생합니다.
   다른 세 카드의 기존 재생 코드는 변경하지 않습니다. */
$$('#section5 .motion-card').forEach((card,index)=>{
  const screen=$('.motion-screen',card), thumb=$('.motion-thumbnail',card);
  const player=$('.motion-video',card), play=$('.motion-play',card);
  thumb.addEventListener('load',()=>{thumb.hidden=false;screen.classList.add('has-thumbnail');});
  thumb.addEventListener('error',()=>{thumb.hidden=true;screen.classList.remove('has-thumbnail');});
  if(thumb.complete&&thumb.naturalWidth){thumb.hidden=false;screen.classList.add('has-thumbnail');}
  if(index===0){
    play.addEventListener('click',()=>{
      video.setAttribute('poster','img/section5_1_HOLIDAY1.jpg');
      video.src='img/section5_1_HOLIDAY2.mp4';
      videoPopup.classList.add('open');
      document.body.classList.add('video-modal-open');
      video.currentTime=0;
      video.play().catch(()=>{/* 브라우저 자동 재생 제한 시 기본 컨트롤로 시작 */});
      $('.close-video').focus();
    });
    return;
  }
  play.addEventListener('click',()=>{
    if(!player.paused){player.pause();play.classList.remove('is-active');play.setAttribute('aria-label','영상 재생');return;}
    $$('#section5 .motion-video').forEach(other=>{
      if(other!==player){other.pause();other.closest('.motion-card').querySelector('.motion-play').classList.remove('is-active');}
    });
    player.play().then(()=>{screen.classList.add('is-playing');play.classList.add('is-active');play.setAttribute('aria-label','영상 일시정지');})
      .catch(()=>window.alert('img 폴더에 해당 section05_XX.mp4 영상을 넣어 주세요.'));
  });
  player.addEventListener('ended',()=>{screen.classList.remove('is-playing');play.classList.remove('is-active');player.currentTime=0;});
});
/* HOLIDAY 영상 종료 시 처음 포스터 화면으로 복귀 */
video.addEventListener('ended',()=>{video.pause();video.currentTime=0;video.load();});

function closePopups(){popup.classList.remove('open');videoPopup.classList.remove('open');document.body.classList.remove('video-modal-open');video.pause();video.removeAttribute('src');video.load();}
$('.close-popup').addEventListener('click',closePopups);$('.close-video').addEventListener('click',closePopups);[popup,videoPopup].forEach(el=>el.addEventListener('click',e=>{if(e.target===el)closePopups();}));document.addEventListener('keydown',e=>{if(e.key==='Escape')closePopups();});
/* 05. 꽃잎 모션: 긴 하강 경로의 옆바람과 수평 중심 회전 (v116) */
(function(){
  const layer=document.querySelector('.petal-layer');
  if(!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const images=['wind_5.png','wind_6.png','wind_1.png','wind_4.png','wind_2.png','wind_3.png'];
  const random=(a,b)=>a+Math.random()*(b-a);
  const pick=items=>items[Math.floor(Math.random()*items.length)];
  let nextImage=0, active=0, launched=0;
  let routeBag=[];
  let previousRoute=null;
  const maxActive=7;
  /* 하나의 오른쪽 바람을 유지하되 높이와 수평 이동량이 서로 다른 경로.
     깊은 경로는 화면 안에서 아래로 이어져 SECTION 06까지 내려갑니다. */
  const routes=[
    {dx:2070,dy:-550}, {dx:2250,dy:260}, {dx:1690,dy:1100},
    {dx:1960,dy:-170}, {dx:1180,dy:2240}, {dx:1930,dy:720},
    {dx:2350,dy:90}, {dx:920,dy:3650}, {dx:1790,dy:-360},
    {dx:1060,dy:5330}, {dx:1380,dy:1590}, {dx:760,dy:4870}
  ];
  /* 첫 세 장은 SECTION 01에서 눈에 띄게 움직이도록 짧은 경로로 시작 */
  const openingRoutes=[1,0,3];
  function nextRoute(){
    if(launched<openingRoutes.length){
      const selected=routes[openingRoutes[launched++]];
      previousRoute=selected;
      return selected;
    }
    if(!routeBag.length){
      routeBag=routes.map((_,i)=>i);
      for(let i=routeBag.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [routeBag[i],routeBag[j]]=[routeBag[j],routeBag[i]];
      }
    }
    /* 직전 꽃잎과 비슷한 각도의 경로는 피해서 일렬로 날아가는 느낌을 줄임 */
    const prev=previousRoute;
    let choice=routeBag.findIndex(i=>!prev ||
      Math.abs(Math.atan2(routes[i].dy,routes[i].dx)-Math.atan2(prev.dy,prev.dx))>0.38);
    if(choice<0) choice=routeBag.length-1;
    const [index]=routeBag.splice(choice,1);
    previousRoute=routes[index];
    launched++;
    return previousRoute;
  }
  /* 기존 크기보다 모든 꽃잎을 키우되, 꽃잎마다 다른 크기 적용 */
  /* 이미지 원본의 긴 변 기준으로 실제 보이는 크기를 균형 있게 조절 */
  const imageSizes=[136,121,178,158,116,181];
  const imageDimensions=[[111,166],[135,81],[198,128],[186,114],[124,88],[216,90]];
  function createPetal(){
    if(active>=maxActive) return;
    const route=nextRoute();
    const img=document.createElement('img');
    img.className='floating-petal';img.alt='';
    const imageIndex=nextImage++%images.length;
    img.src='img/'+images[imageIndex];
    /* 꽃잎별 긴 변 기준 크기를 다르게 설정하여 화면상 크기 차이를 강조 */
    const [naturalW,naturalH]=imageDimensions[imageIndex];
    const longest=Math.min(Math.max(naturalW,naturalH),imageSizes[imageIndex]+random(-4,4));
    const width=longest*naturalW/Math.max(naturalW,naturalH);
    const startX=random(360,490),startY=random(310,420);
    img.style.width=width+'px';
    layer.appendChild(img);active++;
    const dx=route.dx+random(-95,95),dy=route.dy+random(-125,125);
    /* 꽃잎별 이동 거리에 비례해 시간을 계산해 극단적인 빠름/느림 방지.
       초당 이동 거리는 대략 69~79px이며 꽃잎별로 작은 차이만 줍니다. */
    const speedFactors=[1.00,.96,1.04,.98,1.02,.94];
    const pixelsPerSecond=random(67,71)*speedFactors[imageIndex];
    let duration=Math.hypot(dx,dy)/pixelsPerSecond*1000;
    /* 원본 6개 이미지의 긴 축이 가리키는 각도(오른쪽 수평=0도).
       이미지별 기준 각도를 빼서, 긴 축이 진행 방향과 대체로 나란하도록 합니다. */
    const imageAxis=[-60,0,-25,15,30,0];
    const baseAxis=imageAxis[imageIndex];
    const tiltAmount=random(13,25);
    const tiltPhase=random(0,Math.PI*2);
    const flipOnce=Math.random()<.12; // 일부 꽃잎만 부드럽게 한 번 뒤집히는 실험
    const flipDirection=pick([-1,1]);
    /* SECTION 01에서 옆으로 나가는 꽃잎은 선명하게, 아래 단락까지 가는 꽃잎은 점차 희미하게 */
    const longFlight=(startY+dy>1080);
    const opacity=longFlight?random(.82,.94):random(.91,.99);
    const endScale=random(.86,1.04);
    /* 꽃잎이 SECTION 01 경계를 지나는 시점. 이 전에는 불필요하게 흐려지지 않음 */
    const sectionExit=longFlight?Math.max(.05,Math.min(.92,(1080-startY)/dy)):1;
    /* 바람 경로: 단락 1은 눈에 보이는 완만한 S곡선,
       긴 하강 경로는 천천히 좌우로 흐르는 곡선. 시작점은 항상 해바라기 뒤. */
    const deepFlight=dy>1800;
    const windPhase=random(0,Math.PI*2);
    const windSign=pick([-1,1]);
    const windAmplitude=deepFlight?random(290,420):random(105,180);
    const verticalAmplitude=deepFlight?random(35,85):random(75,140);
    const bendCount=deepFlight?random(1.3,1.65):random(1.05,1.45);
    const smooth=(t)=>t*t*(3-2*t);
    const positionAt=t=>{
      const drift=Math.sin(t*Math.PI*2*bendCount+windPhase)-Math.sin(windPhase);
      const fadeEdge=Math.sin(Math.PI*t);
      const x=startX+dx*t+windSign*windAmplitude*drift*fadeEdge;
      const y=startY+dy*t+verticalAmplitude*Math.sin(t*Math.PI*2*bendCount+.4)*fadeEdge;
      return [x,y];
    };
    /* 실제 곡선의 길이를 사용해, 구불거림을 추가해도 과속하지 않게 한다. */
    let pathLength=0,previous=positionAt(0);
    for(let j=1;j<=160;j++){
      const current=positionAt(j/160);
      pathLength+=Math.hypot(current[0]-previous[0],current[1]-previous[1]);
      previous=current;
    }
    duration=pathLength/pixelsPerSecond*1000;
    /* 꽃잎 자체의 회전은 경로의 기울기와 독립적으로 움직인다.
       느린 회전 + 가벼운 좌우 흔들림을 조합해 조종되는 느낌을 방지. */
    const rotationDirection=pick([-1,1]);
    const rotationTurns=random(.7,1.25);
    /* 긴 하강 꽃잎은 긴 축이 수평에 가깝도록 기준 자세를 잡음.
       연속 360도 회전을 적용하면 세로로 선 채 낙하하는 장면이 반복됨. */
    const initialAngle=deepFlight?random(-17,17)-baseAxis:random(-50,50)-baseAxis;
    const deepSwayPhase=random(0,Math.PI*2);
    const deepSwayAmplitude=random(26,43);
    const deepSwayCycles=random(1.8,2.6);
    const rotationWobble=random(12,24);
    const wobblePhase=random(0,Math.PI*2);
    const frames=[];
    /* 등간격 키프레임과 선형 보간: 중간 지점에서 멈칫하는 현상 방지.
       사인 곡선으로 미세하게 흔들리되 전체 이동은 끊김 없이 지속 */
    const steps=32;
    for(let i=0;i<=steps;i++){
      const t=i/steps;
      const [x,y]=positionAt(t);
      /* 경로 방향으로 꽃잎을 강제 정렬하지 않음: 회전과 흔들림을 독립 적용 */
      const angle=deepFlight
        ? initialAngle+deepSwayAmplitude*(Math.sin(t*Math.PI*2*deepSwayCycles+deepSwayPhase)-Math.sin(deepSwayPhase))
        : initialAngle+rotationDirection*360*rotationTurns*t
          +rotationWobble*(Math.sin(t*Math.PI*2*1.7+wobblePhase)-Math.sin(wobblePhase));
      const scale=1+(endScale-1)*t;
      const fadeIn=Math.min(1,t/.025);
      /* 긴 경로는 SECTION 01을 지난 뒤 천천히 투명해짐.
         짧은 경로는 거의 선명하게 유지하고 마지막 2% 구간에서만 사라짐. */
      /* SECTION 06까지 도달하는 긴 경로는 완전히 희미해지지 않도록 조절 */
      const fade=longFlight
        ? 1-.64*Math.max(0,Math.min(1,(t-sectionExit)/(1-sectionExit)))
        : Math.min(1,(1-t)/.02);
      frames.push({offset:t,transform:`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${angle.toFixed(1)}deg) scale(${scale.toFixed(3)})`,opacity:(opacity*Math.max(0,fadeIn)*Math.max(0,fade)).toFixed(3)});
    }
    const animation=img.animate(frames,{duration,easing:'linear',fill:'forwards'});
    let removed=false;
    const cleanup=()=>{if(removed)return;removed=true;img.remove();active--;};
    animation.onfinish=cleanup;animation.oncancel=cleanup;
  }
  /* 꽃잎은 서로 다른 간격으로 하나씩 생성. 화면 밖으로 나간 꽃잎은 재등장하지 않음 */
  function scheduleNext(){window.setTimeout(()=>{createPetal();scheduleNext();},random(5900,8300));}
  createPetal(); // 화면이 열리면 첫 꽃잎은 지연 없이 바로 출발
  scheduleNext(); // 두 번째 꽃잎부터 불규칙한 시간차 적용
})();

/* ================= SECTION 01 시작 · v77 잉크 모션만 독립 이식 ================= */
  /* ================= SECTION 01 · v37 잉크 확산 Canvas 시작 ================= */
  /* 글자 형태의 알파 마스크에 다중 노이즈와 서로 다른 확산 중심을 결합합니다.
     단순한 좌→우 클리핑 대신, 여러 지점에서 종이 섬유처럼 번져 나오도록 합니다. */
  (function(){
    var wrap=document.querySelector('#section1 .ink-wrap');
    if(!wrap) return;
    var title=wrap.querySelector('.ink-base');
    var inkLine=document.querySelector('#section1 .ink-divider');
    var lineStarted=false;
    /* SECTION 01 · 작은 글자: 첨부 예제의 사각형 확장 → 좌우 리빌만 사용 */
    var eyebrow=document.querySelector('#section1 .eyebrow-stage');
    var eyebrowTimer=null;
    var eyebrowInkFrame=0;
    var eyebrowCanvas=eyebrow ? eyebrow.querySelector('.eyebrow-ink-canvas') : null;
    /* SECTION 01 · 작은 글자 위의 사각형 자체에 타이틀의 잉크 침투 적용.
       글자 획은 잉크 마스크로 사용하지 않습니다. */
    function drawEyebrowInk(){
      if(!eyebrowCanvas || !eyebrow)return;
      cancelAnimationFrame(eyebrowInkFrame);
      var el=eyebrow.querySelector('.eyebrow');
      var width=Math.max(1,Math.ceil(el.offsetWidth));
      var height=Math.max(1,Math.ceil(el.offsetHeight));
      eyebrowCanvas.width=width;eyebrowCanvas.height=height;
      eyebrowCanvas.style.width=width+'px';eyebrowCanvas.style.height=height+'px';
      eyebrowCanvas.style.opacity='1';
      var ctx=eyebrowCanvas.getContext('2d');
      var output=ctx.createImageData(width,height);
      var grain=new Float32Array(width*height),grain2=new Float32Array(width*height);
      function smooth(a,b,x){var t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}
      function hash(x,y){var v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);}
      function noise(x,y,scale){var xx=x/scale,yy=y/scale,ix=Math.floor(xx),iy=Math.floor(yy),fx=smooth(0,1,xx-ix),fy=smooth(0,1,yy-iy);return (hash(ix,iy)*(1-fx)+hash(ix+1,iy)*fx)*(1-fy)+(hash(ix,iy+1)*(1-fx)+hash(ix+1,iy+1)*fx)*fy;}
      for(var y=0;y<height;y++)for(var x=0;x<width;x++){
        var i=y*width+x;
        grain[i]=.50*noise(x,y,39)+.32*noise(x+123,y+88,13)+.18*noise(x,y,4);
        grain2[i]=noise(x+31,y+151,22);
      }
      /* 메인 타이틀의 12개 확산점, 침투 및 젖은 잉크 색상 수식을 동일하게 사용 */
      var seeds=[
        [.045,.26,.00],[.20,.28,.08],[.36,.30,.16],[.54,.27,.22],[.73,.30,.28],[.92,.30,.34],
        [.08,.78,.22],[.26,.78,.28],[.44,.75,.34],[.63,.78,.40],[.80,.76,.46],[.96,.77,.50]
      ];
      var started=performance.now();
      function renderEyebrow(now){
        var t=Math.min(1,(now-started)/1120),d=output.data;
        /* 0~31%: 사각형이 커짐. 31~86%: 왼쪽부터 걷혀 글자가 드러남. */
        var boxProgress=smooth(0,.31,t);
        var boxWidth=width*boxProgress;
        var reveal=smooth(.31,.86,t);
        var left=width*reveal;
        for(var y=0;y<height;y++)for(var x=0;x<width;x++){
          var i=y*width+x,j=i*4;
          if(x>=boxWidth||x<left){d[j+3]=0;continue;}
          var nx=x/width,ny=y/height,arrival=2;
          for(var k=0;k<seeds.length;k++){
            var seed=seeds[k],dist=Math.hypot((nx-seed[0])*1.05,(ny-seed[1])*1.45);
            arrival=Math.min(arrival,seed[2]+dist*.90);
          }
          var turbulence=(grain[i]-.5)*.34+(grain2[i]-.5)*.13;
          var threshold=arrival+turbulence;
          /* 푸른 잉크가 스며들며 브라운 사각형으로 자리 잡음 */
          var soak=smooth(threshold-.092,threshold+.092,t*2.65);
          /* v197의 잉크 두께·색상 유지, 푸른색이 마르는 시간만 연장 */
          var wet=1-smooth(threshold+.03,threshold+.48,t*2.65);
          var edge=wet*.77;
          d[j]=Math.round(57*(1-edge)+49*edge);
          d[j+1]=Math.round(44*(1-edge)+91*edge);
          d[j+2]=Math.round(42*(1-edge)+198*edge);
          d[j+3]=Math.round(255*soak);
        }
        ctx.putImageData(output,0,0);
        if(t<1)eyebrowInkFrame=requestAnimationFrame(renderEyebrow);
        else{ctx.clearRect(0,0,width,height);eyebrowCanvas.style.opacity='0';eyebrow.classList.add('eyebrow-complete');}
      }
      eyebrowInkFrame=requestAnimationFrame(renderEyebrow);
    }
    function clearEyebrowMotion(){
      cancelAnimationFrame(eyebrowInkFrame);
      if(eyebrowCanvas){eyebrowCanvas.style.opacity='0';eyebrowCanvas.getContext('2d').clearRect(0,0,eyebrowCanvas.width,eyebrowCanvas.height);}
      if(eyebrowTimer!==null){clearTimeout(eyebrowTimer);eyebrowTimer=null;}
      if(eyebrow){
        eyebrow.classList.remove('eyebrow-playing','eyebrow-complete');
        void eyebrow.offsetWidth; // 재진입 시 모션을 처음부터 다시 재생
      }
    }
    if(inkLine){
      // SECTION 01: 가로선이 끝난 직후 작은 글자의 사각형 잉크 모션을 릴레이 재생.
      // 기존 550ms 조기 시작 타이머를 제거해 두 모션이 겹치지 않도록 합니다.
      inkLine.addEventListener('animationend',function(e){
        if(e.animationName!=='inkLineSmoothGrow'||!eyebrow)return;
        if(eyebrow.classList.contains('eyebrow-playing')||eyebrow.classList.contains('eyebrow-complete'))return;
        eyebrow.classList.add('eyebrow-playing');
        drawEyebrowInk();
      });
    }
    var hasBeenVisible=false;
    var canvas=wrap.querySelector('.ink-canvas');
    if(!canvas) return;
    var ctx=canvas.getContext('2d');
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
    var frame=0, started=0, mask, width, height, seeds, grain, grain2, output;
    function smooth(a,b,x){var t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);}
    function hash(x,y){var v=Math.sin(x*127.1+y*311.7)*43758.5453;return v-Math.floor(v);}
    function noise(x,y,scale){var xx=x/scale,yy=y/scale,ix=Math.floor(xx),iy=Math.floor(yy),fx=smooth(0,1,xx-ix),fy=smooth(0,1,yy-iy);return (hash(ix,iy)*(1-fx)+hash(ix+1,iy)*fx)*(1-fy)+(hash(ix,iy+1)*(1-fx)+hash(ix+1,iy+1)*fx)*fy;}
    function setup(){
      var r=title.getBoundingClientRect();
      /* CSS 1920px 화면 축소와 무관하게 글자의 실제 CSS 픽셀로 계산 */
      /* 글자 끝과 아랫부분이 잘리지 않도록 Canvas 전체에 여백 확보 */
      var insetX=20,insetY=14;
      width=Math.max(1,Math.ceil(title.offsetWidth+insetX*2+24));
      height=Math.max(1,Math.ceil(title.offsetHeight+insetY*2));
      canvas.width=width;canvas.height=height;
      canvas.style.width=width+'px';canvas.style.height=height+'px';
      canvas.style.left=(-insetX)+'px';canvas.style.top=(-insetY)+'px';
      var mc=document.createElement('canvas');mc.width=width;mc.height=height;
      var m=mc.getContext('2d');var st=getComputedStyle(title);
      var fontSize=parseFloat(st.fontSize)||84, lineHeight=parseFloat(st.lineHeight)||fontSize*1.1;
      m.font=st.fontWeight+' '+fontSize+'px '+st.fontFamily;
      /* HTML letter-spacing과 Canvas 글자 간격을 일치시켜 마지막 글자 잘림 방지 */
      var letterSpacing=parseFloat(st.letterSpacing)||0;
      if('letterSpacing' in m) m.letterSpacing=letterSpacing+'px';
      m.textBaseline='alphabetic';m.fillStyle='#000';
      var lines=['Stay Curious.','Keep Creating.'];
      /* 밑줄을 가장 긴 타이틀 행의 실제 글자 폭에 맞춥니다. */
      var measuredWidths=lines.map(function(line){
        if('letterSpacing' in m) return m.measureText(line).width;
        var sum=0;
        for(var ii=0;ii<line.length;ii++)sum+=m.measureText(line[ii]).width+letterSpacing;
        return sum;
      });
      if(inkLine){
        var maxTextWidth=Math.max.apply(null,measuredWidths);
        inkLine.style.width=Math.ceil(maxTextWidth)+'px';
        /* SECTION 01 v41: 번짐 앞부분의 이동거리를 실제 밑줄 폭에 맞춥니다. */
        inkLine.style.setProperty('--ink-travel',Math.max(0,Math.ceil(maxTextWidth)-22)+'px');
      }
      for(var k=0;k<lines.length;k++){
        var baseline=insetY+fontSize*.91+k*lineHeight;
        if('letterSpacing' in m) m.fillText(lines[k],insetX,baseline);
        else {
          /* 구형 브라우저에서도 글자 간격을 재현 */
          var pos=insetX;
          for(var c=0;c<lines[k].length;c++){
            m.fillText(lines[k][c],pos,baseline);
            pos+=m.measureText(lines[k][c]).width+letterSpacing;
          }
        }
      }
      mask=m.getImageData(0,0,width,height).data;
      output=ctx.createImageData(width,height);
      grain=new Float32Array(width*height);grain2=new Float32Array(width*height);
      for(var y=0;y<height;y++)for(var x=0;x<width;x++){
        var i=y*width+x;
        grain[i]=(.50*noise(x,y,39)+.32*noise(x+123,y+88,13)+.18*noise(x,y,4));
        grain2[i]=noise(x+31,y+151,22);
      }
      /* 단어 안의 서로 다른 위치에서 번짐이 시작되도록 확산 중심을 분산 */
      seeds=[
        [.045,.26,.00],[.20,.28,.08],[.36,.30,.16],[.54,.27,.22],[.73,.30,.28],[.92,.30,.34],
        [.08,.78,.22],[.26,.78,.28],[.44,.75,.34],[.63,.78,.40],[.80,.76,.46],[.96,.77,.50]
      ];
    }
    function render(now){
      var t=Math.min(1,(now-started)/3400);
      /* 글자 번짐이 거의 완성될 때 밑줄 잉크 번짐을 이어서 시작 */
      if(t>=.37 && !lineStarted){
        lineStarted=true;
        if(inkLine)inkLine.classList.add('ink-line-playing');
        /* 작은 영문은 선이 거의 완성된 뒤에 별도로 시작 */
      }
      /* SECTION 01: 밑줄은 약 1.26초에 시작하여 2.74초에 완료.
         작은 영문은 약 2.52초(선 85% 진행)에 시작합니다. */

      var d=output.data;
      for(var y=0;y<height;y++)for(var x=0;x<width;x++){
        var i=y*width+x, j=i*4;
        var glyph=mask[j+3];
        if(glyph===0){d[j+3]=0;continue;}
        var nx=x/width,ny=y/height;
        var arrival=2;
        for(var k=0;k<seeds.length;k++){
          var seed=seeds[k];
          var dist=Math.hypot((nx-seed[0])*1.05,(ny-seed[1])*1.45);
          arrival=Math.min(arrival,seed[2]+dist*.90);
        }
        /* 섬유의 굵고 미세한 불규칙성을 각 픽셀의 침투 시점에 반영 */
        var turbulence=(grain[i]-.5)*.34+(grain2[i]-.5)*.13;
        var threshold=arrival+turbulence;
        var soak=smooth(threshold-.092,threshold+.092,t*1.23);
        /* 막 스며든 경계는 푸른 젖은 잉크, 마르면 에스프레소 브라운 */
        var wet=1-smooth(threshold+.03,threshold+.28,t*1.23);
        var edge=wet*.77;
        d[j]=Math.round(57*(1-edge)+49*edge);
        d[j+1]=Math.round(44*(1-edge)+91*edge);
        d[j+2]=Math.round(42*(1-edge)+198*edge);
        d[j+3]=Math.round(glyph*soak);
      }
      ctx.putImageData(output,0,0);
      if(t<1){frame=requestAnimationFrame(render)}
      else{
        /* SECTION 01: Canvas를 그대로 유지해 DOM 글자로 전환할 때 생기는 깜빡임 제거.
           글자/선의 완료 순간에 작은 글씨를 바로 시작합니다. */
        wrap.classList.add('ink-complete');
        wrap.classList.remove('ink-rendering');
        /* 작은 글씨는 가로선 시작 이벤트에서 한 번만 실행 */
      }
    }
    function replay(){
      cancelAnimationFrame(frame);
      clearEyebrowMotion();
      lineStarted=false;
      if(inkLine){inkLine.classList.remove('ink-line-playing');void inkLine.offsetWidth;}
      if(reduce.matches){wrap.classList.remove('ink-rendering');wrap.classList.add('ink-complete');if(inkLine)inkLine.classList.add('ink-line-playing');if(eyebrow)eyebrow.classList.add('eyebrow-complete');return;}
      setup();wrap.classList.remove('ink-finishing','ink-complete');wrap.classList.add('ink-rendering');started=performance.now();frame=requestAnimationFrame(render);
      /* 작은 글자는 가로선 시작 이벤트를 기준으로 지연 재생 */
    }
    wrap.addEventListener('click',replay);
    wrap.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();replay();}});
    /* SECTION 01 · 첫 진입, 상단 재진입, 우측 01 버튼 도착 시에만 타이틀 재생 */
    var ready=document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function(){
      var intro=document.getElementById('section1');
      var armed=true;              // SECTION 01을 충분히 벗어나야 다음 스크롤 재생 허용
      var navPending=false;         // 우측 01 버튼 이동 중에는 중간 위치에서 재생 금지
      var navRequestTime=0;
      var wasAtTop=false;
      function checkIntro(){
        var top=Math.max(0,window.scrollY);
        var sectionHeight=intro.getBoundingClientRect().height;
        var atTop=top<=Math.max(12,sectionHeight*.025);
        var away=top>sectionHeight*.8;
        if(away){armed=true;wasAtTop=false;}
        if(navPending){
          // 부드러운 스크롤이 상단에 도착했을 때만 재생한다.
          if(atTop){navPending=false;armed=false;wasAtTop=true;replay();}
          else if(performance.now()-navRequestTime>5000){navPending=false;}
          return;
        }
        if(atTop&&!wasAtTop&&armed){armed=false;replay();}
        wasAtTop=atTop;
      }
      window.addEventListener('portfolio:intro-nav',function(){
        navPending=true;
        navRequestTime=performance.now();
        // 이미 SECTION 01 상단이라면 버튼을 누를 때도 재생한다.
        checkIntro();
      });
      window.addEventListener('scroll',checkIntro,{passive:true});
      window.addEventListener('resize',checkIntro);
      checkIntro();
    });
  })();
  /* ================= SECTION 01 · 잉크 확산 Canvas 끝 ================= */
/* ================= SECTION 01 끝 · v83의 크기/내비게이션/프로젝트 로직 유지 ================= */

/* ========== SECTION 06 · 실제 사이트 방문 링크 ========== */
/* 실제 주소를 등록하려면 위 projects의 '6-1', '6-2', '6-3' 항목에서 url 값을 수정하세요.
   주소가 없는 상태에서는 새 창을 열지 않고 안내 메시지를 보여줍니다. */
$$('#section6 .section6-site').forEach(link=>{
  const item=projects[`6-${link.dataset.siteIndex}`];
  if(item && item.url){
    link.href=item.url;
  }else{
    link.addEventListener('click',event=>{
      event.preventDefault();
      window.alert('실제 웹사이트 주소가 아직 연결되지 않았습니다. script.js의 SECTION 06 url 값을 입력해 주세요.');
    });
  }
});

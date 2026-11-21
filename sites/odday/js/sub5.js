/* ==================================================================
   ODDAY · SUB5 통합 JavaScript
   SECTION 01~07 + 공통 헤더 + TOP 버튼
   기존 sub5.js / odday-shared.js 통합 (jQuery 3.7.1 필요)
   ================================================================== */

$(function () {

  /* =========================================
     SECTION 01 : LEGO
     썸네일 클릭 시 메인 이미지 변경
  ========================================= */

  $(".lego-thumbs button").on("click", function () {
    const fileName = $(this).attr("data-lego");

    $(".lego-thumbs button").removeClass("active");
    $(this).addClass("active");

    $(".lego-main")
      .stop(true, true)
      .fadeOut(150, function () {
        $(this)
          .attr("src", "img/sub5_img/" + (fileName.startsWith("sub5_") ? fileName : "sub5_" + fileName))
          .fadeIn(250);
      });
  });


  /* =========================================
     SECTION 01 : LEGO
     큰 이미지 클릭 시 4장 순서대로 변경
  ========================================= */

  const legoImages = [
    "img/sub5_img/sub5_1-11.png",
    "img/sub5_img/sub5_1-22.png",
    "img/sub5_img/sub5_1-33.png",
    "img/sub5_img/sub5_1-44.png"
  ];

  let legoChanging = false;

  $("#p05_s01 .lego-visual").on("click", function () {

    if (legoChanging) return;

    legoChanging = true;

    const $img = $("#p05_s01 .lego-main");
    const currentFile = $img.attr("src").split("/").pop();

    const currentIndex = legoImages.findIndex(function (src) {
      return src.endsWith("/" + currentFile);
    });

    const nextIndex = (currentIndex + 1) % legoImages.length;
    const nextSrc = legoImages[nextIndex];

    const preload = new Image();

    preload.onload = function () {
      $img.stop(true, true).fadeOut(150, function () {
        $img.attr("src", nextSrc).fadeIn(250, function () {
          legoChanging = false;
        });
      });
    };

    preload.onerror = function () {
      legoChanging = false;
      console.error("이미지를 불러올 수 없습니다:", nextSrc);
    };

    preload.src = nextSrc;

  });

  
  

/* =========================================
   SECTION 02 시작 : 반대쪽 이미지 변경
========================================= */
$(function () {

  const $section = $("#p05_s02");
  const $left = $section.find(".magazine-left");
  const $right = $section.find(".magazine-right");

  const path = "img/sub5_img/";

  const leftImages = [
    "sub5_2-magazine_left11.png",
    "sub5_2-magazine_left22.png",
    "sub5_2-magazine_left33.png",
    "sub5_2-magazine_left44.png"
  ];

  const rightImages = [
    "sub5_2-magazine_right11.png",
    "sub5_2-magazine_right22.png",
    "sub5_2-magazine_right33.png",
    "sub5_2-magazine_right44.png",
    "sub5_2-magazine_right55.png"
  ];

  let leftIndex = 0;
  let rightIndex = 0;

  // 왼쪽 사진 호버 → 오른쪽 사진만 변경
  $left.on("mouseenter", function () {

    rightIndex = (rightIndex + 1) % rightImages.length;

    $right.attr(
      "src",
      path + rightImages[rightIndex]
    );

  });

  // 오른쪽 사진 호버 → 왼쪽 사진만 변경
  $right.on("mouseenter", function () {

    leftIndex = (leftIndex + 1) % leftImages.length;

    $left.attr(
      "src",
      path + leftImages[leftIndex]
    );

  });

});
/* SECTION 02 끝 */





  /* SECTION 07: 아래 독립 초기화 코드에서 3D 캐러셀 제어 */
});

/* ==================================================
   SECTION 03 - 랜덤 선물 상자 : 스크롤 인터랙션
   - 아래로 스크롤 : 상자가 흔들린 뒤 선물이 팍 튀어나옴
   - 위로 스크롤 : 닫힌 상자로 되돌아감
   - 숫자 카운트다운은 사용하지 않음
   ================================================== */
$(function () {
  const section = document.getElementById('p05_s03');
  if (!section) return;
  const $closed = $('#p05_s03 .random-box-closed');
  const $opened = $('#p05_s03 .random-box-opened');
  let opened = false;
  let pending = false;
  let timer = null;


  // 열리는 이미지 미리 불러오기 : 애니메이션 시작 시 깜빡임 감소
  const preloaded = new Image();
  preloaded.src = 'img/sub5_img/sub5_3-randombox11.png';

  function updateRandomScroll() {
    const rect = section.getBoundingClientRect();
    // 기존 카운트다운이 0이 되던 시점과 동일한 열림 시점
    const progress = Math.max(0, Math.min(1, (window.innerHeight * .95 - rect.top) / (window.innerHeight * .70)));
    const shouldOpen = progress >= 1;
    if (shouldOpen && !opened && !pending) {
      pending = true;
      // SECTION 03 - 0.55초 동안 흔들림이 점점 강해지고 이후 상자가 열림
      $closed.addClass('is-shaking'); // SECTION 03 - 대기 시작과 동시에 흔들리며 점점 강해짐
      timer = window.setTimeout(function () {
        $closed.removeClass('is-shaking').addClass('is-gone');
        $opened.addClass('is-open');
        opened = true;
        pending = false;
      }, 550);
    } else if (!shouldOpen && (opened || pending)) {
      window.clearTimeout(timer);

      $closed.removeClass('is-shaking is-gone');
      $opened.removeClass('is-open');
      opened = false;
      pending = false;
    }
  }
  $(window).on('scroll resize', updateRandomScroll);
  updateRandomScroll();
});


/* ============================================================
   SECTION 04 - 가상 아이돌
   1) 오른쪽 아코디언 클릭 → 가상 아이돌 모델 교체
   2) 좌우 삼각형 버튼 또는 드래그 → 준비된 각도 이미지로 교체
   3) 상품 상세 팝업 기능은 사용하지 않음
   ============================================================ */
$(function(){
 const $section=$('#p05_s04');if(!$section.length)return;
 // 아이돌 1·2는 8장, 아이돌 3은 실제 존재하는 5장만 사용 (33번 없음)
 const members=[
  {name:'ODD ONE',files:['11','12','13','14','15','16','17','18']},
  {name:'ODD TWO',files:['21','22','23','24','26','27','25','28']},
  {name:'ODD THREE',files:['31','32','34','35','36']}
 ];
 let member=0,frame=0,startX=null,dragDistance=0,requested=0,lastDragFrameAt=0;
 // 이미지 사전 로드: 여자 아이돌 포함, 회전 중 다운로드 지연으로 인한 순간 역회전/깜빡임 방지
 members.forEach((m,mi)=>m.files.forEach((_,fi)=>{const img=new Image();img.src='img/sub5_img/sub5_4-'+m.files[fi]+'.png';}));
 const $model=$('#idol-model');
 const srcFor=(m,n)=>'img/sub5_img/sub5_4-'+members[m].files[n]+'.png';
 function showFrame(next){
  // 아이돌 02는 실제 8장 이미지를 비교하여 회전 방향이 이어지도록 배열을 재정렬했습니다.
  const files=members[member].files;frame=(next+files.length)%files.length;
  const src=srcFor(member,frame);const serial=++requested;const im=new Image();
  im.onload=function(){if(serial===requested){$model.attr('src',src).attr('alt',members[member].name+' '+(frame+1)+'번째 각도');}};
  im.onerror=function(){console.warn('아이돌 이미지 경로 확인:',src);};im.src=src;
  // SECTION 04 - 발밑 숫자 카운터 제거
 }
 // SECTION 04 - 멤버별 은은한 파스텔 색상 (중앙 1600×1080만 변경)
 const palettes=[
  {bg:'#F7F4EF',line:'#D8D0C7',panel:'#F0EBE4',active:'#EAE2D9'}, // 아이돌 1 : 따뜻한 아이보리
  {bg:'#F4F0E9',line:'#DDD2C6',panel:'#EEE7DF',active:'#E8DDD2'}, // 아이돌 2 : 옅은 세이지
  {bg:'#F0F0EE',line:'#D5D5D0',panel:'#E9E9E5',active:'#E1E1DC'}  // 아이돌 3 : 옅은 라벤더
 ];
 function selectMember(next){
  member=next;frame=0;
  const color=palettes[member];
  const stage=$section.find('.idol-stage')[0];
  stage.style.setProperty('--idol-bg',color.bg);
  $section[0].style.setProperty('--idol-bg',color.bg); // 1920×1080 전체 배경 동기화
  stage.style.setProperty('--idol-line',color.line);
  stage.style.setProperty('--idol-panel',color.panel);
  stage.style.setProperty('--idol-active',color.active);
  $section.find('.idol-member').each(function(){const active=Number(this.dataset.member)===member;$(this).toggleClass('is-active',active).attr('aria-expanded',active).find('.idol-member-arrow').text(active?'−':'+');});
  $section.find('.idol-member-detail').each(function(i){$(this).toggleClass('is-active',i===member);});
  showFrame(0);
  // 선택한 멤버의 모델만 전환하고 상품 팝업은 표시하지 않음
  $section.find('.idol-model-frame').removeClass('is-shifted');
 }
 $section.find('.idol-member').on('click',function(){selectMember(Number(this.dataset.member));});
 $section.find('.idol-prev').on('click',function(){showFrame(frame-1);});
 $section.find('.idol-next').on('click',function(){showFrame(frame+1);});
 const viewer=document.getElementById('idol-viewer');
 viewer.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;startX=e.clientX;dragDistance=0;lastDragFrameAt=0;viewer.setPointerCapture(e.pointerId);});
 viewer.addEventListener('pointermove',function(e){if(startX===null)return;dragDistance+=e.clientX-startX;startX=e.clientX;const now=performance.now();if(Math.abs(dragDistance)>=65 && now-lastDragFrameAt>=110){const step=dragDistance>0?-1:1;showFrame(frame+step);dragDistance=0;lastDragFrameAt=now;}});
 viewer.addEventListener('pointerup',function(){startX=null;dragDistance=0;});viewer.addEventListener('pointercancel',function(){startX=null;dragDistance=0;});
 selectMember(0);
});

/* ============================================================
   SECTION 05 | ODDAY × MINI
   - 스크롤로 단락 05가 보이기 시작하면 왼쪽 이미지가 바깥에서 진입
   - 진입하는 동안 불투명도 0% → 100% (1.55초)
   - 오른쪽 이미지는 항상 100% 불투명, 클릭 시 즉시 교체
   - 왼쪽 이미지는 클릭 0.2초 후 교체하고 진입 효과 재생
   ============================================================ */
$(function () {
  const section = document.getElementById('p05_s05');
  if (!section) return;
  const left = section.querySelector('.mini-detail-image');
  const rightCards = Array.from(section.querySelectorAll('.mini-feature-image'));
  const detail = section.querySelector('.mini-description');
  // SECTION 05 : 뒤쪽으로 드러난 흑백 이미지 버튼만 클릭 가능
const switchButton = section.querySelector('.mini-back-switch');
  const backImage = section.querySelector('.mini-back-image');
  const leftImages = ['img/sub5_img/sub5_5-55.png', 'img/sub5_img/sub5_5-77.png'];
  const rightImages = ['img/sub5_img/sub5_5-1.png', 'img/sub5_img/sub5_5-2.png'];
  [...leftImages, ...rightImages].forEach(function (src) {
    const img = new Image(); img.src = src;
  });
  let index = 0;
  let entered = false;
  let entranceFrame1 = null;
  let entranceFrame2 = null;

  // 진행 중인 재생 예약을 취소하고 매번 진입 모션을 처음부터 실행
  function playLeftEntrance() {
    if (entranceFrame1 !== null) cancelAnimationFrame(entranceFrame1);
    if (entranceFrame2 !== null) cancelAnimationFrame(entranceFrame2);
    section.classList.remove('is-description-visible');
    void detail.offsetWidth; // 브라우저에 초기 위치를 즉시 반영
    entranceFrame1 = requestAnimationFrame(function () {
      entranceFrame2 = requestAnimationFrame(function () {
        section.classList.add('is-description-visible');
        entranceFrame1 = null;
        entranceFrame2 = null;
      });
    });
  }

  function checkSectionEntry() {
    if (entered) return;
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight * .85 || rect.bottom <= 0) return;
    entered = true;
    section.classList.add('is-visible');
    playLeftEntrance();
    $(window).off('scroll.sub5Mini resize.sub5Mini', checkSectionEntry);
  }
  $(window).on('scroll.sub5Mini resize.sub5Mini', checkSectionEntry);
  checkSectionEntry();

  // 뒤쪽 흑백 이미지의 노출 영역을 클릭할 때마다 반복 전환
  let leftSwitchTimer = null;
  backImage.addEventListener('animationend', function () {
    backImage.classList.remove('is-click-animating');
  });
  // click! 문구는 평소 깜빡이고, 클릭 시 1.1초간 멈췄다가 재개
  const clickLabel = section.querySelector('.mini-back-click-label');
  let clickPauseTimer = null;
  switchButton.addEventListener('click', function () {
    if (clickLabel) {
      clickLabel.classList.add('is-click-paused');
      window.clearTimeout(clickPauseTimer);
      clickPauseTimer = window.setTimeout(function () {
        clickLabel.classList.remove('is-click-paused');
      }, 1100);
    }
    index = 1 - index;

    // 우측 메인 이미지와 뒤쪽 흑백 이미지는 즉시 함께 변경
    rightCards.forEach(function (card, i) {
      card.classList.toggle('is-front', i === index);
    });
    backImage.src = rightImages[index];

    // 클릭할 때마다 뒤쪽 흑백 이미지 모션을 처음부터 재생
    backImage.classList.remove('is-click-animating');
    void backImage.offsetWidth;
    backImage.classList.add('is-click-animating');

    // 좌측 이미지는 마지막 클릭으로부터 0.2초 후 변경
    window.clearTimeout(leftSwitchTimer);
    leftSwitchTimer = window.setTimeout(function () {
      left.src = leftImages[index];
      left.alt = index ? 'ODDAY × MINI 콜라보 한정상품' : 'ODDAY × MINI 팝업스토어 매장';
      section.classList.add('is-visible');
      playLeftEntrance();
      leftSwitchTimer = null;
    }, 200);
  });
});

/* ============================================================
   SECTION 06 시작 : 마우스 패럴랙스 / 상품 사진 호버 / 테이프 들림
   ============================================================ */
$(function(){
  const $stage=$('#p05_s06 .s06-stage');
  if(!$stage.length)return;

  const $objects=$stage.find('.s06-object');

  const tapePairs={
    neck01:'tape02',
    model:'tape03',
    ring:'tape4',
    neck02:'tape',
    bangle:'tape5'
  };

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* SECTION 06 : 오브젝트별 패럴랙스 강도 */

const strength = {
  star: 0,       // 별 : 독립 애니메이션만
  odday: 0,      // ODDAY : 독립 애니메이션만
  heart: 0,      // 하트 : 독립 애니메이션만
  flower: 0,     // 꽃 : 독립 애니메이션만

  tape02: 0,
  tape03: 0,
  tape4: 0,
  tape: 0,
  tape5: 0,

  neck01: 1,
  cap: 1,
  model: 1,
  ring: 1,
  neck02: 1,
  bangle: 1
};


  let px=0,py=0;

  $stage.on('mousemove',function(e){
    if(reduced)return;

    const r=this.getBoundingClientRect();
    px=((e.clientX-r.left)/r.width-.5)*2;
    py=((e.clientY-r.top)/r.height-.5)*2;

    $objects.each(function(){
      const name=this.getAttribute('data-item');
      const power=strength[name] ?? 4;

      this.querySelector('img').style.setProperty(
        '--s06-x',(px*power).toFixed(2)+'px'
      );
      this.querySelector('img').style.setProperty(
        '--s06-y',(py*power*.65).toFixed(2)+'px'
      );
    });
  });

  $stage.on('mouseleave',function(){
    px=0;
    py=0;
    $objects.find('img').css({
      '--s06-x':'0px',
      '--s06-y':'0px'
    });
    $objects.removeClass('s06-lift');
  });

  $stage.find('.s06-photo').on('mouseenter',function(){
    const tape=tapePairs[this.getAttribute('data-item')];
    if(tape){
      $stage.find('.s06-tape[data-item="'+tape+'"]').addClass('s06-lift');
    }
  }).on('mouseleave',function(){
    const tape=tapePairs[this.getAttribute('data-item')];
    if(tape){
      $stage.find('.s06-tape[data-item="'+tape+'"]').removeClass('s06-lift');
    }
  });
});
/* SECTION 06 끝 */



/* ============================================================
   SECTION 07 | SNS 커뮤니티 3D 캐러셀
   - 첫 중앙 이미지: sub5_7-1.png
   - 좌/우 카드 클릭: 선택한 카드가 중앙으로 슬라이드
   - 중앙 카드 호버: CSS에서 확대·상승·텍스트 등장
   - 6장 순환 (1→2→3→4→5→6→1)
   ============================================================ */
$(function(){
  const section=document.getElementById('p05_s07');
  if(!section)return;
  const cards=Array.from(section.querySelectorAll('.story-slide'));
  let current=0;
  const count=cards.length;
  function render(){
    cards.forEach((card,i)=>{
      // 양방향 최단거리: 6장일 때 반대편 카드도 자연스럽게 이어짐
      let delta=(i-current+count)%count;
      if(delta>count/2)delta-=count;
      // 정확히 반 바퀴 떨어진 카드는 뒤쪽에 숨김
      const hidden=Math.abs(delta)>=3;
      card.style.setProperty('--offset',String(delta));
      card.classList.toggle('is-center',delta===0);
      card.classList.toggle('is-near',Math.abs(delta)===1);
      card.classList.toggle('is-far',Math.abs(delta)===2);
      card.classList.toggle('is-hidden',hidden);
      card.style.zIndex=String(10-Math.abs(delta));
      card.setAttribute('aria-label',delta===0?'현재 스토리 '+(i+1)+' (클릭하면 다음 스토리)':'스토리 '+(i+1)+' 중앙으로 이동');
      card.tabIndex=hidden?-1:0;
    });
  }
  // SECTION 07: 좌우 카드 클릭 시에만 해당 카드가 중앙으로 이동
  // 중앙 카드 호버는 CSS 확대/상승/텍스트 효과만 담당
  cards.forEach((card,i)=>{
    card.addEventListener('click',()=>{
      if(i===current){current=(current+1)%count;}else{current=i;}render();
    });
  });
  render();
});

/* ============================================================
   공통 기능 01 · 헤더 로고 눈동자 따라오기
   - 기존 odday-shared.js에서 통합
   ============================================================ */
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

 });
})(jQuery);

/* ============================================================
   공통 기능 02 · TOP 버튼
   - SECTION 07 시작 지점에 도달하면 표시
   - 클릭 즉시 맨 위로 이동 (CSS smooth-scroll 일시 해제)
   - 두 버튼 클래스 모두 지원, 이벤트는 한 번만 등록
   ============================================================ */
$(function () {
  const $topButtons = $('.od-top-button, .od-shared-top');
  const section07 = document.getElementById('p05_s07');
  if (!$topButtons.length) return;

  function updateTopButton() {
    if (!section07) {
      $topButtons.removeClass('is-visible');
      return;
    }
    const threshold = section07.getBoundingClientRect().top + window.scrollY;
    $topButtons.toggleClass('is-visible', window.scrollY >= threshold - 10);
  }

  $(window).on('scroll.oddayTop resize.oddayTop', updateTopButton);
  updateTopButton();

  $topButtons.on('click.oddayTop', function () {
    $('html, body').stop(true, true);
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    requestAnimationFrame(function () { html.style.scrollBehavior = previous; });
  });
});

//공통// ODDAY jQuery 인터랙션
/* ============================================================
   ODDAY · jQuery / JavaScript
   01 인트로        #section01
   02 콜라주 팝업   #section02
   03 날씨 드래그   section3/index.html (iframe 내부 스크립트)
   04 후드티 디테일 #section04
   05 룩북          #section05
   06 테이프 이동   #section06
   07 순차 등장     #section07
   ============================================================ */

const modal=document.getElementById('collageDialog'),pic=document.getElementById('dialogImg'),caption=document.getElementById('dialogName');document.querySelectorAll('.collage-item').forEach(b=>b.addEventListener('click',()=>{pic.src=b.classList.contains('shirt')?'img/index_img/collage-shirt1.png':b.querySelector('img').src;pic.alt=b.dataset.name;caption.textContent=b.dataset.name;modal.showModal()}));document.getElementById('closeDialog').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});// 검색/좋아요/장바구니는 새 헤더에서 사용하지 않아 이벤트 미연결.
// Section 4: click photos to enlarge; feature + buttons and color choices work independently.
document.querySelectorAll('.hoodie-hit').forEach(button=>button.addEventListener('click',()=>{pic.src=button.dataset.image;pic.alt=button.dataset.title;caption.textContent=button.dataset.title;modal.showModal()}));
const hc=document.getElementById('hoodieCaption');
function showHoodieCaption(value){hc.textContent=value;hc.classList.add('visible')}
// Each detail button opens one shared expanding section BELOW the artwork.
const hoodieFeatures = {
 zip:{index:'DETAIL 01 / 03',title:'HALF ZIPPER',lead:'하프 지퍼로 완성하는 자연스러운 넥라인',description:'지퍼를 올리면 깔끔한 하이넥 무드, 가볍게 내리면 편안한 캐주얼 무드. 입는 방식에 따라 다른 느낌을 표현하는 포인트입니다.',image:'img/index_img/detail_zipper.png',tags:['ADJUSTABLE NECKLINE','DAILY COMFORT','ZIP DETAIL']},
 sleeve:{index:'DETAIL 02 / 03',title:'RAGLAN STYLE',lead:'움직임을 따라 흐르는 소매 라인',description:'어깨에서 소매까지 이어지는 배색 라인이 스타일에 리듬을 더합니다. 과하지 않은 스트리트 감성으로 데님과 와이드 팬츠에 자연스럽게 어울립니다.',image:'img/index_img/detail_stripe.png',tags:['CONTRAST LINE','STREET MOOD','RELAXED FIT']},
 fabric:{index:'DETAIL 03 / 03',title:'PREMIUM FABRIC',lead:'매일 손이 가는 부드러운 텍스처',description:'브라운과 블랙 컬러의 조화, 풍성한 후드와 편안한 원단 느낌을 가까이에서 볼 수 있습니다. 가볍게 스타일링하기 좋은 데일리 후드티입니다.',image:'img/index_img/detail_fabric.png',tags:['SOFT TOUCH','EVERYDAY WEAR','FABRIC TEXTURE']}
};
// SECTION 04 | 큰 디테일 팝오버: 부드러운 전환과 바깥 클릭 닫기
const $hf = $('#hoodieFeaturePanel');
const $featureInside = $hf.find('.hoodie-feature-inner');
let currentHoodieFeature = '';
let panelTransitionId = 0;

function closeHoodieFeature() {
  if ($hf.prop('hidden')) return;
  panelTransitionId += 1;
  currentHoodieFeature = '';
  $('.hoodie-plus').attr('aria-expanded', 'false');
  $hf.removeClass('is-visible');
  window.setTimeout(function () {
    if (!$hf.hasClass('is-visible')) {
      $hf.prop('hidden', true);
    }
  }, 420);
}

function fillHoodieFeature(item) {
  $('#hoodieFeatureImage').attr({
    src: item.image,
    alt: item.title + ' 디테일 확대'
  });
  $('#hoodieFeatureIndex').text(item.index);
  $('#hoodieFeatureTitle').text(item.title);
  $('#hoodieFeatureLead').text(item.lead);
  $('#hoodieFeatureDescription').text(item.description);
  $('#hoodieFeatureTags').empty();
  item.tags.forEach(function (tag) {
    $('<span>').text(tag).appendTo('#hoodieFeatureTags');
  });
}

$('.hoodie-plus').on('click', function (event) {
  event.stopPropagation();
  const feature = this.dataset.feature;
  const item = hoodieFeatures[feature];
  if (!item) return;

  if (currentHoodieFeature === feature && $hf.hasClass('is-visible')) {
    closeHoodieFeature();
    return;
  }

  currentHoodieFeature = feature;
  const requestId = ++panelTransitionId;
  $('.hoodie-plus').attr('aria-expanded', 'false');
  $(this).attr('aria-expanded', 'true');

  // 새 정보는 숨겨진 상태에서 교체한 다음 한 번만 페이드 인.
  if (!$hf.hasClass('is-visible')) {
    fillHoodieFeature(item);
    $hf.prop('hidden', false);
    window.requestAnimationFrame(function () {
      $hf.addClass('is-visible');
    });
  } else {
    $featureInside.addClass('is-switching');
    window.setTimeout(function () {
      if (requestId !== panelTransitionId) return;
      fillHoodieFeature(item);
      $featureInside.removeClass('is-switching');
    }, 200);
  }
});

// 패널 안쪽은 누르더라도 닫히지 않습니다.
$hf.on('click', function (event) {
  event.stopPropagation();
});

// 닫기 버튼 대신 팝업 바깥 아무 영역이나 누르면 닫힙니다.
$(document).on('pointerdown', function (event) {
  if ($hf.prop('hidden')) return;
  if ($(event.target).closest('#hoodieFeaturePanel, .hoodie-plus').length) return;
  closeHoodieFeature();
});

$(document).on('keydown', function (event) {
  if (event.key === 'Escape') closeHoodieFeature();
});

// SECTION 04 | 작은 원형 컬러 버튼: 3색 후드 배열 + 메인 이미지 전환
const springColors = {
  Sage: {
    label: 'SPRING SAGE',
    hero: 'img/index_img/hoodie-sage.png',
    trio: ['img/index_img/hoodie-lavender.png', 'img/index_img/hoodie-sage.png', 'img/index_img/hoodie-navy.png'],
    featured: 1
  },
  Lavender: {
    label: 'SOFT LAVENDER',
    hero: 'img/index_img/hoodie-lavender.png',
    trio: ['img/index_img/hoodie-sage.png', 'img/index_img/hoodie-lavender.png', 'img/index_img/hoodie-navy.png'],
    featured: 1
  },
  Navy: {
    label: 'LIGHT NAVY',
    hero: 'img/index_img/hoodie-navy.png',
    trio: ['img/index_img/hoodie-sage.png', 'img/index_img/hoodie-navy.png', 'img/index_img/hoodie-lavender.png'],
    featured: 1
  }
};

let hoodieChangeTimer;

$('#section04 .color-pick').on('click', function () {
  const color = $(this).data('color');
  const selection = springColors[color];
  if (!selection) return;

  $('#section04 .color-pick').removeClass('selected').attr('aria-pressed', 'false');
  $(this).addClass('selected').attr('aria-pressed', 'true');

  const $hoodies = $('#section04 .hoodie-spin');
  const $frontHero = $('#section04 .odday-four__front');
  $hoodies.addClass('is-changing').removeClass('is-featured');
  window.clearTimeout(hoodieChangeTimer);

  hoodieChangeTimer = window.setTimeout(function () {
    $hoodies.each(function (index) {
      $(this).attr('src', selection.trio[index]);
      if (index === selection.featured) {
        $(this).addClass('is-featured');
      }
    });
    // Main garment stays identical to the brown/black hoodie worn by the model.
    $frontHero.attr('src', 'img/index_img/hoodie_front.png');
    $hoodies.removeClass('is-changing');
  }, 220);

  $('#springColorName').text(selection.label);
});


// Fifth section: each photo opens the original image in a native dialog.
document.querySelectorAll('.lookbook-photo').forEach(button=>button.addEventListener('click',()=>{
  const img=button.querySelector('img');
  pic.src=img.src; pic.alt=img.alt; caption.textContent=button.dataset.name;
  modal.showModal();
}));

// Sixth section: separate click targets over the exact supplied reference image.
document.querySelectorAll('.just-in-hotspot').forEach(button=>button.addEventListener('click',()=>{pic.src=button.dataset.image;pic.alt=button.dataset.title;caption.textContent=button.dataset.title;modal.showModal()}));


// Section 7 has its own editorial quick-view below (jQuery, without affecting other sections).

// SECTION 01 | 페이지 접속 0.5초 후 인트로 자동 오픈
$(function () {
  const $intro = $('#heroIntro');
  const $brand = $('#introBrand');
  let introPlayed = false;
  let introTimer;

  function openIntro() {
    if (introPlayed) return;
    introPlayed = true;
    clearTimeout(introTimer);

    $brand.stop(true).animate({ opacity: 0 }, 300);
    $intro.find('.intro-top')
      .stop(true).animate({ top: '-52%' }, 950, 'swing');
    $intro.find('.intro-bottom')
      .stop(true).animate({ bottom: '-52%' }, 950, 'swing', function () {
        $intro.addClass('opened').hide();
      });
  }

  // 로딩 완료 후 약 0.5초 뒤 자동으로 열립니다.
  introTimer = window.setTimeout(openIntro, 500);

  // 사용자가 먼저 로고를 누르면 즉시 열리며 중복 실행되지 않습니다.
  $brand.on('click', openIntro);
});

//5단락//

// 05 / jQuery: scroll-aware sticky editorial gallery.
// The large left photograph is pinned by CSS position:sticky, and naturally
// scrolls away when the two right photos have passed the end of the section.
$(function(){
  const $gallery=$('#section05');
  const $right=$gallery.find('.lookbook-right-scroll .lookbook-photo');
  let ticking=false;
  function updateGalleryScroll(){
    ticking=false;
    if(!$gallery.length)return;
    const top=$gallery.offset().top;
    const range=Math.max(1,$gallery.outerHeight()-$(window).height());
    const progress=Math.min(1,Math.max(0,($(window).scrollTop()-top)/range));
    // A subtle visual transition between upper and lower photos, without clipping.
    $gallery.attr('data-scroll-state',progress>.45?'second':'first');
    $right.each(function(index){
      const rect=this.getBoundingClientRect();
      const vh=window.innerHeight||800;
      const visible=Math.min(1,Math.max(0,(vh-rect.top)/Math.max(1,vh*.48)));
      $(this).css('opacity',(0.92+visible*.08).toFixed(3));
    });
  }
  $(window).on('scroll resize',function(){if(ticking)return;ticking=true;requestAnimationFrame(updateGalleryScroll)});
  updateGalleryScroll();
});

//7단락//


// 07 — Scroll-linked reveal, explicitly ordered right to left.
// Caps -> bag -> sneakers. Each item becomes visible at its own scroll threshold.
$(function () {
  const $stage = $('#section07');
  if (!$stage.length) return;
  const $frame = $stage.find('.moments-inner');
  const products = [
    $stage.find('.moments-caps'),
    $stage.find('.moments-bag'),
    $stage.find('.moments-shoes')
  ];
  let rafPending = false;
  function renderSequence() {
    rafPending = false;
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const stageTop = $stage[0].getBoundingClientRect().top + window.scrollY;
    const start = stageTop - viewport * .32; // start when section enters lower viewport
    const scrollDistance = Math.max(100, $stage.outerHeight() - $frame.outerHeight());
    const p = Math.max(0, Math.min(1, (window.scrollY - start) / scrollDistance));
    [0.08, 0.32, 0.55].forEach(function (threshold, i) {
      products[i].toggleClass('is-revealed', p >= threshold);
    });
  }
  function scheduleRender() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(renderSequence);
  }
  $(window).on('scroll resize load', scheduleRender);
  $(document).ready(scheduleRender);
  renderSequence();
});

// SECTION 06 | Seamless ODDAY tape animation
// Repeated text spans make the loop gapless, even after many clicks.
$(function () {
  const labels = {
    pink: 'COLORBLOCK JACKET',
    lime: 'BAGGY DENIM',
    blue: 'HIGH-TOP SNEAKERS',
    all: 'JUST IN · DENIM COLLECTION'
  };

  $('.od-product, .od-denim-card').on('click', function () {
    const choice = $(this).data('tape');

    $('.od-product, .od-denim-card').removeClass('is-selected');
    $(this).addClass('is-selected');

    $('.od-tape-caption')
      .stop(true, true)
      .fadeOut(140, function () {
        $(this).text(labels[choice]).fadeIn(260);
      });

    // Tape stays in motion without resetting its animation position.
    const $target = choice === 'all'
      ? $('.od-tape')
      : $('.od-tape-' + choice);

    $target.addClass('tape-highlight');
    window.setTimeout(function () {
      $target.removeClass('tape-highlight');
    }, 500);
  });
});


/* ==================================================
   SECTION 02 | jQuery 스크롤 & 클릭 인터랙션
   ================================================== */
$(function () {
  const $section = $('#section02');
  const $items = $section.find('.collage-reveal');
  const $word = $section.find('.collage-word');
  let started = false;

  function revealCollage() {
    if (started || !$section.length) return;

    const rect = $section[0].getBoundingClientRect();
    const trigger = window.innerHeight * 0.82;

    // 섹션 상단이 화면 82% 위치에 오면 순차 등장
    if (rect.top < trigger && rect.bottom > 0) {
      started = true;
      $items.each(function (index) {
        const item = this;
        window.setTimeout(function () {
          $(item).addClass('is-visible');
        }, index * 210);
      });
    }
  }

  $(window).on('scroll.collage resize.collage', revealCollage);
  revealCollage();

  // 기존 클릭 이미지 확대 팝업은 그대로 유지
  $items.on('click.collageColor', function () {
    const nextColor = $(this).attr('data-od-color');
    if (nextColor) $word.css('color', nextColor);
  });
});




/* =======================================================
   SECTION 05 | 우측 화보가 끝나면 sticky 자동 해제
   ======================================================= */
$(function () {
  const $section = $('#section05');
  const $frames = $section.find('.lookbook-right-scroll .lookbook-flow');
  if (!$frames.length) return;

  let scheduled = false;
  function updateLookbook() {
    scheduled = false;
    const middle = $(window).scrollTop() + $(window).height() * .55;
    let active = 0;
    $frames.each(function (i) {
      if ($(this).offset().top <= middle) active = i;
    });
    $section.attr('data-active-look', active + 1);
  }
  $(window).on('scroll.oddayLookbook resize.oddayLookbook', function () {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateLookbook);
  });
  updateLookbook();
});

/* ==================================================
   SECTION 06 | 상품별 오른쪽 슬라이드 소개
   ================================================== */
$(function () {
  const items = {
    pink: {
      title: 'SPRING JACKETS',
      copy: '가벼운 컬러 블록으로 완성한 봄 아우터. 일상의 움직임에 경쾌한 색을 더합니다.',
      image: 'img/index_img/just-in-shoes-cut.png'
    },
    lime: {
      title: 'EVERYDAY DENIM',
      copy: '여유로운 실루엣과 자연스러운 워싱. 매일 편하게 입는 데님 스타일.',
      image: 'img/index_img/just-in-jacket-cut.png'
    },
    blue: {
      title: 'DAILY SNEAKERS',
      copy: '가벼운 발걸음을 위한 클래식 스니커즈. 봄날의 다양한 룩에 어울립니다.',
      image: 'img/index_img/just-in-pants-cut.png'
    },
    all: {
      title: 'JUST IN / DENIM',
      copy: '새로운 시즌의 데님을 만나보세요. 편안한 핏과 다채로운 컬러의 조합.',
      image: 'img/index_img/denim-indigo.png'
    }
  };

  const $section = $('#section06');
  const $panel = $section.find('.just-detail');
  const $gallery = $panel.find('.just-detail-gallery');

  $section.find('.od-product, .od-denim-card').on('click', function () {
    const item = items[$(this).data('tape')];
    if (!item) return;

    $panel.find('.just-detail-title').text(item.title);
    $panel.find('.just-detail-copy').text(item.copy);
    $gallery.stop(true).fadeTo(130, 0, function () {
      $(this).attr({ src: item.image, alt: item.title });
      $(this).fadeTo(300, 1);
    });

    $section.addClass('just-detail-open');
    $panel.attr('aria-hidden', 'false');
    $section.find('.just-detail-close').trigger('focus');
  });

  function closeDetail() {
    $section.removeClass('just-detail-open');
    $panel.attr('aria-hidden', 'true');
  }

  $section.find('.just-detail-close, .just-detail-backdrop')
    .on('click', closeDetail);

  $(document).on('keydown', function (event) {
    if (event.key === 'Escape') closeDetail();
  });
});


/* ====================================================
   SECTION 01 | 배경과 글자를 분리한 메인 로고 스크롤
   - 배경은 고정된 화보 이미지
   - ODDAY 글자만 중앙에서 시작해 단락 하단까지 이동
   - 위로 스크롤하면 같은 경로로 다시 중앙 복귀
   ==================================================== */
$(function () {
  const $hero = $('#section01');
  const $word = $('#heroWord');
  if (!$hero.length || !$word.length) return;

  let waiting = false;
  function updateWord() {
    waiting = false;
    const heroHeight = $hero.innerHeight();
    const wordHeight = $word.outerHeight();
    const heroTop = $hero.offset().top;
    const scrollInto = Math.max(0, $(window).scrollTop() - heroTop);

    const startY = heroHeight * 0.475;
    const endY = heroHeight - wordHeight / 2 - 2;
    const travel = Math.max(0, endY - startY);
    const progress = Math.min(1, scrollInto / Math.max(1, heroHeight * 0.56));
    const currentY = startY + (travel * progress);

    $word.css('top', currentY + 'px');
  }

  function onScroll() {
    if (waiting) return;
    waiting = true;
    window.requestAnimationFrame(updateWord);
  }

  $(window).on('scroll.heroWord resize.heroWord load.heroWord', onScroll);
  updateWord();
});



/* SECTION02 | centered brand mark: click recolors and gently rotates */
$(function(){
  const $section=$('#section02'); const $logo=$section.find('.collage-word');
  const themes=[
    {bg:'linear-gradient(135deg,#e9a0b9,#f1bccd)',ink:'#17201d'},
    {bg:'linear-gradient(135deg,#d7e58d,#c3d96e)',ink:'#1b241c'},
    {bg:'linear-gradient(135deg,#c8dfed,#e1e9eb)',ink:'#243a45'},
    {bg:'linear-gradient(135deg,#cbdad0,#b1cec0)',ink:'#243d35'},
    {bg:'linear-gradient(135deg,#edc6b5,#e5a6bd)',ink:'#47313e'}
  ];
  $section.find('.collage-item').on('click.oddayCenterLogo',function(){
    const index=$section.find('.collage-item').index(this);const theme=themes[index]||themes[0];
    $section[0].style.setProperty('--odday-theme-bg',theme.bg);
    $section[0].style.setProperty('--odday-logo-color',theme.ink);
    $logo.removeClass('odday-logo-twist');void $logo[0].offsetWidth;$logo.addClass('odday-logo-twist');
  });
});


/* 2026-10-31: jQuery-controlled ODDAY travel behind the clicked image. */
$(function(){
  const $area=$('#section02'), $word=$area.find('.collage-word');
  const node=$word[0];
  if(!node) return;
  let direction=1;
  const motion={x:50,alpha:.75};
  $area.find('.collage-item').on('click.oddayBrandTravel',function(){
    direction=-direction;
    $(motion).stop(true,false).animate({x:50+9*direction,alpha:.94},{
      duration:390, easing:'swing',step:function(){
        node.style.setProperty('left',motion.x+'%','important');
        node.style.setProperty('opacity',motion.alpha,'important');
      },complete:function(){
        $(motion).animate({x:50,alpha:.75},{duration:580,easing:'swing',step:function(){
          node.style.setProperty('left',motion.x+'%','important');
          node.style.setProperty('opacity',motion.alpha,'important');
        }});
      }
    });
  });
});

/* Mark only the lavender-shirt dialog for edge-safe image cropping. */
$(function(){
  $('#section02 .collage-item').on('click.oddayShirtCrop',function(){
    $('#collageDialog').toggleClass('odday-shirt-dialog',$(this).hasClass('shirt'));
  });
});


/* Section 04: actual jQuery carousel navigation; preserves all original image assets. */
$(function(){
  const $section=$('#section04');
  const $stage=$section.find('#oddaySpinStage');
  if(!$stage.length)return;
  let busy=false;
  function move(dir){
    if(busy)return;
    busy=true;
    const $items=$stage.children('img.hoodie-spin');
    $items.stop(true,true).animate({opacity:.18},140,function(){});
    window.setTimeout(function(){
      const $all=$stage.children('img.hoodie-spin');
      if(dir>0)$all.first().appendTo($stage);else $all.last().prependTo($stage);
      const $new=$stage.children('img.hoodie-spin');
      $new.removeClass('hoodie-spin-one hoodie-spin-two hoodie-spin-three is-featured');
      $new.eq(0).addClass('hoodie-spin-one');
      $new.eq(1).addClass('hoodie-spin-two is-featured');
      $new.eq(2).addClass('hoodie-spin-three');
      $new.css('opacity',0).animate({opacity:1},220,function(){busy=false});
      const names={'hoodie-sage.png':'SPRING SAGE','hoodie-lavender.png':'SOFT LAVENDER','hoodie-navy.png':'LIGHT NAVY'};
      const key=($new.eq(1).attr('src')||'').split('/').pop();
      if(names[key])$section.find('#springColorName').text(names[key]);
    },155);
  }
  $section.find('.odday-spin-next').on('click',function(){move(1)});
  $section.find('.odday-spin-prev').on('click',function(){move(-1)});
});


/* ODDAY section04 standalone interaction */
jQuery(function($){
 var $root=$('#section04.od4');if(!$root.length)return;
 var sets=[{name:'RELAXED HOODIES',title:'SOFT LAYER / HOODIES',items:['COLOR BLOCK','MONO CHROME','EARTH TONE']},{name:'SPRING OVERSHIRTS',title:'LIGHT WEIGHT / SHIRTS',items:['CHARCOAL TWO POCKET','OLIVE LINE SHIRT','BLUE DENIM ONE POCKET']},{name:'LIGHT LEATHER',title:'SPRING EDIT / LEATHER',items:['VARSITY BOMBER','VINTAGE BROWN','MINIMAL BLACK']}];
 var collection=0,product=0,angle=0,$rot=$root.find('.od4-hero-rotator');
 function src(c,p){return 'img/index_img/od4_'+c+'_'+p+'.png'}
 function render(){var set=sets[collection];$root.find('#od4Count').text(('0'+(collection+1)).slice(-2));$root.find('#od4Title').text(set.title);$root.find('#od4CollectionName').text('0'+(collection+1)+' / '+set.name);$root.find('#od4HeroName').text('0'+(product+1)+' — '+set.items[product]);$root.find('#od4Hero').attr('src',src(collection,product)).attr('alt',set.items[product]);$rot.css('--od4-current-image','url("'+src(collection,product)+'")');$root.find('.od4-mini').each(function(i){$(this).toggleClass('is-selected',i===product).find('img').attr('src',src(collection,i)).attr('alt',set.items[i]);});$root.find('.od4-swatch').each(function(i){$(this).toggleClass('active',i===collection).attr('aria-pressed',i===collection?'true':'false')});}
 $root.on('click','.od4-swatch',function(){collection=Number($(this).attr('data-collection'));product=0;angle=0;$rot.css('transform','rotateY(0deg)');render()});
 $root.on('click','.od4-mini',function(){product=Number($(this).attr('data-product'));angle=0;$rot.css('transform','rotateY(0deg)');render()});
 /* Main arrows handled by editorial reveal below. */
 render();
});


/* 04 EDITORIAL PRODUCT REVEAL — replaces only the section04 hero arrow interaction */
jQuery(function($){
 var $root=$('#section04.od4');if(!$root.length)return;
 var $stage=$root.find('.od4-hero-stage'),$rot=$root.find('.od4-hero-rotator'),$hero=$root.find('#od4Hero');
 var names=[['COLOR BLOCK','MONO CHROME','EARTH TONE'],['NAVY & CREAM','OLIVE & IVORY','SOFT DENIM'],['VARSITY BOMBER','VINTAGE BROWN','MINIMAL BLACK']];
 var currentCollection=0,currentProduct=0,animating=false,reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 // Override the original delegated hero arrow handlers; other original controls stay intact.
 $root.off('click','.od4-prev,.od4-next');
 $rot.css({transform:'none',transition:'none'});
 function updateProductUI(){
   var c=currentCollection,p=currentProduct;
   $root.find('#od4HeroName').text('0'+(p+1)+' — '+names[c][p]);
   $root.find('.od4-mini').each(function(i){$(this).toggleClass('is-selected',i===p)});
 }
 function reveal(next,dir){
   if(animating)return;animating=true;
   var c=currentCollection,target='img/index_img/od4_'+c+'_'+next+'.png';
   if(reduced){$hero.attr('src',target).attr('alt',names[c][next]);currentProduct=next;updateProductUI();animating=false;return}
   $hero.stop(true,true).css({transform:'translate3d(0,0,0) scale(1)',filter:'drop-shadow(0 28px 24px rgba(25,27,23,.19))'});
   $hero.animate({opacity:0,marginLeft:-dir*60},240,'swing',function(){
     $hero.attr('src',target).attr('alt',names[c][next]).css({marginLeft:dir*80,opacity:0});
     currentProduct=next;updateProductUI();
     var done=function(){ $hero.animate({opacity:1,marginLeft:0},440,'swing',function(){animating=false;}); };
     if($hero[0].complete)done();else $hero.one('load',done).one('error',done);
   });
 }
 $root.on('click','.od4-prev,.od4-next',function(e){
   e.preventDefault();e.stopPropagation();
   var dir=$(this).hasClass('od4-next')?1:-1;
   reveal((currentProduct+dir+3)%3,dir);
 });
 // Preserve the original collection and mini image switching; reset when they are chosen.
 $root.on('click','.od4-swatch',function(){currentCollection=Number($(this).attr('data-collection'));currentProduct=0;animating=false;$hero.stop(true,true).css({marginLeft:0,opacity:1,transform:'none'});});
 $root.on('click','.od4-mini',function(){currentProduct=Number($(this).attr('data-product'));animating=false;$hero.stop(true,true).css({marginLeft:0,opacity:1,transform:'none'});});
 // Gentle product inspection parallax. Never crops or moves the layout box.
 $stage.on('mousemove',function(e){
   if(reduced||animating)return;
   var r=this.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   $hero.css('transform','translate3d('+(-x*12).toFixed(1)+'px,'+(-y*10).toFixed(1)+'px,0) scale(1.035)');
 });
 $stage.on('mouseleave',function(){$hero.css('transform','translate3d(0,0,0) scale(1)')});
 $root.find('.od4-nav').attr('title','다음 디자인 보기');
 $root.find('.od4-prev').attr('aria-label','이전 디자인 보기');
 $root.find('.od4-next').attr('aria-label','다음 디자인 보기');
 $root.find('.od4-hero-bottom span').first().text('MOVE / HOVER TO EXPLORE');
});


/* SECTION 07 / Editorial Quick View – jQuery only; no changes to other sections */
$(function () {
  const $overlay = $('#odMoodOverlay');
  if (!$overlay.length) return;
  const moodItems = [
    {
      selector: '.moments-caps button', no:'01', kicker:'COLOR PLAY / ACCESSORIES', title:'Color Play Caps', subtitle:'A LITTLE COLOR, EVERY DAY.',
      desc:'작은 컬러의 변화로 완성하는 오늘의 무드. 익숙한 일상에 산뜻한 포인트를 더하는 ODDAY 캡 컬렉션.',
      notes:'소프트한 컬러 · 데일리 캐주얼 · 유니섹스 스타일링',
      variants:[
        {name:'CREAM CLASSIC', color:'#d9cdbd', src:'img/index_img/mood-cap-cream.png'},
        {name:'SKY STITCH', color:'#a8c4dc', src:'img/index_img/mood-cap-sky.png'},
        {name:'DUSTY PINK', color:'#dba6a3', src:'img/index_img/mood-cap-pink.png'},
        {name:'FOREST WASH', color:'#555b4b', src:'img/index_img/mood-cap-forest.png'}
      ]
    },
    {
      selector: '.moments-bag button', no:'02', kicker:'EVERYDAY / CARRY', title:'Everyday Messenger Bag', subtitle:'CARRY YOUR DAY.',
      desc:'바쁜 일상부터 가벼운 산책까지. 자연스럽게 어깨에 걸치고 오늘의 움직임을 함께하는 메신저백.',
      notes:'실용적인 실루엣 · 캐주얼 레이어링 · 데일리 아이템',
      variants:[
        {name:'DEEP NAVY', color:'#1e2e4b', src:'img/index_img/mood-bag-navy.png'},
        {name:'INK UTILITY', color:'#252a33', src:'img/index_img/mood-bag-ink.png'},
        {name:'STONE CANVAS', color:'#c8c2b8', src:'img/index_img/mood-bag-stone.png'}
      ]
    },
    {
      selector: '.moments-shoes button', no:'03', kicker:'COMFORT / MOVEMENT', title:'Step into Comfort', subtitle:'MADE TO MOVE.',
      desc:'편안한 하루를 위한 경쾌한 한 걸음. 부드러운 뉴트럴 톤에 포인트 컬러를 더한 데일리 스니커즈.',
      notes:'라이트한 컬러 매치 · 편안한 데일리 룩 · 스트리트 무드',
      variants:[
        {name:'SOFT MINT', color:'#90b8b4', src:'img/index_img/mood-shoe-mint.png'},
        {name:'SAND RUNNER', color:'#d8d1c1', src:'img/index_img/mood-shoe-sand.png'},
        {name:'IVORY GREY', color:'#f0ece4', src:'img/index_img/mood-shoe-ivory.png'}
      ]
    },
    {
      selector: '.moments-photo', no:'04', kicker:'ODDAY / STYLE STORY', title:'Daily Mood & Moments', subtitle:'EVERYDAY, EVERY WAY.',
      desc:'평범한 일상에 작은 변화를 주는 유니섹스 스트리트 웨어. 나만의 무드를 만드는 ODDAY의 데일리 스타일링.',
      notes:'자유로운 조합 · 유니섹스 스트리트 웨어 · 나만의 일상',
      variants:[
        {name:'DAILY GIRL', color:'#233452', src:'img/index_img/moment-model1.png'},
        {name:'BOY LOOK', color:'#b5a5d4', src:'img/index_img/lookbook-man-full.webp'},
        {name:'COUPLE EDIT', color:'#eeeae4', src:'img/index_img/lookbook-couple1.png'}
      ]
    }
  ];
  let active = 0, activeVariant = 0, lastFocus = null, closeTimer = null;
  const $panel = $overlay.find('.od-mood-panel');
  const $visual = $('#odMoodImage');
  function swapVisual(src, altText) {
    $visual.stop(true,true).animate({opacity:0},140,function () {
      $(this).attr({src:src, alt:altText || ''}).animate({opacity:1},320);
    });
  }
  function selectPalette(index, silent) {
    const item = moodItems[active];
    const variant = item.variants[index] || item.variants[0];
    activeVariant = index;
    $('#odMoodColors').children().removeClass('is-active').attr('aria-pressed','false').eq(index).addClass('is-active').attr('aria-pressed','true');
    $('#odMoodColorName').text(variant.name);
    $panel[0].style.setProperty('--od-mood-accent', variant.color);
    if (!silent) swapVisual(variant.src, item.title + ' / ' + variant.name);
  }
  function showItem(index) {
    active=(index+moodItems.length)%moodItems.length;
    const item=moodItems[active];
    $('.od-mood-info').removeClass('is-shown');
    $('#odMoodNo, #odMoodCounter').text(item.no+' / 04');
    $('#odMoodKicker').text(item.kicker);
    $('#odMoodTitle').text(item.title);
    $('#odMoodSubtitle').text(item.subtitle);
    $('#odMoodDescription').text(item.desc);
    $('#odMoodNotes').text(item.notes);
    const $colors=$('#odMoodColors').empty();
    item.variants.forEach((variant,i)=>$('<button type="button" class="od-mood-swatch"/>').css('background-color',variant.color).attr({'aria-label':variant.name, 'aria-pressed':'false', 'title':variant.name}).on('click',()=>selectPalette(i,false)).appendTo($colors));
    swapVisual(item.variants[0].src, item.title + ' / ' + item.variants[0].name);
    selectPalette(0, true);
    setTimeout(()=>$('.od-mood-info').addClass('is-shown'),75);
  }
  function openMood(i,trigger) {
    clearTimeout(closeTimer); lastFocus=trigger;
    showItem(i);
    $overlay.addClass('is-open').attr('aria-hidden','false');
    $('body').addClass('od-mood-lock');
    setTimeout(()=>$overlay.find('.od-mood-close').trigger('focus'),220);
  }
  function closeMood() {
    if (!$overlay.hasClass('is-open'))return;
    $overlay.removeClass('is-open').attr('aria-hidden','true');
    $('body').removeClass('od-mood-lock');
    clearTimeout(closeTimer);
    closeTimer=setTimeout(()=>{if(lastFocus)lastFocus.focus();},380);
  }
  moodItems.forEach((item,i)=>$(document).on('click','#section07 '+item.selector,function(e){e.preventDefault();openMood(i,this)}));
  $overlay.on('click','.od-mood-close, .od-mood-shade',closeMood);
  $overlay.on('click','.od-mood-prev',()=>showItem(active-1));
  $overlay.on('click','.od-mood-next',()=>showItem(active+1));
  $(document).on('keydown',function(e){
    if(!$overlay.hasClass('is-open'))return;
    if(e.key==='Escape'){e.preventDefault();closeMood();}
    if(e.key==='ArrowLeft'){e.preventDefault();showItem(active-1);}
    if(e.key==='ArrowRight'){e.preventDefault();showItem(active+1);}
    if(e.key==='Tab'){
      const $focus=$panel.find('button:visible'); const first=$focus[0],last=$focus[$focus.length-1];
      if(!first)return;
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
});

/* Header eyes: pointer-follow jQuery animation, only on header */
$(function(){
  var $eyes=$('#header .od-eye'); if(!$eyes.length)return;
  var disabled=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(disabled)return;
  var targetX=0,targetY=0,currentX=0,currentY=0,running=false;
  function tick(){
    currentX+=(targetX-currentX)*.13;currentY+=(targetY-currentY)*.13;
    $eyes.find('.od-pupil').css('transform','translate('+currentX.toFixed(2)+'px,'+currentY.toFixed(2)+'px)');
    if(Math.abs(targetX-currentX)+Math.abs(targetY-currentY)>.08){requestAnimationFrame(tick)}else{running=false;}
  }
  function setTarget(x,y){targetX=x;targetY=y;if(!running){running=true;requestAnimationFrame(tick)}}
  function trackPoint(clientX,clientY){
    var rect=$eyes[0].getBoundingClientRect();
    var dx=clientX-(rect.left+rect.width/2);
    var dy=clientY-(rect.top+rect.height/2);
    var length=Math.sqrt(dx*dx+dy*dy)||1;
    var scale=Math.min(1,length/130);
    setTarget(dx/length*4.1*scale,dy/length*5.5*scale);
  }
  $(document).on('mousemove.oddayEyes',function(e){trackPoint(e.clientX,e.clientY)});
  // The embedded weather page explicitly relays pointer positions to this header.
  window.addEventListener('message',function(event){
    if(event.source!==document.querySelector('#section03 iframe')?.contentWindow)return;
    var data=event.data;
    if(!data||typeof data!=='object')return;
    if(data.type==='ODDAY_SECTION3_POINTER' && Number.isFinite(data.x) && Number.isFinite(data.y)){
      var frame=document.querySelector('#section03 iframe');
      if(!frame)return;
      var r=frame.getBoundingClientRect();
      trackPoint(r.left+data.x,r.top+data.y);
    }
  });

  // SECTION 03 runs in a same-origin iframe, whose mouse events don't bubble
  // to the parent document. Convert its viewport coordinates to parent coords.
  $('iframe[src*="section3/index.html"]').each(function(){
    var frame=this;
    function bindFrame(){
      try {
        var doc=frame.contentDocument;
        if(!doc)return;
        $(doc).off('mousemove.oddayEyesFrame').on('mousemove.oddayEyesFrame',function(e){
          var box=frame.getBoundingClientRect();
          trackPoint(box.left+e.clientX,box.top+e.clientY);
        });
      }catch(err){ /* Ignore inaccessible frames; normal page tracking remains. */ }
    }
    $(frame).on('load.oddayEyesFrame',bindFrame);
    bindFrame();
  });
  $(document).on('mouseleave.oddayEyes',function(){setTarget(0,0)});
});

/* ODDAY footer TOP navigation */
$(function(){
  const $top=$('.od-top-button');
  function checkTop(){ const $section=$('#section07'); const start=$section.length ? Math.max(0, $section.offset().top - $(window).height() * 0.35) : 950; $top.toggleClass('is-visible', $(window).scrollTop()>=start); }
  $(window).on('scroll.oddayTop',checkTop);
  checkTop();
  $top.on('click',function(){ $('html,body').stop(true).animate({scrollTop:0},700,'swing'); });
});

/* ODDAY 스토리 페이지 통합 JavaScript
 * 기존 네 개의 기능별 JS를 순서대로 병합했습니다.
 * jQuery 및 jQuery UI 로드 후 이 파일을 불러오세요.
 * 헤더/푸터 공통 코드(js/common.js)는 포함하지 않습니다.
 */

/* =========================================================
   1~5단락 메인 인터랙션 | 원본: script.js
   ========================================================= */

/* 수업 목록의 jQuery 메서드 + CSS transition 사용. 외부 효과 플러그인 없음. */
$(document).ready(function () {
    /* 첫 방문 도입: 배경 → 모델 → 제목 → 설명, 수업의 delay/animate 사용 */
    $('.bg-alpine').addClass('hero-opening-background');
    $('.hero-model').css({opacity:0,marginRight:-40}).delay(150).animate({opacity:1,marginRight:0},750);
    $('#hero-title, #hero-word').css({display:'inline-block',position:'relative',opacity:0,top:42});
    $('#hero-title').delay(400).animate({opacity:1,top:0},500);
    $('#hero-word').delay(600).animate({opacity:1,top:0},500);
    $('#hero-kicker, #hero-description, .hero-copy .short-line').css({position:'relative',opacity:0,top:12}).delay(950).animate({opacity:1,top:0},400);

    /* 1단락: 산 → 봄 → 가을 → 산. 카드 도착 뒤 배경이 바뀝니다. */
    let scene = 0;
    let heroBusy = false;
    let heroTimer;
    let cardOrder = 5;
    let sceneTitles = ['ALPINE', 'SLOW', 'CITY'];
    let sceneWords = ['SHIFT', 'MOMENTS', 'WANDER'];
    let sceneKickers = ['ODDAY SPRING', 'ODDAY EVERYDAY', 'ODDAY AUTUMN'];
    let sceneDescriptions = ['따스한 바람이 시작되는 봄의 레이어', '잠시 쉬어가는 순간에도, 나다운 스타일', '익숙한 골목에서 발견하는 새로운 하루'];
    let sceneColors = ['#6c9fbe', '#76916d', '#ad6a43'];
    function changeBackground(next) {
        $('.hero-background').stop(true, true).fadeOut(850);
        $('.hero-background').eq(next).stop(true, true).fadeIn(850);
        $('.hero-copy').stop(true, true).fadeOut(200, function () {
            $('#hero-title').text(sceneTitles[next]);
            $('#hero-word').text(sceneWords[next]).css('color', sceneColors[next]);
            $('#hero-kicker').text(sceneKickers[next]);
            $('#hero-description').text(sceneDescriptions[next]);
            $(this).fadeIn(450);
        });
        scene = next;
        $('#scene-count').text('0' + (scene + 1) + ' / 03');
    }
    function flyCard(next) {
        if (heroBusy || next === scene) { return; }
        heroBusy = true;
        cardOrder = cardOrder + 1;
        let card = $('.polaroid[data-scene="' + next + '"]');
        let targetLeft = 165 + next * 55;
        card.stop(true, false).css({left:-350, bottom:110, opacity:0, 'z-index':cardOrder, 'pointer-events':'none'});
        card.animate({left:targetLeft, bottom:65 + next * 12, opacity:1}, 650, function () {
            // 새 카드가 도착하면 이전 카드는 제자리에서 조용히 흐려집니다.
            $('.polaroid').not(card).stop(true, false).css('pointer-events', 'none').animate({opacity:0}, 1200);
            card.css('pointer-events', 'auto');
            changeBackground(next);
            heroBusy = false;
        });
    }
    function startHero() {
        clearInterval(heroTimer);
        heroTimer = setInterval(function () {
            flyCard((scene + 1) % 3);
        }, 2000);
    }
    // 도입 완료 후 1.5초에 첫 카드 등장. 이후 기존 2초 간격 유지.
    let firstHeroTimer = setTimeout(function () {
        flyCard(1);
        startHero();
    }, 1500);
    $('.polaroid').click(function () {
        clearTimeout(firstHeroTimer);
        flyCard($(this).attr('data-scene') * 1);
        startHero();
    });

    /* 2단락: A = 긴팔 + 반바지 + 신발 / B = 반팔 + 아우터 + 긴바지 + 신발 */
    function showOutfit(group) {
        $('.outfit-item').removeClass('active').attr('aria-pressed', 'false');
        if (group === 'a') {
            $('.item-long, .item-shorts, .item-shoes').addClass('active').attr('aria-pressed', 'true');
            $('#outfit-status').text('LOOK 01 / EASY EVERYDAY');
        } else {
            $('.item-tee, .item-outer, .item-jeans').addClass('active').attr('aria-pressed', 'true');
            $('.item-shoes').addClass('active').attr('aria-pressed', 'true');
            $('#outfit-status').text('LOOK 02 / A LITTLE COLOR');
        }
    }
    $('.outfit-item').click(function () {
        let item = $(this).attr('data-item');
        if (item === 'long' || item === 'shorts') { showOutfit('a'); }
        else if (item === 'shoes') {
            if (Math.floor(Math.random() * 2) === 0) { showOutfit('a'); }
            else { showOutfit('b'); }
        } else { showOutfit('b'); }
    });
    $('#outfit-reset').click(function () {
        $('.outfit-item').removeClass('active').attr('aria-pressed', 'false');
        $('#outfit-status').text('YOUR PICK, YOUR LOOK.');
    });

    /* 3단락: 사진은 고정. 코디 선택 / 원형 디테일 */
    let selectedLook = '';
    // 왼쪽 커플 사진에서는 돋보기 미표시. 오른쪽 상품 이미지만 확대합니다.
    const $right = $('#section3 .stylist-right');
    const $productLens = $('<div class="product-magnifier" aria-hidden="true"></div>').appendTo($right);
    const productZoom = 2.4;

    function hideProductLens() { $productLens.hide(); }

    function moveProductLens(event) {
        const img = event.currentTarget;
        if (!img.complete || !img.naturalWidth || !img.naturalHeight) {
            hideProductLens();
            return;
        }
        const imageRect = img.getBoundingClientRect();
        const rightRect = $right[0].getBoundingClientRect();
        const diameter = $productLens.outerWidth();
        const scale = Math.min(imageRect.width / img.naturalWidth, imageRect.height / img.naturalHeight);
        const drawnW = img.naturalWidth * scale;
        const drawnH = img.naturalHeight * scale;
        const insetX = (imageRect.width - drawnW) / 2;
        const insetY = (imageRect.height - drawnH) / 2;
        // object-fit:contain된 실제 상품 이미지 좌표를 기준으로 확대
        const px = Math.max(0, Math.min(drawnW, event.clientX - imageRect.left - insetX));
        const py = Math.max(0, Math.min(drawnH, event.clientY - imageRect.top - insetY));
        const x = event.clientX - rightRect.left;
        const y = event.clientY - rightRect.top;
        const margin = 8;
        const lensLeft = Math.max(margin, Math.min(x + 26, rightRect.width - diameter - margin));
        const lensTop = Math.max(margin, Math.min(y - diameter / 2, rightRect.height - diameter - margin));
        $productLens.css({
            left: lensLeft + 'px',
            top: lensTop + 'px',
            backgroundImage: 'url(' + JSON.stringify(img.currentSrc || img.src) + ')',
            backgroundSize: (drawnW * productZoom) + 'px ' + (drawnH * productZoom) + 'px',
            backgroundPosition: ((diameter / 2) - px * productZoom) + 'px ' + ((diameter / 2) - py * productZoom) + 'px'
        }).show();
    }

    $('#section3 .look-panel .look-product img')
        .on('mouseenter mousemove', moveProductLens)
        .on('mouseleave', hideProductLens);
    $('#section3 .look-panel').on('mouseleave', hideProductLens);

    $('.look-hotspot').click(function () {
        selectedLook = $(this).attr('data-look');
        hideProductLens();
        $('.stylist-intro').stop(true, true).fadeOut(250);
        $('.look-panel').stop(true, true).hide();
        $('.panel-' + selectedLook).stop(true, true).fadeIn(450);
    });

    /* 4단락: 5개 메뉴를 순환. 가운데 메뉴에 크기·색 강조 */
    let menuCenter = 1;

    let menuHovered = false;
    function arrangeMenus() {
        $('.story-image').removeClass('is-current').attr('aria-hidden', 'true').filter('[data-story-image="' + menuCenter + '"]').addClass('is-current').attr('aria-hidden', 'false');
        $('.story-menu').each(function (index) {
            let position = (index - menuCenter + 5) % 5;
            $(this).removeClass('slot-top slot-center slot-bottom slot-before').attr('tabindex', '-1').attr('aria-hidden', 'true');
            if (position === 4) { $(this).addClass('slot-top').attr('aria-hidden', 'false').attr('tabindex', '0'); }
            if (position === 0) { $(this).addClass('slot-center').attr('aria-hidden', 'false').attr('tabindex', '0'); }
            if (position === 1) { $(this).addClass('slot-bottom').attr('aria-hidden', 'false').attr('tabindex', '0'); }
            if (position === 3) { $(this).addClass('slot-before'); }
        });
    }
    $('.story-menu').attr('role', 'button').on('click keydown', function (event) {
        if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') { return; }
        event.preventDefault();
        menuCenter = Number($(this).attr('data-menu'));
        arrangeMenus();
    });
    arrangeMenus();
    setInterval(function () {
        if (!menuHovered) { menuCenter = (menuCenter + 1) % 5; arrangeMenus(); }
    }, $('body').hasClass('story-page') ? 2000 : 3200);
    $('.menu-carousel').mouseenter(function () { menuHovered = true; }).mouseleave(function () { menuHovered = false; });
    $('.story-menu').focus(function () { menuHovered = true; }).blur(function () { menuHovered = false; });


    /* 5단락: 선택된 사진 바로 오른쪽에 문구. 미선택 사진 위에 연두 오버레이 */
    /* 클래스 교체가 폭을 즉시 바꾸지 않도록 초기 폭을 인라인 값으로 고정 */
    if ($('body').hasClass('story-page')) {
        // 화면 너비와 내부 사진 폭은 CSS 비율로 함께 조정합니다.
        $('.editorial-photo').click(function () {
            $('.editorial-item').removeClass('selected');
            $('.editorial-photo').attr('aria-expanded', 'false');
            $(this).attr('aria-expanded', 'true').parent().addClass('selected');
        });
    } else {
        function editorialWidth(px) {
            return $('body').hasClass('story-page') ? (px / 1920 * 100) + '%' : px;
        }
        $('.editorial-item').each(function (index) {
            if (index === 1) {
                $(this).css('width', editorialWidth(1120)).children('.editorial-photo').css('width', 280);
            } else {
                $(this).css('width', editorialWidth(200)).children('.editorial-photo').css('width', 200);
            }
        });
        $('.editorial-photo').click(function () {
            let item = $(this).parent();
            $('.editorial-item').removeClass('selected').stop(true, false).animate({width:editorialWidth(200)}, 650);
            $('.editorial-photo').attr('aria-expanded', 'false').stop(true, false).animate({width:200}, 650);
            item.addClass('selected').stop(true, false).animate({width:editorialWidth(1120)}, 650);
            $(this).attr('aria-expanded', 'true').stop(true, false).animate({width:280}, 650);
        });
    
    }

    // /* 푸터 영역이 화면 아래에 들어오면 한 번 부드럽게 올라옵니다. */
    // $('#footer').addClass('footer-waiting');
    // function revealFooter() {
    //     if ($(window).scrollTop() + $(window).height() >= $('#footer').offset().top + 100) {
    //         $('#footer').addClass('footer-visible');
    //     }
    // }
    // $(window).on('scroll resize load', revealFooter);
    // $('#footer').on('focusin', function () { $(this).addClass('footer-visible'); });
    // revealFooter();

    // /* 페이지 내부 링크만 부드럽게 이동. 제공된 외부/다른 페이지 링크는 유지 */
    // $('a[href^="#section"]').click(function (event) {
    //     event.preventDefault();
    //     let target = $(this).attr('href');
    //     $('html, body').stop(true, false).animate({scrollTop:$(target).offset().top}, 700);
    // });
});

;

/* =========================================================
   6단락 드래그 착장 | 원본: dress-up(1).js
   ========================================================= */

/* 6단락: 상반신 조합 이미지 + 하반신 교체 + 모자 레이어. */
(function () {
    'use strict';
    const catalog = {
        knit: {group:'top', name:'Lime Knit', description:'라임 컬러로 포인트를 주는 라운드넥 니트.'},
        mtm: {group:'top', name:'Striped Rugby Shirt', description:'버건디와 아이보리의 넓은 스트라이프, 편안한 칼라 셔츠.'},
        pants: {group:'bottom', name:'Cargo Pants', description:'차콜 컬러와 넉넉한 실루엣, 입체적인 포켓 디테일.'},
        skirt: {group:'bottom', name:'Denim Skirt', description:'짙은 데님 컬러와 긴 기장으로 완성하는 캐주얼 스타일.'},
        cap: {group:'hat', name:'Two-Tone Cap', description:'그린 컬러의 크라운과 베이지 챙이 어우러진 투톤 볼캡. 편안한 캐주얼 코디에 포인트를 더해 보세요.'},
        bag: {group:'bag', name:'Navy Bag', description:'어깨에 가볍게 걸치는 네이비 토트백. 긴 스트랩과 ODDAY 로고가 일상 코디를 완성합니다.'},
        watch: {group:'watch', name:'Leather Strap Watch', description:'손목에 감기는 브라운 레더 스트랩과 크림색 다이얼. 캐주얼 룩에 차분한 포인트를 더합니다.'}
    };
    // All anchors use the original 644 x 1686 canvas. Uniform scaling only.
    const canvasSize = {width:644,height:1686};
    // Bottom always renders behind the complete upper body, including hands.
    const slotOrder = {bottom:10,bagBack:15,top:20,bagFront:25,hat:30,watch:40};
    const root = 'img/sub1_img/';
    function asset(file,width,height,x=0,y=0,scale=1,mask) {
        return {src:root+file,source:{width,height},crop:{x:0,y:0,width,height},anchor:{x,y,width:width*scale},mask};
    }
    const upper = {
      base: [asset('woman_top.png',644,1686,0,0,1,'inset(0 0 40% 0)'),
        asset('woman_top_watch_hands.png',1011,1555,45,20,.57),
        asset('woman_top_bag-draft.png',775,2029,98,4,.65),
        asset('woman_top_bag_watch.png',775,2029,98,4,.65)],
      knit: [asset('woman_top_knit.png',816,960,-180,7,1.25),
        asset('woman_top_knit_watch_hands.png',1114,1412,-55,22,.69),
        asset('woman_top_knit_bag-draft.png',1156,1360,-96,8,.734),
        asset('woman_top_knit_bag_watch.png',1156,1360,-96,9,.734)],
      mtm: [asset('woman_top_mtm.png',816,960,-180,7,1.25),
        asset('woman_top_mtm_watch_hands.png',1156,1360,-44,22,.67),
        asset('woman_top_mtm_bag_v35.png',1156,1360,-116,5,.77),
        asset('woman_top_mtm_bag_watch_hands.png',1088,1445,-44,26,.674)]
    };
    // Uniform reduction around the model center and waist; includes bag/watch variants.
    const dressedTopScale = .98;
    ['knit','mtm'].forEach(group=>upper[group].forEach(spec=>{
        spec.anchor.x = 330 + (spec.anchor.x-330)*dressedTopScale;
        spec.anchor.y = 690 + (spec.anchor.y-690)*dressedTopScale - 6;
        spec.anchor.width *= dressedTopScale;
    }));
    // Bag-only upper variants: shift right 5px at the 330px model display width.
    upper.mtm[2].anchor.x += 9.76;
    upper.knit[2].anchor.x += 9.76;
    const lower = {
      base:asset('woman_bottom_repaired.png',775,2030,5.8,-3.6,.8413),
      // The source has empty space above the waistband: overlap beneath the top.
      pants:asset('sub1_6_pants.png',343,943,150,590,1.12),
      skirt:asset('woman_bottom_denim.png',323,846,150.8,663,1.18)
    };
    const hat=asset('sub1_6_wearcap.png',242,173,219,18,.92,'polygon(0 0,100% 0,100% 93%,94% 98%,79% 86%,65% 79%,50% 77%,35% 80%,20% 88%,6% 100%,0 94%)');
    Object.keys(catalog).forEach(id=>catalog[id].thumbnail=root+'sub1_6_'+id+'.png');
    // Watch-only keeps the exact same original body geometry and image.
    const baseWatch={src:root+'watch-curved55.png',source:{width:1816,height:866},
      crop:{x:435,y:146,width:961,height:547},anchor:{x:486.243,y:825.079,width:43.32}};
    // Only the generated wristwatch region is rendered; the original portrait never changes.
    const mtmWatch={src:root+'watch-isolated49.png?v=design73',source:{width:1774,height:887},
      crop:{x:110,y:70,width:1580,height:728.44156},
      anchor:{x:upper.mtm[0].anchor.x+547*1.225-4.091255,y:upper.mtm[0].anchor.y+690*1.225-7.40788,width:46.6796*1.225},rotation:6};
    const knitWatch={...mtmWatch,
      anchor:{x:upper.knit[0].anchor.x+544*1.225-4.091255,y:upper.knit[0].anchor.y+691*1.225-7.40788,width:46.6796*1.225},rotation:7};
    // Render one complete upper image: never splice mismatched neck/shoulder portraits.
    function resolveOutfit(selection){
      const separateWatch=!!selection.watch && !selection.top && !selection.bag;
      const mtmWatchOnly=!!selection.watch && selection.top==='mtm' && !selection.bag;
      const knitWatchOnly=!!selection.watch && selection.top==='knit' && !selection.bag;
      const top=knitWatchOnly?upper.knit[0]:mtmWatchOnly?upper.mtm[0]:separateWatch?upper.base[0]:upper[selection.top||'base'][(selection.bag?2:0)+(selection.watch?1:0)];
      let fittedHat=hat;
      if((selection.top==='mtm' || selection.top==='knit') && selection.bag && !selection.watch){
        fittedHat={...hat,anchor:{...hat.anchor,
          x:hat.anchor.x+hat.anchor.width*.025+5.857,
          y:hat.anchor.y+hat.anchor.width*hat.crop.height/hat.crop.width*.05,
          width:hat.anchor.width*.95}};
      }
      if(selection.top==='mtm' && selection.bag && selection.watch){
        fittedHat={...hat,anchor:{...hat.anchor,x:hat.anchor.x-9.76}};
      }
      return {top,bottom:lower[selection.bottom||'base'],hat:selection.hat?fittedHat:null,
        watch:knitWatchOnly?knitWatch:mtmWatchOnly?mtmWatch:separateWatch?baseWatch:null,bagBack:null,bagFront:null};
    }
    function placement(spec){return {x:spec.anchor.x,y:spec.anchor.y,width:spec.anchor.width,height:spec.anchor.width*spec.crop.height/spec.crop.width};}
    function nextOutfit(current, id) {
        if (!catalog[id]) { return Object.assign({}, current); }
        const next = Object.assign({},current);
        const group=catalog[id].group;
        if(next[group]===id) delete next[group]; else next[group]=id;
        return next;
    }
    function isOverModel(x, y, rect) {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }
    if (typeof module !== 'undefined' && module.exports) { module.exports = {catalog, slotOrder, canvasSize, placement, nextOutfit, isOverModel, resolveOutfit, upper, lower}; }
    if (typeof document === 'undefined') { return; }
    const model = document.getElementById('dress-model');
    if (!model) { return; }
    const layers = model.querySelector('.dress-layers');
    const buttons = Array.from(document.querySelectorAll('[data-dress-item]'));
    const slots = new Map();
    Object.keys(slotOrder).forEach(function(category) {
        let slot = layers.querySelector('[data-dress-slot="'+category+'"]');
        if (!slot) {
            slot = document.createElement('div');
            slot.className = 'dress-slot layer-'+category;
            slot.dataset.dressSlot = category;
            layers.appendChild(slot);
        }
        slot.style.zIndex = String(slotOrder[category]);
        slots.set(category, slot);
    });
    function makeWornImage(spec, label) {
        const part = document.createElement('div');
        const box = placement(spec);
        part.className = 'dress-worn-part';
        part.style.left = box.x/canvasSize.width*100+'%';
        part.style.top = box.y/canvasSize.height*100+'%';
        part.style.width = box.width/canvasSize.width*100+'%';
        part.style.height = box.height/canvasSize.height*100+'%';
        if (spec.mask) { part.style.clipPath = spec.mask; }
        if (spec.rotation) { part.style.transform = 'rotate('+spec.rotation+'deg)'; part.style.transformOrigin='50% 50%'; }
        const image = document.createElement('img');
        image.className = 'dress-worn-image';
        image.src = spec.src;
        image.alt = label || '';
        image.draggable = false;
        image.style.left = -spec.crop.x/spec.crop.width*100+'%';
        image.style.top = -spec.crop.y/spec.crop.height*100+'%';
        image.style.width = spec.source.width/spec.crop.width*100+'%';
        image.style.height = spec.source.height/spec.crop.height*100+'%';
        part.appendChild(image);
        return part;
    }
    function showFitted(selection) {
        const resolved=resolveOutfit(selection);
        slots.forEach((slot,category)=>{
            slot.replaceChildren();
            slot.dataset.itemId=selection[category]||'';
            if(resolved[category])slot.appendChild(makeWornImage(resolved[category],''));
        });
    }
    const status = document.getElementById('dress-status');
    const noteName = document.getElementById('dress-note-name');
    const noteDescription = document.getElementById('dress-note-description');
    // 기본 수첩 문구는 HTML에서 가져옵니다. HTML을 수정하면 바로 반영됩니다.
    const defaultNote = noteDescription.textContent.trim();
    let noteFlipTimer;
    function changeNote(name, description, animate) {
        let note = $('.dress-note');
        clearInterval(noteFlipTimer);
        note.children('.note-turn-page').remove();
        if (animate) {
            // 직전 설명을 담은 종이만 넘기고 스프링 배경은 그대로 둡니다.
            let page = $('<div class="note-turn-page" aria-hidden="true"></div>');
            page.html('<p class="dress-note-label">YOUR PICK / YOUR STORY</p><h3></h3><p class="note-turn-description"></p>');
            page.children('h3').text(noteName.textContent);
            if (!noteName.textContent) { page.children('h3').hide(); }
            page.children('.note-turn-description').text(noteDescription.textContent);
            note.append(page);
            noteFlipTimer = setInterval(function () {
                page.remove();
                clearInterval(noteFlipTimer);
            },550);
        }
        noteName.textContent = name;
        noteDescription.textContent = description;
    }
    function restoreNote(){ changeNote('',defaultNote,false); }
    // Decode prepared combinations before interaction to reduce switching flashes.
    Object.values(upper).flat().concat(Object.values(lower),[hat]).forEach(spec=>{
        if(typeof Image!=='undefined'){const image=new Image();image.src=spec.src;}
    });
    let outfit = {};
    let sparkleTimer;
    function imagePath(id) { return catalog[id].thumbnail; }
    function equip(id) {
        const item = catalog[id];
        if (!item) { return; }
        outfit = nextOutfit(outfit, id);
        showFitted(outfit);

        let selected = Object.values(outfit).includes(id);
        changeNote(selected ? item.name : '', selected ? item.description : defaultNote, true);
        buttons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(Object.values(outfit).includes(button.dataset.dressItem)));
        });
        status.textContent = Object.keys(outfit).length ? '착장 중: '+Object.values(outfit).map(key=>catalog[key].name).join(' · ') : '기본 착장입니다.';

        model.classList.remove('is-snapping');
        void model.offsetWidth;
        model.classList.add('is-snapping');
        clearTimeout(sparkleTimer);
        sparkleTimer = setTimeout(function () { model.classList.remove('is-snapping'); }, 650);
    }
    // 수업 예제의 draggable / droppable 방식. 원본은 두고 복사본을 끕니다.
    let $items = jQuery('[data-dress-item]');
    let $model = jQuery('#dress-model');
    // 클릭으로는 입혀지지 않으며, 모델 위에 드롭했을 때만 equip() 실행
    $items.draggable({
        helper:function () {
            // 본문에 붙이는 드래그 복사본도 축소된 실제 크기를 사용합니다.
            let box = this.getBoundingClientRect();
            let $copy = jQuery(this).clone().css({width:box.width,height:box.height});
            if (jQuery(this).hasClass('dress-item-cap')) {
                $copy.find('img').css({width:90,height:90,left:5.4,top:5.4});
            }
            jQuery(this).draggable('option','cursorAt',{left:box.width/2,top:box.height/2});
            return $copy;
        },
        appendTo:'body',
        containment:'.dress-section',
        cancel:false,
        distance:6,
        zIndex:1000,
        opacity:.85,
        scroll:false,
        start:function () { $items.addClass('is-dragging'); },
        drag:function (event) {
            $model.toggleClass('is-drop-target',isOverModel(event));
        },
        stop:function () {
            $items.removeClass('is-dragging');
            $model.removeClass('is-drop-target');
        }
    });
    function isOverModel(event) {
        let box = model.getBoundingClientRect();
        return event.clientX >= box.left && event.clientX <= box.right &&
            event.clientY >= box.top && event.clientY <= box.bottom;
    }
    $model.droppable({
        accept:'.dress-item',
        tolerance:'pointer',
        over:function () { $model.addClass('is-drop-target'); },
        out:function () { $model.removeClass('is-drop-target'); },
        drop:function (event, ui) {
            if (isOverModel(event)) equip(ui.draggable.attr('data-dress-item'));
            $model.removeClass('is-drop-target');
        }
    });
    restoreNote();
    showFitted(outfit);
})();

;

/* =========================================================
   7단락 추천 상품 | 원본: recommend.js
   ========================================================= */

/* 7단락: 수업에서 배운 jQuery 선택자, each, css, animate, 타이머 사용 */
$(document).ready(function () {
    let $layout = $('#section7 .recommend-layout');
    let $cards = $('#section7 .recommend-card');
    let $tag = $('#section7 .recommend-tag');
    if (!$cards.length) return;

    // 7단락: 제목의 두 줄을 분리해 시간차 등장
    const $section7 = $('#section7');
    const $title7 = $('#recommend-title');
    const reduce7 = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $section7.addClass('od7-enhanced');
    $title7.empty()
        .append($('<span>', { 'class': 'od7-title-line', text: 'YOU MAY' }))
        .append($('<span>', { 'class': 'od7-title-line', text: 'LIKE' }));

    // 상품별 호버 설명. 실제 상품명은 HTML data-tag에서 읽습니다.
    $cards.each(function () {
        const name = ($(this).attr('data-tag') || '#ODDAY').replace(/^#/, '').toUpperCase();
        const $caption = $('<span>', { 'class': 'od7-hover-caption', 'aria-hidden': 'true' });
        $caption.append($('<strong>').text(name));
        $caption.append($('<small>').text('EXPLORE +'));
        $(this).append($caption);
    });

    function checkTitle7() {
        if ($section7.hasClass('od7-title-visible')) return;
        const titleTop = $title7.offset().top;
        if ($(window).scrollTop() + $(window).height() * .84 >= titleTop) {
            $section7.addClass('od7-title-visible');
        }
    }
    $(window).on('scroll.od7Title resize.od7Title pageshow.od7Title', checkTitle7);
    requestAnimationFrame(checkTitle7);
    // 확대된 중앙 상품의 위·아래 테두리가 잘리지 않도록 여유 공간을 둡니다.
    // 가로로 이탈하는 슬라이드만 바깥 래퍼에서 숨깁니다.
    $layout.append('<div class="recommend-viewport"><div class="recommend-track"></div></div>');
    let $track = $('#section7 .recommend-track');
    $cards.appendTo($track);
    $tag.appendTo($track);
    let start = 0;
    let busy = false;
    let hovered = false;
    let detailOpen = false;
    let previouslyFocused = null;
    let count = $cards.length;

    // EXPLORE + : 포트폴리오에서 실제 상품 페이지 대신 보여주는 상품 확대 미리보기.
    // 상품 이미지와 이름은 현재 카드에서 읽고, 없는 가격/판매 정보는 만들지 않습니다.
    const productNotes = {
        'blue-pants':'편안한 실루엣에 감각적인 균형을 더하는 와이드 팬츠.',
        'cap':'평범한 룩에도 색다른 포인트를 더하는 데일리 캡.',
        'hoodie':'가볍고 자유로운 스타일링에 어울리는 데일리 후디.',
        'tote':'어떤 하루에도 자연스럽게 어울리는 심플한 토트백.',
        'denim-shorts':'레트로한 감성과 가벼운 무드를 더하는 데님 쇼츠.',
        'green-jacket':'일상의 레이어링에 산뜻한 변화를 더하는 윈드브레이커.',
        'layered-tee':'한 겹의 차이로 새로운 무드를 만드는 레이어드 티.',
        'beanie':'꾸미지 않은 듯한 스트릿 감성을 살리는 비니.',
        'yellow-jacket':'컬러 하나만으로 룩에 개성을 더하는 집업 재킷.',
        'rugby':'빈티지한 감성을 일상에 녹여내는 럭비 셔츠.'
    };
    const $detail = $(
        '<div class="od7-detail-backdrop" aria-hidden="true">' +
          '<section class="od7-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="od7-detail-title" aria-describedby="od7-detail-copy">' +
            '<button type="button" class="od7-detail-close" aria-label="상품 확대보기 닫기">×</button>' +
            '<div class="od7-detail-picture"><img src="" alt=""></div>' +
            '<div class="od7-detail-info">' +
              '<span class="od7-detail-kicker">ODDAY / YOUR DAILY EDIT</span>' +
              '<span class="od7-detail-number">EXPLORE THE LOOK</span>' +
              '<h3 id="od7-detail-title"></h3>' +
              '<p id="od7-detail-copy"></p>' +
              '<span class="od7-detail-footer">A LITTLE DIFFERENT, EVERY DAY.</span>' +
            '</div>' +
          '</section>' +
        '</div>'
    ).appendTo('body');
    $cards.attr({role:'button',tabindex:'-1'}).attr('aria-label',function(){
        return ($(this).attr('aria-label') || 'ODDAY 상품') + ' 상세 이미지 보기';
    });
    function openDetail($card) {
        if (busy || detailOpen || !$card.hasClass('is-center')) return;
        const $image = $card.find('img').first();
        previouslyFocused = document.activeElement;
        $detail.find('.od7-detail-picture img').attr({src:$image.attr('src'),alt:$image.attr('alt')});
        $detail.find('#od7-detail-title').text(($card.attr('data-tag') || '#ODDAY').replace(/^#/, '').toUpperCase());
        $detail.find('#od7-detail-copy').text(productNotes[$card.attr('data-product')] || '지금의 무드에 맞는 나만의 ODDAY 아이템을 만나보세요.');
        detailOpen = true;
        $('body').addClass('od7-dialog-open');
        $detail.attr('aria-hidden','false').addClass('is-open');
        $detail.find('.od7-detail-close')[0].focus({preventScroll:true});
    }
    function closeDetail() {
        if (!detailOpen) return;
        detailOpen = false;
        $detail.attr('aria-hidden','true').removeClass('is-open');
        $('body').removeClass('od7-dialog-open');
        if (previouslyFocused && document.contains(previouslyFocused)) {
            previouslyFocused.focus({preventScroll:true});
        }
        previouslyFocused = null;
        startOnScroll();
    }
    $cards.on('click.od7Explore',function(){openDetail($(this));});
    $cards.on('keydown.od7Explore',function(event){
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetail($(this));
        }
    });
    $detail.find('.od7-detail-close').on('click',closeDetail);
    $detail.on('click',function(event){if(event.target === this) closeDetail();});
    $(document).on('keydown.od7Explore',function(event){
        if (!detailOpen) return;
        if (event.key === 'Escape') closeDetail();
        else if (event.key === 'Tab') {
            // 팝업이 열려 있을 때 키보드 포커스를 닫기 버튼에 유지합니다.
            event.preventDefault();
            $detail.find('.od7-detail-close').trigger('focus');
        }
    });

    function position(slot) {
        let left = -17.41;
        let width = 13.31;
        let height = 38.21;
        if (slot === 0) left = 0;
        if (slot === 1) left = 17.41;
        if (slot === 2) { left = 34.82; width = 30.35; height = 100; }
        if (slot === 3) left = 69.27;
        if (slot === 4) left = 86.69;
        if (slot === 5) left = 104.1;
        // 각 자리의 중심은 유지하고 상품 박스 폭을 20% 줄입니다.
        left += width * .1;
        width *= .8;
        return {left:left+'%', width:width+'%', height:height+'%'};
    }
    function resize() {
        let width = $layout.width();
        $track.height(width * 310 / 890 * .8);
        $tag.css({left:width * .37855 - 10, fontSize:width * .02375 * .8});
        $('#section7 .recommend-layout h2').css('font-size',width * .0456875);
        $('#section7 .recommend-heart').css('font-size',width * .01375 * .8);
    }
    function settle() {
        $cards.hide().attr({'aria-hidden':'true',tabindex:'-1'}).removeClass('is-center');
        $cards.each(function(index) {
            let slot = (index - start + count) % count;
            if (slot < 5) {
                $(this).css(position(slot)).show().attr('aria-hidden','false');
                if (slot === 2) $(this).addClass('is-center').attr('tabindex','0');
            }
        });
        $tag.text($cards.eq((start+2)%count).attr('data-tag'));
    }
    resize();
    settle();
    $(window).on('resize',resize);
    $layout.mouseenter(function(){hovered=true;});
    $layout.mouseleave(function(){hovered=false;});
    function advance() {
        let scroll = $(window).scrollTop();
        let top = $track.offset().top;
        if (busy || hovered || detailOpen || top + $track.height() <= scroll || top >= scroll + $(window).height()) return;
        busy = true;
        $tag.stop(true,true).fadeOut(120);
        let nextStart = (start - 1 + count) % count;

        // 이동 시작과 동시에 '다음 중앙 상품'을 강조합니다.
        // left/width/height의 1초 이동과 CSS 선명도 전환이 함께 진행됩니다.
        const nextCenter = (start + 1) % count;
        $cards.filter('.is-center').removeClass('is-center').attr('tabindex', '-1');
        $cards.eq(nextCenter).addClass('is-center').attr('tabindex', '0');

        $cards.each(function(index) {
            let slot = (index - start + count) % count;
            if (slot < 5) $(this).animate(position(slot+1),1000,'swing');
        });
        $cards.eq(nextStart).css(position(-1)).show().animate(position(0),1000,'swing',function(){
            start = nextStart;
            settle();
            $tag.fadeIn(180);
            busy = false;
        });
    }
    // 상품 영역이 화면 중간쯤 도착하면 기다리지 않고 첫 이동을 시작합니다.
    let started = false;
    function startOnScroll() {
        if (started || hovered || detailOpen) return;
        let scroll = $(window).scrollTop();
        let top = $track.offset().top;
        if (top <= scroll + $(window).height() * .6 && top + $track.height() > scroll) {
            started = true;
            advance();
            setInterval(advance,2000);
        }
    }
    $(window).on('scroll',startOnScroll);
    $(window).on('resize',startOnScroll);
    $layout.mouseleave(startOnScroll);
    startOnScroll();
});

;

/* =========================================================
   4단락 휴대폰 스타일링 | 원본: phone-styling.js
   ========================================================= */

/* 휴대폰 효과: 수업에서 배운 jQuery animate, css, click, 타이머 사용 */
$(document).ready(function () {
    let $photo = $('.phone-photo');
    let $stage = $('.phone-photo .phone-stage');
    let $slides = $('.phone-photo .phone-screen-slide');
    let $finger = $('.phone-photo .phone-finger');
    let $tap = $('.phone-photo .phone-styling-tap');
    if (!$stage.length) return;

    let fingerLeft = 805 - 650 * .267;
    let fingerTop = 800 - 650 * .136;
    let state = -1;
    let busy = false;

    // 원본 사진 비율을 유지하면서 표시 영역을 채웁니다.
    function resize() {
        let width = $photo.width();
        let height = $photo.height();
        let scale = width / 1536;
        if (height / 1024 > scale) scale = height / 1024;
        $stage.css({
            left: (width - 1536 * scale) / 2,
            top: (height - 1024 * scale) / 2,
            transform: 'scale(' + scale + ')'
        });
    }

    // 맑음(원본) → 비 → 눈 → 맑음, 0.25초 전환.
    function changeScreen() {
        state = (state + 1) % 3;
        $slides.stop(true, false).removeClass('is-active')
            .attr('aria-hidden', 'true').animate({opacity: 0}, 250);
        if (state < 2) {
            $slides.eq(state).stop(true, false).addClass('is-active')
                .attr('aria-hidden', 'false').animate({opacity: 1}, 250);
        }
    }

    function play(manual) {
        if (busy) return;
        let scroll = $(window).scrollTop();
        let top = $photo.offset().top;
        if (!manual && (top + $photo.height() <= scroll || top >= scroll + $(window).height())) return;
        busy = true;
        $finger.css({left: fingerLeft + 260, top: fingerTop + 300, opacity: 0})
            .animate({left: fingerLeft, top: fingerTop, opacity: 1}, 500, function () {
                $tap.addClass('is-tapped');
                changeScreen();
                // 손끝을 살짝 움직여 누르는 동작을 표현합니다.
                $finger.animate({top: fingerTop + 6}, 90)
                    .animate({top: fingerTop}, 90, function () {
                        $tap.removeClass('is-tapped');
                        $finger.animate({left: fingerLeft + 260, top: fingerTop + 300, opacity: 0}, 400, function () {
                            busy = false;
                        });
                    });
            });
    }

    // CSS 전환과 jQuery 전환이 중복 적용되지 않게 합니다.
    $slides.css({transition: 'none', opacity: 0}).attr('aria-hidden', 'true');
    $finger.css({left: fingerLeft, top: fingerTop});
    $tap.click(function () {
        // 자동 손가락 동작 중에도 실제 클릭은 즉시 반영합니다.
        $finger.stop(true, false).css('opacity', 0);
        $tap.removeClass('is-tapped');
        busy = false;
        changeScreen();
        clearInterval(phoneTimer);
        phoneTimer = setInterval(function () { play(false); }, 2300);
    });
    $(window).on('resize', resize);
    resize();
    let phoneTimer = setInterval(function () { play(false); }, 2300);
});


/* 2·3단락 등장 효과: 수업의 scroll / offset / animate / delay / setInterval 사용 */
$(document).ready(function () {
    let heading = $('.outfit-heading').children();
    let title = $('.stylist-intro h2');
    let description = $('.stylist-description').children();
    let photo = $('#section3 .couple');
    let signature = $('#section3 .seoul-caption');
    let section2Started = false;
    let section3Started = false;
    let letters = 0;
    let typingTimer;
    let line1 = 'AI Stylist';
    let line2 = 'For Your';
    let line3 = 'Weather.';
    let titleHeight = title.height();

    heading.css({opacity:0, position:'relative', top:16});
    description.css({opacity:0, position:'relative', top:18});
    photo.css('opacity',0);
    signature.css('opacity',0);
    // 빈 제목도 원래 높이를 유지하여 설명과 주변 레이아웃이 움직이지 않게 합니다.
    title.height(titleHeight).attr('aria-label','AI Stylist For Your Weather.').html('');

    function revealStory() {
        let scroll = $(window).scrollTop();
        let view = $(window).height();
        if (!section2Started && scroll + view * .85 >= $('.outfit-heading').offset().top) {
            section2Started = true;
            heading.each(function (index) {
                $(this).delay(index * 150).animate({opacity:1, top:0},550);
            });
        }
        // 3단락 초입이 화면에 들어오면 더 빠르게 한 번만 재생합니다.
        if (!section3Started && scroll + view * .85 >= $('#section3').offset().top + $('#section3').height() * .12) {
            section3Started = true;
            photo.animate({opacity:1},450);
            typingTimer = setInterval(function () {
                letters = letters + 1;
                title.html(line1.slice(0,letters) + '<br><span>' + line2.slice(0,Math.max(0,letters-line1.length)) + '</span><br>' + line3.slice(0,Math.max(0,letters-line1.length-line2.length)));
                if (letters >= line1.length + line2.length + line3.length) {
                    clearInterval(typingTimer);
                    title.css('height','auto');
                    description.each(function (index) {
                        $(this).delay(index * 90).animate({opacity:1,top:0},400);
                    });
                    signature.delay(180).animate({opacity:1},450);
                }
            },30);
        }
    }
    $(window).scroll(revealStory);
    $(window).on('load resize',revealStory);
    revealStory();
});

/* 4단락 상단: 수업에서 배운 스크롤 감지와 순차 animate */
$(document).ready(function () {
    let message = $('#section4 .stylist-message');
    let label = message.children('.stylist-message-label');
    let lines = message.children('h3').children('.weather-line');
    let copy = message.children('.stylist-message-copy');
    let started = false;
    label.css({opacity:0,position:'relative',top:12});
    lines.css({opacity:0,top:24});
    copy.css({opacity:0,position:'relative',top:16});
    function revealWeather() {
        if (started) { return; }
        if ($(window).scrollTop() + $(window).height() * .8 >= message.offset().top + 80) {
            started = true;
            label.animate({opacity:1,top:0},450);
            lines.each(function (index) {
                $(this).delay(180 + index * 220).animate({opacity:1,top:0},600);
            });
            copy.delay(900).animate({opacity:1,top:0},650);
        }
    }
    $(window).scroll(revealWeather);
    $(window).on('load resize',revealWeather);
    revealWeather();
});

/* 2단락 실루엣: 각 방향에서 짧은 시차로 모이는 등장 효과 */
$(document).ready(function () {
    let stage = $('#section2 .outfit-stage');
    let items = stage.children('.outfit-item');
    let fromX = [-130, -140, -35, 140, 90, 130];
    let fromY = [-70, 55, 110, -35, -100, 90];
    let started = false;
    items.each(function (index) {
        $(this).css({opacity:0,marginLeft:fromX[index],marginTop:fromY[index]});
    });
    function revealOutfits() {
        if (started) { return; }
        if ($(window).scrollTop() + $(window).height() * .85 >= stage.offset().top + 80) {
            started = true;
            items.each(function (index) {
                $(this).delay(index * 85).animate({opacity:1,marginLeft:0,marginTop:0},480);
            });
        }
    }
    $(window).scroll(revealOutfits);
    $(window).on('load resize',revealOutfits);
    revealOutfits();
});

/* 6단락 제목: 본문 → 연두색 배경 → Your 순서 */
$(document).ready(function () {
    let title = $('#section6 h2');
    let background = title.children('mark').children('.dress-your-bg');
    let word = title.children('mark').children('.dress-your-text');
    let started = false;
    title.css('opacity',0);
    background.css('width',0);
    word.width(word.width()).css({display:'inline-block',opacity:0});
    word.html('<span class="dress-your-glyphs">Your</span>');
    let glyphText = word.children('.dress-your-glyphs');
    title.children('mark').attr('aria-label','Your');
    word.attr('aria-hidden','true');
    function revealDressTitle() {
        if (started) { return; }
        if ($(window).scrollTop() + $(window).height() * .8 >= title.offset().top + 80) {
            started = true;
            title.animate({opacity:1},500,function () {
                background.delay(200).animate({width:'100%'},380,function () {
                    // 수업의 setInterval / Math.random / slice로 짧은 글자 섞기 효과
                    let glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    let tick = 0;
                    word.css('opacity',1);
                    let shuffle = setInterval(function () {
                        tick = tick + 1;
                        let a = Math.floor(Math.random() * glyphs.length);
                        let b = Math.floor(Math.random() * glyphs.length);
                        let c = Math.floor(Math.random() * glyphs.length);
                        let d = Math.floor(Math.random() * glyphs.length);
                        glyphText.text(glyphs.slice(a,a+1) + glyphs.slice(b,b+1) + glyphs.slice(c,c+1) + glyphs.slice(d,d+1));
                        // 글자를 자르지 않고 원래 글자 영역 안에 비율대로 맞춥니다.
                        let fit = Math.min(1, word.width() / glyphText.width());
                        glyphText.css('transform','scale(' + fit + ')');
                        if (tick >= 10) {
                            clearInterval(shuffle);
                            glyphText.text('Your').css('transform','none');
                        }
                    },60);
                });
            });
        }
    }
    $(window).scroll(revealDressTitle);
    $(window).on('load resize',revealDressTitle);
    revealDressTitle();
});


/* =========================================================
   4단락 이미지 스크롤 등장: 상단(오른쪽 → 제자리), 하단(왼쪽 → 제자리)
   휴대폰 화면 전환 및 4단락 자동 메뉴 전환에는 영향을 주지 않습니다.
   ========================================================= */
$(function () {
    const $section = $('#section4');
    const $upperPhoto = $section.find('.phone-photo');
    const $lowerPhoto = $section.find('.magazine-placeholder.story-images');
    if (!$section.length || !$upperPhoto.length || !$lowerPhoto.length) return;

    // 해당 사진의 초기 이동 상태를 활성화한 뒤 스크롤 도착 시 각각 복귀
    $section.addClass('od4-photo-reveal-ready');

    function revealPhoto($photo) {
        if ($photo.hasClass('od4-photo-revealed')) return;
        const triggerY = $(window).scrollTop() + $(window).height() * 0.84;
        const photoY = $photo.offset().top + 60;
        if (triggerY >= photoY) {
            $photo.addClass('od4-photo-revealed');
        }
    }

    function checkPhotoReveal() {
        revealPhoto($upperPhoto);
        revealPhoto($lowerPhoto);
    }

    $(window).on('scroll.od4PhotoReveal resize.od4PhotoReveal load.od4PhotoReveal pageshow.od4PhotoReveal', checkPhotoReveal);
    // 진입 시 스타일을 먼저 적용하여 복귀 애니메이션이 보이도록 처리
    requestAnimationFrame(function () {
        requestAnimationFrame(checkPhotoReveal);
    });
});


/* =========================================================
   5단락: 에디토리얼 사진 순차 등장 + 클릭 후 설명 순차 등장
   기존 사진 확장/축소 기능과 충돌하지 않도록 별도 네임스페이스 사용
   ========================================================= */
$(function () {
    const $section = $('#section5');
    const $items = $section.find('.editorial-item');
    if (!$section.length || !$items.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let entered = false;
    let copyRequest = 0;
    let copyTimer = null;

    $section.addClass('od5-enhanced');
    if (!reducedMotion) {
        $items.css({ top: '64px', opacity: 0 });
    }

    function revealSelectedCopy(delay) {
        const request = ++copyRequest;
        clearTimeout(copyTimer);
        $items.removeClass('od5-copy-visible');
        copyTimer = setTimeout(function () {
            if (request !== copyRequest) return;
            $items.filter('.selected').addClass('od5-copy-visible');
        }, reducedMotion ? 0 : delay);
    }

    function checkEditorial() {
        if (entered) return;
        const top = $section.offset().top;
        const bottom = top + $section.outerHeight();
        const scrollTop = $(window).scrollTop();
        // 단락 상단이 화면 높이의 55% 지점까지 들어온 뒤 시작
        const viewBottom = scrollTop + $(window).height() * 0.55;
        if (viewBottom < top || scrollTop >= bottom) return;

        entered = true;
        if (reducedMotion) {
            $items.css({ top: 0, opacity: 1 });
            revealSelectedCopy(0);
            return;
        }
        // 1~5번째 사진이 0.13초 간격으로 아래에서 올라와 정렬
        $items.each(function (index) {
            $(this).delay(index * 130).animate({ top: 0, opacity: 1 }, 690, 'swing');
        });
        revealSelectedCopy(($items.length - 1) * 130 + 450);
    }

    // 원래 등록된 클릭 아코디언의 selected 클래스 변경 이후에 실행됩니다.
    $section.on('click.od5Copy', '.editorial-photo', function () {
        revealSelectedCopy(560);
    });
    $(window).on('scroll.od5Reveal resize.od5Reveal pageshow.od5Reveal', checkEditorial);
    requestAnimationFrame(checkEditorial);
});

/* =========================================================
   3단락: CLICK THE PHOTO 안내 커서
   - 사진 위가 아니어도 3단락에 진입하면 커서 옆에 표시
   - 남/여 모델을 클릭하거나 3단락을 벗어나면 숨김
   - 다른 단락을 다녀온 후 재진입하면 다시 안내
   - 기존 사진 클릭 / 확대경 이벤트에는 영향 없음
   ========================================================= */
$(function () {
    const $section = $('#section3');
    if (!$section.length || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    // 안내 요소가 중복으로 생성되지 않도록 처리
    $('.photo-cursor-hint').remove();
    const $hint = $('<span class="photo-cursor-hint" aria-hidden="true">CLICK THE PHOTO</span>')
        .appendTo('body');

    let pointerX = null;
    let pointerY = null;
    let dismissed = false;
    let wasInSection = false;

    // 스크롤로 3단락이 화면 중앙에 도착했는지 판단 (사진 hover와 무관)
    function isThirdSectionVisible() {
        const rect = $section[0].getBoundingClientRect();
        const guideLine = window.innerHeight * 0.5;
        return rect.top <= guideLine && rect.bottom > guideLine;
    }

    function positionHint() {
        if (pointerX === null || pointerY === null) return;
        const gap = 18;
        const margin = 8;
        const w = $hint.outerWidth();
        const h = $hint.outerHeight();
        const x = Math.max(margin, Math.min(pointerX + gap, window.innerWidth - w - margin));
        const y = Math.max(margin, Math.min(pointerY + gap, window.innerHeight - h - margin));
        $hint.css({left: x + 'px', top: y + 'px'});
    }

    function updateHint() {
        const inSection = isThirdSectionVisible();
        // 3단락을 벗어나면 클릭 여부를 초기화: 다시 진입 시 안내 재표시
        if (!inSection && wasInSection) dismissed = false;
        wasInSection = inSection;
        $hint.toggleClass('is-visible', inSection && !dismissed && pointerX !== null);
    }

    $(document).on('mousemove.od3PhotoHint', function (event) {
        pointerX = event.clientX;
        pointerY = event.clientY;
        positionHint();
        updateHint();
    }).on('mouseleave.od3PhotoHint', function () {
        pointerX = null;
        pointerY = null;
        updateHint();
    });

    // 이미 존재하는 3단락 남/여 사진 클릭 기능은 그대로 사용
    $section.on('click.od3PhotoHint', '.look-hotspot', function () {
        dismissed = true;
        updateHint();
    });

    $(window).on('scroll.od3PhotoHint resize.od3PhotoHint pageshow.od3PhotoHint', function () {
        positionHint();
        updateHint();
    });
    $(window).on('blur.od3PhotoHint', function () {
        pointerX = null;
        pointerY = null;
        updateHint();
    });
    updateHint();
});

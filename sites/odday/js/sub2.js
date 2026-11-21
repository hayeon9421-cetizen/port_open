/* ========================================
   ODDAY : HEADER EYES ANIMATION
======================================== */
(function ($) {
    $(function () {

        // 눈동자 선택
        var $eyes = $(".od-shared-header .odc-od-pupil");

        // 눈동자 이동 좌표
        var tx = 0;
        var ty = 0;
        var x = 0;
        var y = 0;

        // 눈동자 부드럽게 이동
        function draw() {
            x += (tx - x) * 0.18;
            y += (ty - y) * 0.18;

            $eyes.css(
                "transform",
                "translate(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px)"
            );

            requestAnimationFrame(draw);
        }

        // 눈동자 애니메이션 실행
        if (
            $eyes.length &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            draw();
        }

        // 마우스 위치에 따라 눈동자 이동
        $(document).on("mousemove.oddayShared", function (e) {
            var el = $eyes[0];

            if (!el) {
                return;
            }

            var r = el.getBoundingClientRect();

            var dx = e.clientX - (r.left + r.width / 2);
            var dy = e.clientY - (r.top + r.height / 2);
            var len = Math.hypot(dx, dy) || 1;

            tx = (dx / len) * Math.min(4, Math.abs(dx) / 27);
            ty = (dy / len) * Math.min(5, Math.abs(dy) / 27);
        });

        // iframe 내부의 마우스 위치 추적
        $("iframe").on("load.oddayShared", function () {
            var frame = this;

            try {
                $(frame.contentDocument).on("mousemove.oddayShared", function (e) {
                    var r = frame.getBoundingClientRect();

                    $(document).trigger(
                        $.Event("mousemove", {
                            clientX: r.left + e.clientX,
                            clientY: r.top + e.clientY
                        })
                    );
                });
            } catch (err) {
                // 다른 출처의 iframe은 접근할 수 없음
            }
        });

/* ========================================
   SECTION 01 : MAIN VISUAL ANIMATION
======================================== */
$(function () {

    const $main = $("#main_visual");
    const $locker = $main.find(".locker_img");
    const $blue = $main.find(".main_blue_bg");
    const $model = $main.find(".model_img");
    const $deco = $main.find(".deco");
    const $title = $main.find(".main_text h2");

    if (!$main.length || !$locker.length || !$blue.length || !$model.length || !$title.length) return;

    /* ========================================
       1. 라커 이미지 자체만 이동
    ======================================== */
    const lockerAnimation = $locker[0].animate(
        [
            { left: "1500px" },
            { left: "-855px" }
        ],
        {
            duration: 1000,
            fill: "forwards"
        }
    );

    /* ========================================
       2. 하늘색 배경 등장
    ======================================== */
    const blueAnimation = $blue[0].animate(
        [
            { transform: "translateX(-100%)" },
            { transform: "translateX(0)" }
        ],
        {
            duration: 500,
            easing: "ease-out",
            fill: "forwards"
        }
    );

    /* ========================================
       3-1. 모델 등장
    ======================================== */
    const modelAnimation = $model[0].animate(
        [
            { transform: "translateX(-180px) scale(0.72)", opacity: 0 },
            { transform: "translateX(12px) scale(1.04)", opacity: 1 },
            { transform: "translateX(0) scale(1)", opacity: 1 }
        ],
        {
            duration: 1800,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
        }
    );

    /* ========================================
       3-2. 장식 이미지 등장 및 살랑거림
    ======================================== */
    const decoAnimations = [];

    $deco.each(function (index) {

        const animation = this.animate(
            [
                { opacity: 0, transform: "translateY(20px) rotate(-12deg)" },
                { opacity: 1, transform: "translateY(0) rotate(0deg)" }
            ],
            {
                duration: 1000,
                delay: index * 150,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        decoAnimations.push(animation.finished);

        animation.finished.then(() => {

            this.animate(
                [
                    { transform: "translateY(0) rotate(-5deg)" },
                    { transform: "translateY(-8px) rotate(5deg)" },
                    { transform: "translateY(0) rotate(-5deg)" }
                ],
                {
                    duration: 1800 + index * 200,
                    easing: "ease-in-out",
                    iterations: Infinity
                }
            );

        });

    });

    /* ========================================
       4. 모든 등장 애니메이션 종료 후 H2 등장
    ======================================== */
    $title.css("opacity", 0);

    Promise.all([
        lockerAnimation.finished,
        blueAnimation.finished,
        modelAnimation.finished,
        ...decoAnimations
    ]).then(function () {

        const titleFade = $title[0].animate(
            [
                { opacity: 0 },
                { opacity: 1 }
            ],
            {
                duration: 300,
                easing: "ease-out",
                fill: "forwards"
            }
        );

        /* ========================================
           5. H2 좌우 이동 + 회전 반복
        ======================================== */
        titleFade.finished.then(function () {

            $title[0].animate(
                [
                    { transform: "translateX(-30px) rotate(-5deg)" },
                    { transform: "translateX(30px) rotate(5deg)" },
                    { transform: "translateX(-30px) rotate(-5deg)" }
                ],
                {
                    duration: 850,
                    easing: "ease-in-out",
                    iterations: Infinity
                }
            );

        });

    }).catch(function (error) {

        console.error("MAIN VISUAL 애니메이션 오류:", error);

    });

});
/* ========================================
   ODDAY BASIC SECTION
   첫 번째 섹션 스크롤부터 50% → 100% 확대
   강제 고정 및 높이 변경 없음
======================================== */
$(function () {
    const $basic = $("#basic");
    const $objects = $("#basic .basic_objects img");

    if (!$basic.length || !$objects.length) return;

    let ticking = false;
    let startY = 0;
    let animationDistance = 0;

    // 기존 회전은 유지하고 크기만 50%로 설정
    $objects.each(function () {
        this.style.opacity = "1";
        this.style.scale = "0.5";
        this.style.transformOrigin = "center center";
        this.style.transition = "none";
    });

    function measureSection() {
        startY = 0;
        animationDistance = window.innerHeight * 1.2;
    }

    function updateBasicAnimation() {
        const scrollY = window.scrollY;

        let progress = (scrollY - startY) / animationDistance;
        progress = Math.max(0, Math.min(1, progress));

        // 부드러운 확대
        const eased = progress * progress * (3 - 2 * progress);

        $objects.each(function () {
            const scale = eased;

            this.style.scale = scale;
            this.style.opacity = "1";
        });

        ticking = false;
    }

    function requestUpdate() {
        if (ticking) return;

        ticking = true;
        requestAnimationFrame(updateBasicAnimation);
    }

    $(window).off(".basicSection");

    $(window).on("scroll.basicSection", requestUpdate);

    $(window).on("resize.basicSection", function () {
        measureSection();
        requestUpdate();
    });

    $(window).on("load.basicSection pageshow.basicSection", function () {
        measureSection();
        requestUpdate();
    });

    measureSection();
    updateBasicAnimation();
});

/* ========================================
   SECTION 03 : FEEL THE TEXTURE
   원단 슬라이더 + 원형 확대경 + TOUCH! 커서
======================================== */
$(function () {
    const $texture = $("#texture");
    const $viewport = $texture.find(".fabric_viewport");
    const $track = $texture.find(".fabric_line");
    const $items = $texture.find(".fabric_item");
    const $prev = $texture.find(".texture_prev");
    const $next = $texture.find(".texture_next");
    const $current = $texture.find(".texture_current");
    const $total = $texture.find(".texture_total");
    const $progress = $texture.find(".texture_slider_line span");

    if (!$texture.length || !$viewport.length || !$track.length || !$items.length) return;

    /* TOUCH! 커서 생성 */
    $(".texture_touch_cursor").remove();

    const $touchCursor = $('<span class="texture_touch_cursor">TOUCH!</span>');
    $("body").append($touchCursor);

    /* 원단에 마우스를 올리면 TOUCH! 표시 */
    $items.on("mouseenter.textureTouch", function (event) {
        $touchCursor.addClass("is-visible");

        $touchCursor.css({
            left: event.clientX + "px",
            top: event.clientY + "px"
        });
    });

    /* TOUCH!가 마우스를 따라다니도록 설정 */
    $items.on("mousemove.textureTouch", function (event) {
        $touchCursor.css({
            left: event.clientX + "px",
            top: event.clientY + "px"
        });
    });

    /* 원단에서 마우스가 벗어나면 TOUCH! 숨기기 */
    $items.on("mouseleave.textureTouch", function () {
        $touchCursor.removeClass("is-visible");
    });

    /* 확대경 설정 */
    const lensSize = 260;
    let currentIndex = 0;
    let maxIndex = 0;

    $total.text(String($items.length).padStart(2, "0"));

    $items.each(function () {
        const $item = $(this);
        const $img = $item.find("> img");

        if (!$img.length) return;

        let $lens = $item.find(".fabric_zoom_lens");

        if (!$lens.length) {
            $lens = $('<div class="fabric_zoom_lens"></div>');
            $item.append($lens);
        }

        $lens.css({
            width: lensSize + "px",
            height: lensSize + "px",
            backgroundImage: 'url("' + $img.attr("src") + '")',
            backgroundSize: "350% 350%",
            backgroundPosition: "50% 50%"
        });

        $item.off(".textureZoom");

        /* 클릭하면 확대경 실행 */
        $item.on("click.textureZoom", function (event) {
            event.stopPropagation();

            const wasActive = $item.hasClass("zoom_active");

            $items.removeClass("zoom_active");
            $items.find(".fabric_zoom_lens").hide();

            if (wasActive) return;

            $item.addClass("zoom_active");
            $lens.show();

            moveLens(event, this, $lens);
        });

        /* 확대경을 마우스 위치에 맞춰 이동 */
        $item.on("mousemove.textureZoom", function (event) {
            if (!$item.hasClass("zoom_active")) return;

            moveLens(event, this, $lens);
        });
    });

    /* 확대경 위치 계산 */
    function moveLens(event, item, $lens) {
        const img = $(item).find("> img")[0];

        if (!img) return;

        const itemRect = item.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        let x = event.clientX - itemRect.left;
        let y = event.clientY - itemRect.top;

        x = Math.max(lensSize / 2, Math.min(itemRect.width - lensSize / 2, x));
        y = Math.max(lensSize / 2, Math.min(itemRect.height - lensSize / 2, y));

        $lens.css({
            left: x + "px",
            top: y + "px"
        });

        let imageX = (event.clientX - imgRect.left) / imgRect.width;
        let imageY = (event.clientY - imgRect.top) / imgRect.height;

        imageX = Math.max(0, Math.min(1, imageX));
        imageY = Math.max(0, Math.min(1, imageY));

        $lens.css({
            backgroundPosition: (imageX * 100) + "% " + (imageY * 100) + "%"
        });
    }

    /* 슬라이더 이동 범위 계산 */
    function calculateSlider() {
        const firstItem = $items[0];

        if (!firstItem) return;

        const itemWidth = firstItem.getBoundingClientRect().width;
        const style = window.getComputedStyle($track[0]);
        const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0;
        const viewportWidth = $viewport[0].clientWidth;

        const visibleCount = Math.max(
            1,
            Math.floor((viewportWidth + gap) / (itemWidth + gap))
        );

        maxIndex = Math.max(0, $items.length - visibleCount);
        currentIndex = Math.min(currentIndex, maxIndex);

        updateSlider();
    }

    /* 슬라이더 위치와 진행률 업데이트 */
    function updateSlider() {
        const firstItem = $items[0];

        if (!firstItem) return;

        const itemWidth = firstItem.getBoundingClientRect().width;
        const style = window.getComputedStyle($track[0]);
        const gap = parseFloat(style.columnGap) || parseFloat(style.gap) || 0;
        const moveX = currentIndex * (itemWidth + gap);

        $track.css("transform", "translateX(-" + moveX + "px)");

        $current.text(String(currentIndex + 1).padStart(2, "0"));

        const progress = ((currentIndex + 1) / $items.length) * 100;

        $progress.css("width", progress + "%");

        $prev.toggleClass("is_disabled", currentIndex === 0);
        $next.toggleClass("is_disabled", currentIndex >= maxIndex);
    }

    /* 확대경 닫기 */
    function closeZoom() {
        $items.removeClass("zoom_active");
        $items.find(".fabric_zoom_lens").hide();
    }

    /* 이전 원단 */
    $prev.off("click.textureSlider").on("click.textureSlider", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (currentIndex <= 0) return;

        currentIndex--;

        closeZoom();
        updateSlider();
    });

    /* 다음 원단 */
    $next.off("click.textureSlider").on("click.textureSlider", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (currentIndex >= maxIndex) return;

        currentIndex++;

        closeZoom();
        updateSlider();
    });

    /* 원단 바깥을 클릭하면 확대경 닫기 */
    $(document).off("click.textureZoomClose").on("click.textureZoomClose", function (event) {
        if (!$(event.target).closest("#texture .fabric_item").length) {
            closeZoom();
        }
    });

    /* ESC 키로 확대경 닫기 */
    $(document).off("keydown.textureZoomClose").on("keydown.textureZoomClose", function (event) {
        if (event.key === "Escape") {
            closeZoom();
        }
    });

    /* 섹션 활성화 여부 확인 */
    function updateTextureVisibility() {
        const textureTop = $texture[0].getBoundingClientRect().top;
        const textureHeight = $texture[0].offsetHeight;
        // 2단락의 고정 연출이 끝난 뒤에만 3단락 버튼 표시
        const basic = document.getElementById("basic");
        const basicFinished = !basic || basic.getBoundingClientRect().bottom <= 0;
        const isArrived = basicFinished && textureTop <= 0 && textureTop + textureHeight > 0;

        $texture.toggleClass("texture_active", isArrived);
    }

    /* 스크롤 및 창 크기 변경 */
    $(window).off(".textureSection");

    $(window).on("scroll.textureSection", updateTextureVisibility);

    $(window).on("resize.textureSection", function () {
        calculateSlider();
        updateTextureVisibility();
    });

    /* 최초 실행 */
    calculateSlider();
    updateTextureVisibility();
});

/* ========================================
   SECTION 04 : MODEL LOOKBOOK

   1. 새로고침하면 모델 1번 기본 이미지
   2. 왼쪽 버튼으로 모델 2~8번 변경
   3. 모델 이미지 클릭 시 _1 이미지로 변경
   4. 옷 이미지 2개 동시에 표시
   5. 다른 모델 선택 시 옷 이미지 숨김
   6. 모델 이미지에 마우스를 올리면 안내 문구 표시
======================================== */

$(function () {

    const $section = $("#model_lookbook");

    if (!$section.length) return;

    const $modelImg = $section.find(".model_main_img");
    const $navButtons = $section.find(".look_nav");
    const $jacket = $section.find(".outfit_jacket");
    const $inner = $section.find(".outfit_inner");
    const $outfits = $section.find(".outfit_item");
    const $cursorText = $section.find(".lookbook_cursor");
    const $modelMain = $section.find(".model_main");

    /* 모델 및 의상 이미지 경로 */
    const looks = [
        {
            model: "img/sub2_img/lookbook_model01.png",
            modelOpen: "",
            jacket: "",
            inner: ""
        },
        {
            model: "img/sub2_img/lookbook_model02.png",
            modelOpen: "img/sub2_img/lookbook_model02_1.png",
            jacket: "img/sub2_img/lookbook02_1.png",
            inner: "img/sub2_img/lookbook02_2.png"
        },
        {
            model: "img/sub2_img/lookbook_model03.png",
            modelOpen: "img/sub2_img/lookbook_model03_1.png",
            jacket: "img/sub2_img/lookbook03_1.png",
            inner: "img/sub2_img/lookbook03_2.png"
        },
        {
            model: "img/sub2_img/lookbook_model04.png",
            modelOpen: "img/sub2_img/lookbook_model04_1.png",
            jacket: "img/sub2_img/lookbook04_1.png",
            inner: "img/sub2_img/lookbook04_2.png"
        },
        {
            model: "img/sub2_img/lookbook_model05.png",
            modelOpen: "img/sub2_img/lookbook_model05_1.png",
            jacket: "img/sub2_img/lookbook05_1.png",
            inner: "img/sub2_img/lookbook05_2.png"
        },
        {
            model: "img/sub2_img/lookbook_model06.png",
            modelOpen: "img/sub2_img/lookbook_model06_1.png",
            jacket: "img/sub2_img/lookbook06_1.png",
            inner: "img/sub2_img/lookbook06_2.png"
        },
        {
            model: "img/sub2_img/lookbook_model07.png",
            modelOpen: "img/sub2_img/lookbook_model07_1.png",
            jacket: "img/sub2_img/lookbook07_1.png",
            inner: "img/sub2_img/lookbook07_2.png"
        },
        {
            model: "img/sub2_img/lookbook_model08.png",
            modelOpen: "img/sub2_img/lookbook_model08_1.png",
            jacket: "img/sub2_img/lookbook08_1.png",
            inner: "img/sub2_img/lookbook08_2.png"
        }
    ];

    let currentLook = 0;
    let isOpen = false;
    let lookTimer = null;

    /* 의상 이미지 숨기기 */
    function hideOutfits() {
        $outfits.removeClass("show");
    }

    /* 마우스 안내 문구 숨기기 */
    function hideCursorText() {
        $cursorText.removeClass("active");
    }

    /* 모델 이미지 변경 */
    function changeLook(index) {

        if (!looks[index]) return;

        clearTimeout(lookTimer);
        currentLook = index;
        isOpen = false;

        /* 의상 및 안내 문구 숨김 */
        hideOutfits();
        hideCursorText();

        /* 왼쪽 버튼 활성화 */
        $navButtons.removeClass("active");
        $navButtons.filter('[data-look="' + index + '"]').addClass("active");

        /* 모델 이미지 전환 */
        $modelImg.stop(true, true).css("opacity", 0);

        lookTimer = setTimeout(function () {

            $modelImg.attr({
                src: looks[index].model,
                alt: "ODDAY 모델 " + (index + 1)
            });

            /* 모델 1에는 의상 이미지 없음 */
            if (index === 0) {

                $jacket.find("img").attr("src", "");
                $inner.find("img").attr("src", "");

            } else {

                $jacket.find("img").attr({
                    src: looks[index].jacket,
                    alt: "모델 " + (index + 1) + " 의상 1"
                });

                $inner.find("img").attr({
                    src: looks[index].inner,
                    alt: "모델 " + (index + 1) + " 의상 2"
                });

            }

            $modelImg.css("opacity", 1);

        }, 180);
    }

    /* 모델 이미지에 마우스를 올렸을 때 */
    $modelImg.off(".lookbookCursor").on("mouseenter.lookbookCursor", function () {

        if (currentLook === 0 || isOpen) return;

        $cursorText.addClass("active");

    });

    /* 마우스 움직임에 따라 안내 문구 이동 */
    $modelImg.on("mousemove.lookbookCursor", function (event) {

        if (currentLook === 0 || isOpen) return;

        const offset = $modelMain.offset();

        const mouseX = event.pageX - offset.left;
        const mouseY = event.pageY - offset.top;

        $cursorText.css({
            left: mouseX + "px",
            top: mouseY + "px"
        });

    });

    /* 모델 이미지에서 마우스가 벗어나면 숨김 */
    $modelImg.on("mouseleave.lookbookCursor", function () {

        hideCursorText();

    });

    /* 모델 이미지 클릭 */
    $modelImg.off("click.lookbook").on("click.lookbook", function () {

        /* 모델 1은 클릭해도 변화 없음 */
        if (currentLook === 0) return;

        /* 이미 열려 있다면 중복 실행 방지 */
        if (isOpen) return;

        const selectedLook = looks[currentLook];

        /* 의상 이미지 경로 확인 */
        if (!selectedLook.jacket || !selectedLook.inner) return;

        clearTimeout(lookTimer);
        isOpen = true;

        /* 클릭하면 안내 문구 숨김 */
        hideCursorText();

        /* 모델 이미지를 _1 이미지로 변경 */
        if (selectedLook.modelOpen) {

            $modelImg.stop(true, true).css("opacity", 0);

            lookTimer = setTimeout(function () {

                $modelImg.attr({
                    src: selectedLook.modelOpen,
                    alt: "ODDAY 모델 " + (currentLook + 1) + " 의상 상세 컷"
                });

                $modelImg.css("opacity", 1);

            }, 180);
        }

        /* 전환 도중 클릭해도 현재 모델의 의상을 표시 */
        $jacket.find("img").attr("src", selectedLook.jacket);
        $inner.find("img").attr("src", selectedLook.inner);

        /* 옷 이미지 2개 동시에 표시 */
        $jacket.addClass("show");
        $inner.addClass("show");

    });

    /* 왼쪽 모델 버튼 클릭 */
    $navButtons.off("click.lookbook").on("click.lookbook", function () {

        const index = Number($(this).attr("data-look"));

        changeLook(index);

    });

    /* 옷 클릭 시 별도 페이지나 팝업 실행 안 함 */
    $outfits.off("click.lookbook").on("click.lookbook", function (event) {

        event.preventDefault();
        event.stopPropagation();

    });

    /* 처음에는 모델 1번 기본 이미지 */
    changeLook(0);

});

/* ========================================
   SECTION 05 : SUBWAY ANIMATION
======================================== */
$(function () {
    const $subway = $("#subway");

    // 기차 이미지
    const $train = $subway.find(".train");
    const $inside = $subway.find(".train_inside");

    // 양쪽 문
    const $leftDoor = $subway.find(".train_left_door");
    const $rightDoor = $subway.find(".train_right_door");

    // 전광판
    const $white = $subway.find(".subway_display_white");
    const $display = $subway.find(".subway_display");
    const $images = $subway.find(".subway_display_track img");

    // 기차와 함께 움직일 요소
    const $movingParts = $train
        .add($inside)
        .add($leftDoor)
        .add($rightDoor)
        .add($white)
        .add($display);

    let animationTimer = null;

    // 타이머 정리
    function clearAnimationTimer() {
        clearTimeout(animationTimer);
        animationTimer = null;
    }

    // 초기 상태
    function resetSubway() {
        clearAnimationTimer();

        // 모든 요소를 오른쪽 바깥으로 배치
        $movingParts.css({
            transition: "none",
            transform: "translateX(1920px)"
        });

        // 양쪽 문 초기화
        $leftDoor.css({
            transition: "none",
            transform: "translateX(1920px)"
        });

        $rightDoor.css({
            transition: "none",
            transform: "translateX(1920px)"
        });

        // 흰색 전광판 배경 유지
        $white.css({
            opacity: 1
        });

        // 모든 전광판 이미지 숨기기
        $images.css({
            opacity: 0,
            transition: "none"
        });

        // 기차가 들어올 때 1번 이미지부터 표시
        $images.eq(0).css({
            opacity: 1
        });
    }

    // 기차와 전광판 함께 이동
    function moveTrain(position, duration, callback) {
        $movingParts.css({
            transition: "transform " + duration + "s ease",
            transform: "translateX(" + position + "px)"
        });

        animationTimer = setTimeout(function () {
            animationTimer = null;

            if (callback) {
                callback();
            }
        }, duration * 1000);
    }

    // 문 열기
    function openDoors() {
        $leftDoor.css({
            transition: "transform .7s ease",
            transform: "translateX(-15%)"
        });

        $rightDoor.css({
            transition: "transform .7s ease",
            transform: "translateX(15%)"
        });

        // 문이 열린 후 2번 이미지부터 재생
        animationTimer = setTimeout(function () {
            animationTimer = null;
            playDisplay();
        }, 750);
    }

    // 전광판 이미지 순서대로 표시
    function playDisplay() {
        // 1번 이미지는 진입할 때 이미 표시했으므로 2번부터 시작
        let index = 1;

        function showNextImage() {

            // 5번 이미지까지 표시 완료
            if (index >= $images.length) {

                // 다른 이미지는 숨기기
                $images.css({
                    opacity: 0
                });

                // 마지막 8번 이미지는 계속 표시
                $images.eq(7).css({
                    opacity: 1,
                    transition: "opacity .2s ease"
                });

                // 8번 이미지를 유지한 채 잠시 대기 후 문 닫기
                animationTimer = setTimeout(function () {
                    animationTimer = null;
                    closeDoors();
                }, 1000);

                return;
            }

            // 현재 표시할 이미지
            const $currentImage = $images.eq(index);

            // 이전 이미지 숨기기
            $images.css({
                opacity: 0
            });

            // 다음 이미지 표시
            $currentImage.css({
                transition: "opacity .5s ease",
                opacity: 1
            });

            // 일정 시간 표시한 뒤 다음 이미지로 변경
            animationTimer = setTimeout(function () {
                animationTimer = null;

                index++;
                showNextImage();

            }, 800);
        }

        showNextImage();
    }

    // 문 닫기
    function closeDoors() {
        $leftDoor.css({
            transition: "transform .7s ease",
            transform: "translateX(0)"
        });

        $rightDoor.css({
            transition: "transform .7s ease",
            transform: "translateX(0)"
        });

        // 문이 완전히 닫힌 뒤 왼쪽으로 출발
        // 마지막 5번 이미지는 그대로 유지
        animationTimer = setTimeout(function () {
            animationTimer = null;

            moveTrain(-1920, 1.8, function () {

                // 기차가 화면 밖으로 나간 뒤 다시 시작
                animationTimer = setTimeout(function () {
                    animationTimer = null;
                    startSubway();
                }, 300);

            });
        }, 750);
    }

    // 전체 애니메이션 시작
    function startSubway() {
        resetSubway();

        // 초기 위치 적용 후 기차 진입
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {

                // 오른쪽에서 중앙으로 이동
                moveTrain(0, 1.8, function () {

                    // 중앙 정차 후 잠시 대기
                    animationTimer = setTimeout(function () {
                        animationTimer = null;
                        openDoors();
                    }, 400);

                });

            });
        });
    }

    // 애니메이션 실행
    startSubway();
});

/* ========================================
   SECTION 06 : YOUR DAY, YOUR WAY
   재킷 선택 + 크기 및 불투명도 변경
======================================== */

$(function () {

    const $jacketItems = $("#your_day .jacket_item");
    const $mainImage = $("#your_day .jacket_main_img");

    const jacketImages = {
        1: "img/sub2_img/jacket01_closer.png",
        2: "img/sub2_img/jacket02_closer.png",
        3: "img/sub2_img/jacket03_closer.png"
    };

    const jacketAlts = {
        1: "레드 재킷 디테일",
        2: "그린 재킷 디테일",
        3: "아이보리 재킷 디테일"
    };

    $jacketItems.off("click.yourday").on("click.yourday", function () {

        const $selected = $(this);
        const jacketNumber = $selected.data("jacket");
        const newImage = jacketImages[jacketNumber];

        if (!newImage) return;

        // 선택한 재킷만 확대하고 나머지는 축소 및 투명도 감소
        $jacketItems.removeClass("active");
        $selected.addClass("active");

        // 이미 같은 이미지라면 큰 이미지 변경은 생략
        if ($mainImage.attr("src") === newImage) return;

        // 왼쪽 큰 재킷 이미지 전환
        $mainImage.stop(true, true).animate(
            { opacity: 0 },
            180,
            function () {
                $mainImage.attr("src", newImage);
                $mainImage.attr("alt", jacketAlts[jacketNumber]);
                $mainImage.animate({ opacity: 1 }, 300);
            }
        );

    });

});

/* ========================================
   SECTION 07 : GANZZI
   1. 스크롤 시 G → A → N → Z → Z → I 순서로 등장
   2. 모델에 마우스를 올리면 사진 확대
   3. 모델을 벗어나면 사진 원상 복귀
======================================== */

$(function () {

    const $ganzzi = $("#ganzzi");
    const $inner = $ganzzi.find(".ganzzi_inner");
    const $layer = $ganzzi.find(".ganzzi_hover_layer");

    if (!$ganzzi.length) return;

    let activeModel = null;
    let hideTimer = null;

    /* 스크롤 시 글자 애니메이션 */
    const ganzziObserver = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                $ganzzi.addClass("is-visible");
            } else {
                $ganzzi.removeClass("is-visible");
            }

        });

    }, {
        threshold: 0.25
    });

    ganzziObserver.observe($ganzzi[0]);

    /* 모델 확대 이미지 표시 */
    function showHoverImage(model) {

        clearTimeout(hideTimer);

        if (activeModel === model) return;

        $("#ganzzi .ganzzi_model img").css("visibility", "");

        activeModel = model;
        $layer.empty();

        const $source = $(model).find("img").first();

        if (!$source.length) return;

        const innerRect = $inner[0].getBoundingClientRect();
        const imageRect = $source[0].getBoundingClientRect();

        const $hoverImage = $("<img>", {
            src: $source.attr("src"),
            alt: "",
            "aria-hidden": "true",
            class: "ganzzi_hover_image"
        });

        $hoverImage.css({
            left: imageRect.left - innerRect.left,
            top: imageRect.top - innerRect.top,
            width: imageRect.width,
            height: imageRect.height
        });

        $layer.append($hoverImage);

        $source.css("visibility", "hidden");

        requestAnimationFrame(function () {
            $hoverImage.addClass("is-active");
        });

    }

    /* 모델 확대 이미지 숨기기 */
    function hideHoverImage() {

        clearTimeout(hideTimer);

        const $currentImage = $layer.find(".ganzzi_hover_image");

        $("#ganzzi .ganzzi_model img").css("visibility", "");

        activeModel = null;

        if (!$currentImage.length) {
            $layer.empty();
            return;
        }

        $currentImage.removeClass("is-active");

        hideTimer = setTimeout(function () {
            $layer.empty();
        }, 500);

    }

    /* 모델에 마우스를 올리면 확대 */
    $ganzzi.on("pointerover", ".ganzzi_model", function (event) {

        if (event.relatedTarget && this.contains(event.relatedTarget)) {
            return;
        }

        $ganzzi.find(".ganzzi_model").removeClass("is-hover");

        $(this).addClass("is-hover");

        showHoverImage(this);

    });

    /* 모델 영역에서 마우스가 벗어나면 원상 복귀 */
    $ganzzi.on("pointerout", ".ganzzi_models", function (event) {

        if (event.relatedTarget && this.contains(event.relatedTarget)) {
            return;
        }

        $ganzzi.find(".ganzzi_model").removeClass("is-hover");

        hideHoverImage();

    });

});

/* ========================================
           ODDAY : TOP BUTTON
        ======================================== */

        // 맨 위로 이동 버튼
        var $top = $(".od-shared-top");

        // 스크롤 위치에 따라 버튼 표시
        function updateTop() {
            $top.toggleClass(
                "is-visible",
                $(window).scrollTop() > 350
            );
        }

        // 스크롤 이벤트
        $(window).on("scroll.oddayShared", updateTop);

        // 페이지 로드 시 버튼 상태 확인
        updateTop();

        // 버튼 클릭 시 페이지 최상단으로 이동
        $top.on("click", function () {
            $("html, body")
                .stop(true)
                .animate({
                    scrollTop: 0
                }, 650);
        });

    });
})(jQuery);
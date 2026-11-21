/*
 * ODDAY | TOP motion shared by index, sub1, sub2.
 * A short pause, then a smooth accelerating scroll to the top.
 * Add this script at the end of <body>, AFTER each page's existing scripts.
 * This intentionally handles TOP clicks in the capture phase so the
 * existing page-specific TOP click handlers cannot make it jump prematurely.
 */
(function () {
    'use strict';

    const PAUSE_MS = 170;       // 클릭한 직후의 짧은 텀
    const DURATION_MS = 1060;   // 위로 쭉 올라가는 구간
    let pauseTimer = null;
    let animationFrame = null;
    let isAnimating = false;
    let savedStyles = null;

    function temporarilyDisableCssSmooth() {
        if (savedStyles) return;
        savedStyles = [document.documentElement, document.body].map(function (element) {
            return {
                element: element,
                value: element.style.getPropertyValue('scroll-behavior'),
                priority: element.style.getPropertyPriority('scroll-behavior')
            };
        });
        savedStyles.forEach(function (item) {
            item.element.style.setProperty('scroll-behavior', 'auto', 'important');
        });
    }

    function restoreCssSmooth() {
        if (!savedStyles) return;
        savedStyles.forEach(function (item) {
            if (item.value) {
                item.element.style.setProperty('scroll-behavior', item.value, item.priority);
            } else {
                item.element.style.removeProperty('scroll-behavior');
            }
        });
        savedStyles = null;
    }

    function cancelScrollAnimation() {
        if (pauseTimer !== null) {
            clearTimeout(pauseTimer);
            pauseTimer = null;
        }
        if (animationFrame !== null) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        isAnimating = false;
        restoreCssSmooth();
    }

    function scrollInstantly(top) {
        // CSS scroll-behavior: smooth could otherwise modify every frame.
        window.scrollTo(0, top);
    }

    function scrollToTopWithMotion() {
        cancelScrollAnimation();
        const startTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        if (startTop <= 0) return;

        // Accessibility: no delayed scrolling when reduced motion is requested.
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            temporarilyDisableCssSmooth();
            scrollInstantly(0);
            restoreCssSmooth();
            return;
        }

        isAnimating = true;
        temporarilyDisableCssSmooth();
        pauseTimer = window.setTimeout(function () {
            pauseTimer = null;
            let startTime = null;

            function step(timestamp) {
                if (startTime === null) startTime = timestamp;
                const t = Math.min(1, (timestamp - startTime) / DURATION_MS);
                // Slow start -> accelerating rise -> gentle landing.
                const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                scrollInstantly(Math.round(startTop * (1 - eased)));

                if (t < 1) {
                    animationFrame = requestAnimationFrame(step);
                } else {
                    animationFrame = null;
                    scrollInstantly(0);
                    isAnimating = false;
                    restoreCssSmooth();
                }
            }
            animationFrame = requestAnimationFrame(step);
        }, PAUSE_MS);
    }

    // The original index/common/sub2 scripts can keep controlling visibility;
    // only the click's scroll-motion is overridden here.
    document.addEventListener('click', function (event) {
        const target = event.target;
        const button = target instanceof Element ? target.closest('button.od-top-button, button.od-shared-top') : null;
        if (!button) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        scrollToTopWithMotion();
    }, true);

    // Stop the animation if the user intentionally wheels/touches/presses navigation keys.
    window.addEventListener('wheel', function () { if (isAnimating) cancelScrollAnimation(); }, {passive: true});
    window.addEventListener('touchstart', function () { if (isAnimating) cancelScrollAnimation(); }, {passive: true});
    window.addEventListener('keydown', function (event) {
        if (isAnimating && ['PageDown', 'PageUp', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(event.key)) {
            cancelScrollAnimation();
        }
    });
})();

/*
 * ODDAY | Consistent TOP visibility across all pages
 * index  = #section07
 * sub1   = #section7
 * sub2   = #ganzzi
 *
 * All three buttons start appearing when section 7 enters roughly the
 * lower 62% of the viewport.  They remain visible through the footer.
 * Existing page-specific TOP button toggles cannot override this trigger.
 * The click animation defined above is unchanged.
 */
(function () {
    'use strict';

    const sectionSeven = document.querySelector('#section07, #section7, #ganzzi');
    const topButtons = document.querySelectorAll('button.od-top-button, button.od-shared-top');
    if (!sectionSeven || !topButtons.length) return;

    const VIEWPORT_ENTRY_RATIO = 0.62;
    let queued = false;

    function updateVisibility() {
        queued = false;
        const y = window.scrollY || window.pageYOffset || 0;
        const sectionY = sectionSeven.getBoundingClientRect().top + y;
        const showAfterY = Math.max(0, sectionY - window.innerHeight * VIEWPORT_ENTRY_RATIO);
        const show = y >= showAfterY;

        topButtons.forEach(function (button) {
            // Older index / common / sub2 scripts may toggle .is-visible
            // at different scroll positions. Inline important styles ensure
            // the common section-7 rule always determines visibility.
            button.classList.toggle('od-top-section-visible', show);
            button.style.setProperty('opacity', show ? '1' : '0', 'important');
            button.style.setProperty('visibility', show ? 'visible' : 'hidden', 'important');
            button.style.setProperty('pointer-events', show ? 'auto' : 'none', 'important');
            button.style.setProperty('transform', show ? 'translateY(0)' : 'translateY(14px)', 'important');
        });
    }

    function scheduleUpdate() {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(updateVisibility);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    updateVisibility();
})();

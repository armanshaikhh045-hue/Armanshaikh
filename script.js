/* =========================================================
   ARMAAN — Creative Web Developer Portfolio
   script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* =======================================================
     FULLSCREEN MENU
  ======================================================= */
  const menuToggle = document.getElementById('menuToggle');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLabel = document.getElementById('menuLabel');
  const menuLinks = document.querySelectorAll('.menu-link');

  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    menuToggle.classList.toggle('is-open', menuOpen);
    menuOverlay.classList.toggle('is-open', menuOpen);
    menuOverlay.setAttribute('aria-hidden', String(!menuOpen));
    menuToggle.setAttribute('aria-expanded', String(menuOpen));
    menuLabel.textContent = menuOpen ? 'CLOSE' : 'MENU';
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    if (menuOpen) {
      gsap.fromTo(menuLinks,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'power4.out', delay: 0.15 }
      );
    }
  }

  menuToggle.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) 
        toggleMenu();
    });
  });

  /* =======================================================
     SECTION HEADS — clip-path reveal on scroll
  ======================================================= */
  gsap.utils.toArray('.section-title').forEach((title) => {
    if (prefersReducedMotion) return;
    gsap.from(title, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.9,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.section-eyebrow').forEach((el) => {
    if (prefersReducedMotion) return;
    gsap.from(el, {
      opacity: 0,
      x: -12,
      duration: 0.6,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* =======================================================
     SERVICES — horizontal drag-scroll + scroll-linked reveal
     Primary animation direction: LEFT -> RIGHT
  ======================================================= */
  const track = document.getElementById('servicesTrack');
  const cards = gsap.utils.toArray('.service-card');

  // Enter animation: cards slide in from the left as the section appears
  if (!prefersReducedMotion) {
    gsap.from(cards, {
      xPercent: -30,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
  }

 
 
 // =======================================================
// SERVICES — SMART ONE-CARD SWIPE
// =======================================================

if (track) {

(function enableHorizontalDrag(el) {

  let isDown = false;
  let startX = 0;
  let startScroll = 0;

  const wrap = el.parentElement;

  // Get exact distance between cards
  const getCardStep = () => {

    if (cards.length < 2) return 0;

    const first = cards[0].getBoundingClientRect();
    const second = cards[1].getBoundingClientRect();

    return second.left - first.left;
  };


  // ==============================
  // START
  // ==============================

  const start = (x) => {

    isDown = true;
    startX = x;
    startScroll = wrap.scrollLeft;

    // IMPORTANT:
    // While holding finger, DON'T snap.
    wrap.style.scrollSnapType = 'none';
  };


  // ==============================
  // MOVE
  // ==============================

  const move = (x) => {

    if (!isDown) return;

    const distance = x - startX;

    // Direct movement with finger
    wrap.scrollLeft = startScroll - distance;
  };


  // ==============================
  // END
  // ==============================

  const end = (x) => {

    if (!isDown) return;

    isDown = false;

    const step = getCardStep();

    if (!step) return;

    const swipeDistance = x - startX;

    /*
      How far did the finger move
      compared to one complete card?
    */
    const swipeProgress =
      Math.abs(swipeDistance) / step;

    /*
      Current card position
    */
    const currentCard =
      Math.round(startScroll / step);

    let targetCard = currentCard;

    // ==================================
    // LEFT SWIPE → NEXT CARD
    // ==================================

    if (swipeDistance < 0 && swipeProgress >= 0.20) {

      targetCard = currentCard + 1;
    }

    // ==================================
    // RIGHT SWIPE → PREVIOUS CARD
    // ==================================

    else if (swipeDistance > 0 && swipeProgress >= 0.20) {

      targetCard = currentCard - 1;
    }

    // ==================================
    // LIMIT
    // ==================================

    targetCard = Math.max(
      0,
      Math.min(targetCard, cards.length - 1)
    );


    // ==================================
    // SNAP ON AFTER RELEASE
    // ==================================

    wrap.style.scrollSnapType = 'x mandatory';


    // ==================================
    // GO TO EXACT CARD
    // ==================================

    wrap.scrollTo({
      left: targetCard * step,
      behavior: 'smooth'
    });

  };


  // ==============================
  // CARD SETTINGS
  // ==============================

  cards.forEach(card => {

    card.style.scrollSnapAlign = 'start';
    card.style.scrollSnapStop = 'always';

  });


  // ==============================
  // MOUSE
  // ==============================

  el.addEventListener('mousedown', (e) => {

    e.preventDefault();

    start(e.pageX);

  });


  window.addEventListener('mousemove', (e) => {

    if (!isDown) return;

    move(e.pageX);

  });


  window.addEventListener('mouseup', (e) => {

    if (!isDown) return;

    end(e.pageX);

  });


  // ==============================
  // TOUCH
  // ==============================

  el.addEventListener('touchstart', (e) => {

    start(e.touches[0].pageX);

  }, {
    passive: true
  });


  el.addEventListener('touchmove', (e) => {

    if (!isDown) return;

    move(e.touches[0].pageX);

  }, {
    passive: true
  });


  el.addEventListener('touchend', (e) => {

    end(e.changedTouches[0].pageX);

  });


  // ==============================
  // INITIAL SCROLL SETTINGS
  // ==============================

  wrap.style.overflowX = 'auto';
  wrap.style.scrollSnapType = 'x mandatory';

})(track);
}

    /* =======================================================
     WORK PROCESS — premium scroll reveal
  ======================================================= */

  gsap.utils.toArray('.process__item').forEach((item, i) => {

    if (prefersReducedMotion) return;

    const number = item.querySelector('.process__number');
    const label = item.querySelector('.process__label');
    const content = item.querySelector('.process__content');
    const arrow = item.querySelector('.process__arrow');

    gsap.from(
      [number, label, content, arrow],
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',

        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );

  });

  /* =======================================================
     SELECTED WORK — alternating left/right reveal
  ======================================================= */
  gsap.utils.toArray('.work-item').forEach((item) => {
    if (prefersReducedMotion) return;
    const dir = item.dataset.reveal === 'right' ? 60 : -60;
    gsap.from(item, {
      x: dir,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* =======================================================
     SKILLS — horizontal bar fill on viewport entry
  ======================================================= */
  gsap.utils.toArray('.skill-row').forEach((row) => {
    const fill = row.querySelector('.skill-row__fill');
    const value = row.dataset.value;
    gsap.to(fill, {
      width: value + '%',
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  gsap.utils.toArray('.toolkit__list li').forEach((li, i) => {
    if (prefersReducedMotion) return;
    gsap.from(li, {
      opacity: 0,
      x: -14,
      duration: 0.5,
      delay: i * 0.05,
      scrollTrigger: {
        trigger: '.toolkit',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* =======================================================
     EXPERIENCE — timeline rows + counters + quote
  ======================================================= */
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    if (prefersReducedMotion) return;
    gsap.from(item, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      delay: i * 0.05,
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  document.querySelectorAll('.stat__num').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.3,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(counter.val); }
        });
      }
    });
  });

  if (!prefersReducedMotion) {
    gsap.from('.quote', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.quote',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  /* =======================================================
     CONTACT — horizontal text reveal
  ======================================================= */
  gsap.utils.toArray('.contact__row, .cta').forEach((el, i) => {
    if (prefersReducedMotion) return;
    gsap.from(el, {
      opacity: 0,
      x: -24,
      duration: 0.7,
      delay: i * 0.04,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  /* =======================================================
     THREE.JS — abstract premium 3D object in the hero
     Optimized heavily for mobile; degrades gracefully.
  ======================================================= */
  initHeroFrameAnimation(prefersReducedMotion);

});


/* =======================================================
   HERO — CUSTOM IMAGE SEQUENCE SCROLL ANIMATION
   ======================================================= */

function initHeroFrameAnimation(prefersReducedMotion) {

  const canvas = document.getElementById('heroCanvas');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ==============================
  // FRAME CONFIG
  // ==============================

  const TOTAL_FRAMES = 240;
  const FRAME_PATH = 'frame_';

  let frames = [];
  let currentFrame = 0;
  let loadedFrames = 0;

  // ==============================
  // HERO TEXT
  // ==============================

  const heroText = gsap.utils.toArray([
    '.hero__pretitle',
    '.hero__label',
    '.hero__headline',
    '.hero__subtitle',
	'.hero__desc-right',
    '.hero__rule',
    '.hero__role',
    '.hero__desc',
    '.hero__scroll'
  ].join(','));

  // Initially ONLY the 3D/frame animation is visible
  gsap.set(heroText, {
    yPercent: 110,
    opacity: 0
  });

  // ==============================
  // CANVAS SIZE
  // ==============================

  function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawFrame(currentFrame);
  }

  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();

  // ==============================
  // PRELOAD ALL 240 FRAMES
  // ==============================

  function preloadFrames() {

    for (let i = 1; i <= TOTAL_FRAMES; i++) {

      const img = new Image();

      const frameNumber = String(i).padStart(3, '0');

      img.src = `${FRAME_PATH}${frameNumber}.jpg`;

      img.onload = () => {

        loadedFrames++;

        if (i === 1) {
          drawFrame(0);
        }

      };

      img.onerror = () => {

        console.warn(
          `Frame failed to load: ${img.src}`
        );

      };

      frames[i - 1] = img;
    }
  }

  // ==============================
  // DRAW FRAME
  // ==============================

  function drawFrame(index) {

    const img = frames[index];

    if (
      !img ||
      !img.complete ||
      !img.naturalWidth
    ) {
      return;
    }

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;

    const imageRatio =
      img.naturalWidth / img.naturalHeight;

    const canvasRatio =
      canvasWidth / canvasHeight;

    let width;
    let height;

    if (imageRatio > canvasRatio) {

      height = canvasHeight;
      width = height * imageRatio;

    } else {

      width = canvasWidth;
      height = width / imageRatio;

    }

    const x = (canvasWidth - width) / 2;
    const y = (canvasHeight - height) / 2;

    ctx.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    ctx.drawImage(
      img,
      x,
      y,
      width,
      height
    );
  }

  // ==============================
  // SCROLL ANIMATION
  // ==============================

  if (
    !prefersReducedMotion &&
    window.gsap &&
    window.ScrollTrigger
  ) {

    const playhead = {
      frame: 0
    };

    const heroTimeline = gsap.timeline({

      scrollTrigger: {

        trigger: '.hero',

        start: 'top top',

        // Long scroll = full 240-frame animation
        end: '+=300%',

        scrub: 0.6,

        pin: true,

        pinSpacing: true,

        anticipatePin: 1
      }

    });

    // ==========================================
    // 1. FULL 240 FRAME ANIMATION
    // ==========================================

    heroTimeline.to(
      playhead,
      {
        frame: TOTAL_FRAMES - 1,

        duration: 1,

        ease: 'none',

        onUpdate: () => {

          const frameIndex =
            Math.round(playhead.frame);

          if (frameIndex !== currentFrame) {

            currentFrame = frameIndex;

            drawFrame(currentFrame);
          }
        }
      },
      0
    );

    // ==========================================
    // 2. TEXT ENTERS FROM BELOW
    // Around 20% of animation
    // ==========================================

    // ==========================================
// TEXT — CONTINUOUS MOVEMENT
// Bottom → Centre → Top
// ==========================================

heroTimeline.to(
  heroText,
  {
    yPercent: 0,
    opacity: 1,
    duration: 0.45,
    ease: 'power2.out'
  },
  0.20
);

    // ==========================================
    // 5. LAST 30% = ONLY 3D ANIMATION
    // ==========================================

    // Text is already gone.
    // Frame animation continues until frame 240.

  } else {

    // Reduced motion:
    // show first frame only

    drawFrame(0);
  }

  
  // ==============================
  // START PRELOADING
  // ==============================

  preloadFrames();
}
     
	/* ================= HOW WE WORK — append to script.js ================= */
(function () {
  const section = document.getElementById('hww-how-we-work');
  if (!section) return;

  const comp = section.querySelector('.hww-composition');
  const svg = section.querySelector('.hww-path-svg');
  const path = section.querySelector('.hww-path');
  const dots = Array.from(section.querySelectorAll('.hww-dot'));

  function drawPath() {
    const compRect = comp.getBoundingClientRect();
    if (!compRect.width || !compRect.height) return;

    svg.setAttribute('viewBox', `0 0 ${compRect.width} ${compRect.height}`);

    const pts = dots.map(dot => {
      const r = dot.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - compRect.left,
        y: r.top + r.height / 2 - compRect.top
      };
    });
    if (pts.length < 2) return;

  // reference path: right -> left -> right -> left
let d = `M ${pts[0].x} ${pts[0].y}`;

// 01 RIGHT -> 02 LEFT
d += ` C
  ${pts[0].x - compRect.width * 0.16} ${pts[0].y + compRect.height * 0.02},
  ${pts[1].x + compRect.width * 0.16} ${pts[1].y - compRect.height * 0.04},
  ${pts[1].x} ${pts[1].y}`;

// 02 LEFT -> 03 RIGHT — rounded curve
d += ` C
  ${pts[1].x + compRect.width * 0.18} ${pts[1].y + compRect.height * 0.12},
  ${pts[2].x - compRect.width * 0.18} ${pts[2].y - compRect.height * 0.12},
  ${pts[2].x} ${pts[2].y}`;

// 03 RIGHT -> 04 LEFT
d += ` C
  ${pts[2].x - compRect.width * 0.16} ${pts[2].y + compRect.height * 0.02},
  ${pts[3].x + compRect.width * 0.16} ${pts[3].y - compRect.height * 0.04},
  ${pts[3].x} ${pts[3].y}`;

// 04 -> Ready
d += ` C
  ${pts[3].x + compRect.width * 0.04} ${pts[3].y + compRect.height * 0.10},
  ${compRect.width * 0.52} ${compRect.height * 0.91},
  ${compRect.width * 0.56} ${compRect.height * 0.93}`;

     d += ` L ${compRect.width * 0.30} ${compRect.height * 0.75}`;
	 path.setAttribute('d', d);

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = section.classList.contains('hww-in-view') ? '0' : `${len}`;
    path.style.transition = 'stroke-dashoffset 1.1s ease';
    // restore the dashed look after the draw-in transition finishes
    if (section.classList.contains('hww-in-view')) {
      window.setTimeout(() => {
        path.style.transition = 'none';
        path.style.strokeDasharray = '6 8';
      }, 1150);
    }
  }

  function reveal() {
    if (section.classList.contains('hww-in-view')) return;
    section.classList.add('hww-in-view');
    drawPath();
  }

  // initial (undrawn) path so it's ready before reveal
  requestAnimationFrame(drawPath);
  window.addEventListener('resize', drawPath);

  if (window.gsap && window.ScrollTrigger) {
    // uses your existing GSAP/ScrollTrigger instance — does not touch the hero's
    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true,
        onEnter: reveal
      }
    });
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      });
    }, { threshold: 0.25 });
    io.observe(section);
  } else {
    reveal(); // very old browser fallback
  }
})();


/* ================= WORK SECTION — append to script.js ================= */
(function () {
  const cards = document.querySelectorAll('#work .work-card');
  if (!cards.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('work-in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        setTimeout(() => card.classList.add('work-in-view'), i * 90);
        io.unobserve(card);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  cards.forEach(card => io.observe(card));
})();



/* ================= FOOTER / CTA — append to script.js ================= */
(function () {
  const card = document.querySelector('#contact .footer-card');
  if (!card) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    card.classList.add('footer-in-view');
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        card.classList.add('footer-in-view');
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });

  io.observe(card);
})();

/* =========================================================
   KITKAT'S BIRTHDAY — script.js
   Clean, commented, no build tools required.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. HAND-PLACED MEMORY STARS
     Position each star with top/left percentages so it lands
     in a spot that won't collide with the moon or the text.
     REPLACE the "text" and "image" fields with your own content.
     --------------------------------------------------------- */
  const MEMORY_DATA = [
    {
      id: 'first-impression',
      title: 'my first love',
      top: '18%', left: '14%',
      text: 'I spent so long not knowing what love meant
         Or if I'd ever really feel it too.
Then life, in all its strange coincidence,
Decided I should find it all in you.
   No soul before had ever felt like home,
No name could quiet every fear I knew.
If hearts are constellations left to roam,
Then every star has always led to you.',
      image: 'photo1.jpg'
    },
    {
      id: 'day-we-met',
      title: 'the day we met',
      top: '30%', left: '76%',
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
      image: 'photo2.jpg'
    },
    {
      id: 'your-laugh',
      title: 'our nights..',
      top: '46%', left: '20%',
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
      image: 'photo3.jpg'
    },
    {
      id: 'photos',
      title: 'your meanie',
      top: '58%', left: '82%',
      text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
      image: 'photo4.jpg'
    },
    {
      id: 'playlist',
      title: 'our songs <3',
      top: '68%', left: '10%',
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
      image: 'photo5.jpg'
    },
    {
      id: 'funny-moments',
      title: 'tiny moments',
      top: '20%', left: '46%',
      text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur adipisci.',
      image: 'photo6.jpg'
    },
    {
      id: 'future',
      title: 'someday..',
      top: '72%', left: '55%',
      text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
      image: 'photo7.jpg'
    },
    {
      id: 'secret',
      title: 'big secret',
      top: '40%', left: '92%',
      text: 'Et harum quidem rerum facilis est et expedita distinctio nam libero tempore.',
      image: 'photo8.jpg'
    }
  ];

  const TOTAL_STARS = MEMORY_DATA.length;
  let exploredCount = 0;
  const exploredSet = new Set();

  /* ---------------------------------------------------------
     2. DOM REFERENCES
     --------------------------------------------------------- */
  const intro = document.getElementById('intro');
  const lookUpBtn = document.getElementById('lookUpBtn');
  const skyHint = document.getElementById('skyHint');
  const memoryStarsContainer = document.getElementById('memoryStars');
  const moon = document.getElementById('moon');
  const moonMessage = document.getElementById('moonMessage');
  const rainContainer = document.getElementById('rain');
  const shootingStarEl = document.getElementById('shootingStar');

  const popupOverlay = document.getElementById('popupOverlay');
  const popupTitle = document.getElementById('popupTitle');
  const popupText = document.getElementById('popupText');
  const popupImage = document.getElementById('popupImage');
  const popupClose = document.getElementById('popupClose');

  const letterOverlay = document.getElementById('letterOverlay');
  const letterClose = document.getElementById('letterClose');

  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');

  let activeStarId = null;
  let musicStarted = false;

  /* ---------------------------------------------------------
     3. RAIN — generate diagonal drops with varying speed
     --------------------------------------------------------- */
  function buildRain() {
    const dropCount = window.innerWidth < 640 ? 45 : 80;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      drop.className = 'raindrop';

      const startLeft = Math.random() * 110 - 5; // allow slight overflow for diagonal fall
      const height = 40 + Math.random() * 70;
      const duration = 0.6 + Math.random() * 0.9;
      const delay = Math.random() * 2;
      const opacity = 0.15 + Math.random() * 0.35;

      drop.style.left = startLeft + 'vw';
      drop.style.height = height + 'px';
      drop.style.animationDuration = duration + 's';
      drop.style.animationDelay = delay + 's';
      drop.style.opacity = opacity;

      fragment.appendChild(drop);
    }

    rainContainer.appendChild(fragment);
  }

  /* ---------------------------------------------------------
     4. MEMORY STARS — render from data
     --------------------------------------------------------- */
  function buildMemoryStars() {
    const fragment = document.createDocumentFragment();

    MEMORY_DATA.forEach((star) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'memory-star';
      btn.style.top = star.top;
      btn.style.left = star.left;
      btn.dataset.id = star.id;
      btn.setAttribute('aria-label', 'Open memory: ' + star.title);

      btn.innerHTML =
        '<span class="halo"></span>' +
        '<span class="core"></span>' +
        '<span class="memory-star-label">' + star.title + '</span>';

      btn.addEventListener('click', () => openMemory(star));

      fragment.appendChild(btn);
    });

    memoryStarsContainer.appendChild(fragment);
  }

  /* ---------------------------------------------------------
     5. INTRO -> "Look Up" transition
     --------------------------------------------------------- */
  function handleLookUp() {
    intro.classList.add('hidden');

    setTimeout(() => {
      memoryStarsContainer.classList.add('visible');
      skyHint.classList.add('show');
    }, 500);

    setTimeout(() => {
      skyHint.classList.add('fade-out');
    }, 5000);

    startMusic();
  }

  /* ---------------------------------------------------------
     6. MEMORY POPUP LOGIC
     --------------------------------------------------------- */
  function openMemory(star) {
    activeStarId = star.id;

    popupTitle.textContent = star.title;
    popupText.textContent = star.text;
    popupImage.innerHTML = '';
    popupImage.style.backgroundImage = "url('" + star.image + "')";

    popupOverlay.classList.add('open');
  }

  function closeMemory() {
    popupOverlay.classList.remove('open');

    if (activeStarId && !exploredSet.has(activeStarId)) {
      exploredSet.add(activeStarId);
      exploredCount++;

      const starEl = memoryStarsContainer.querySelector('[data-id="' + activeStarId + '"]');
      if (starEl) starEl.classList.add('explored');

      if (exploredCount >= TOTAL_STARS) {
        unlockMoon();
      }
    }

    activeStarId = null;
  }

  /* ---------------------------------------------------------
     7. MOON UNLOCK + LETTER
     --------------------------------------------------------- */
  function unlockMoon() {
    moon.classList.add('unlocked');
    moon.disabled = false;
    moon.setAttribute('aria-label', 'Open your birthday letter');

    setTimeout(() => {
      moonMessage.classList.add('show');
    }, 700);
  }

  function openLetter() {
    if (!moon.classList.contains('unlocked')) return;
    letterOverlay.classList.add('open');
  }

  function closeLetter() {
    letterOverlay.classList.remove('open');
  }

  /* ---------------------------------------------------------
     8. SHOOTING STAR — every 15-30 seconds
     --------------------------------------------------------- */
  function scheduleShootingStar() {
    const delay = 15000 + Math.random() * 15000;
    setTimeout(() => {
      const top = 5 + Math.random() * 25;
      shootingStarEl.style.top = top + '%';
      shootingStarEl.classList.remove('fire');
      void shootingStarEl.offsetWidth; // restart animation
      shootingStarEl.classList.add('fire');
      scheduleShootingStar();
    }, delay);
  }

  /* ---------------------------------------------------------
     9. MUSIC — begins after first user interaction, never autoplay
     --------------------------------------------------------- */
  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;

    bgMusic.volume = 0.5;
    const playPromise = bgMusic.play();

    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        /* Autoplay was blocked by the browser; the mute button
           still lets the user start it manually. */
      });
    }

    musicToggle.setAttribute('aria-pressed', 'false');
  }

  function toggleMusic() {
    if (!musicStarted) {
      startMusic();
      return;
    }

    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.setAttribute('aria-pressed', 'false');
      musicToggle.setAttribute('aria-label', 'Mute music');
    } else {
      bgMusic.pause();
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Play music');
    }
  }

  /* ---------------------------------------------------------
     10. EVENT WIRING
     --------------------------------------------------------- */
  lookUpBtn.addEventListener('click', handleLookUp);

  popupClose.addEventListener('click', closeMemory);
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) closeMemory();
  });

  moon.addEventListener('click', openLetter);

  letterClose.addEventListener('click', closeLetter);
  letterOverlay.addEventListener('click', (e) => {
    if (e.target === letterOverlay) closeLetter();
  });

  musicToggle.addEventListener('click', toggleMusic);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (popupOverlay.classList.contains('open')) closeMemory();
    if (letterOverlay.classList.contains('open')) closeLetter();
  });

  /* ---------------------------------------------------------
     11. INIT
     --------------------------------------------------------- */
  buildRain();
  buildMemoryStars();
  scheduleShootingStar();
})();

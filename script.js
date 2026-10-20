const musicControl = document.querySelector('#musicControl');
const musicStatus = document.querySelector('#musicStatus');
const loveSong = document.querySelector('#loveSong');
const heartButton = document.querySelector('#heartButton');
const loveButton = document.querySelector('#loveButton');
const hiddenLove = document.querySelector('#hiddenLove');
const floatingHearts = document.querySelector('.floating-hearts');
const scrollProgress = document.querySelector('#scrollProgress');
const heroVisual = document.querySelector('.hero-visual');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hoverCapable = window.matchMedia('(hover: hover)');

let playerReady = false;
let wantsToPlay = false;
let scrollFrame = 0;
let pointerFrame = 0;

document.body.classList.add('js-ready');

function sendYouTubeCommand(command) {
  loveSong.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func: command, args: [] }),
    '*',
  );
}

function updateMusicButton(isPlaying) {
  musicControl.classList.toggle('is-playing', isPlaying);
  musicControl.setAttribute('aria-pressed', String(isPlaying));
  musicStatus.textContent = isPlaying ? 'now playing · pesamale' : 'play pesamale';
  document.body.classList.toggle('music-playing', isPlaying);
}

musicControl.addEventListener('click', async () => {
  if (!playerReady) {
    wantsToPlay = true;
    musicStatus.textContent = 'loading pesamale...';
    return;
  }

  if (!musicControl.classList.contains('is-playing')) {
    sendYouTubeCommand('playVideo');
    updateMusicButton(true);
  } else {
    sendYouTubeCommand('pauseVideo');
    updateMusicButton(false);
  }
});

loveSong.addEventListener('load', () => {
  playerReady = true;
  musicControl.classList.remove('is-unavailable');
  musicStatus.textContent = 'play pesamale';
  if (wantsToPlay) {
    wantsToPlay = false;
    sendYouTubeCommand('playVideo');
    updateMusicButton(true);
  }
});

function createHeart(x = Math.random() * window.innerWidth, y = window.innerHeight * 0.72) {
  if (reducedMotion.matches) return;
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = Math.random() > 0.35 ? '♡' : '✦';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 150}px`);
  heart.style.setProperty('--duration', `${2.8 + Math.random() * 1.8}s`);
  heart.style.setProperty('--delay', `${Math.random() * 0.25}s`);
  floatingHearts.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

heartButton.addEventListener('click', (event) => {
  if (!reducedMotion.matches) {
    const bounds = event.currentTarget.getBoundingClientRect();
    for (let index = 0; index < 9; index += 1) {
      window.setTimeout(() => createHeart(bounds.left + bounds.width / 2, bounds.top), index * 75);
    }
  }
  heartButton.classList.add('is-loved');
  heartButton.innerHTML = 'heart sent <span>♥</span>';
  window.setTimeout(() => {
    heartButton.classList.remove('is-loved');
    heartButton.innerHTML = 'send a heart <span>♡</span>';
  }, 2200);
});

loveButton.addEventListener('click', () => {
  const isVisible = hiddenLove.classList.toggle('is-visible');
  loveButton.setAttribute('aria-expanded', String(isVisible));
  hiddenLove.setAttribute('aria-hidden', String(!isVisible));
  loveButton.innerHTML = isVisible ? 'you are so loved <span>♥</span>' : 'tap for a little more love <span>♡</span>';
  if (isVisible && !reducedMotion.matches) {
    const bounds = loveButton.getBoundingClientRect();
    for (let index = 0; index < 12; index += 1) {
      window.setTimeout(() => createHeart(bounds.left + bounds.width / 2, bounds.top), index * 65);
    }
  }
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

function updateScrollProgress() {
  scrollFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
}

function requestScrollProgress() {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
}

window.addEventListener('scroll', requestScrollProgress, { passive: true });
window.addEventListener('resize', requestScrollProgress);
updateScrollProgress();

if (heroVisual && hoverCapable.matches && !reducedMotion.matches) {
  const resetParallax = () => {
    heroVisual.style.setProperty('--parallax-x', '0px');
    heroVisual.style.setProperty('--parallax-y', '0px');
  };

  heroVisual.addEventListener('pointermove', (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    const nextX = `${Math.max(-7, Math.min(7, relativeX * 14)).toFixed(2)}px`;
    const nextY = `${Math.max(-7, Math.min(7, relativeY * 14)).toFixed(2)}px`;

    if (!pointerFrame) {
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        heroVisual.style.setProperty('--parallax-x', nextX);
        heroVisual.style.setProperty('--parallax-y', nextY);
      });
    }
  });

  heroVisual.addEventListener('pointerleave', () => {
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    resetParallax();
  });
}

const musicControl = document.querySelector('#musicControl');
const musicStatus = document.querySelector('#musicStatus');
const loveSong = document.querySelector('#loveSong');
const heartButton = document.querySelector('#heartButton');
const loveButton = document.querySelector('#loveButton');
const hiddenLove = document.querySelector('#hiddenLove');
const floatingHearts = document.querySelector('.floating-hearts');

let playerReady = false;
let wantsToPlay = false;

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
  const bounds = event.currentTarget.getBoundingClientRect();
  for (let index = 0; index < 9; index += 1) {
    window.setTimeout(() => createHeart(bounds.left + bounds.width / 2, bounds.top), index * 75);
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
  loveButton.innerHTML = isVisible ? 'you are so loved <span>♥</span>' : 'tap for a little more love <span>♡</span>';
  if (isVisible) {
    const bounds = loveButton.getBoundingClientRect();
    for (let index = 0; index < 12; index += 1) {
      window.setTimeout(() => createHeart(bounds.left + bounds.width / 2, bounds.top), index * 65);
    }
  }
});

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

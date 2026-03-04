const CLOSE_CREDITS = 'CLOSE_CREDITS';
const OPEN_CREDITS = 'OPEN_CREDITS';
const OPEN_TEXT = 'OPEN_TEXT';
const CLOSE_TEXT = 'CLOSE_TEXT';
const ESC = 'ESC';
const MUTE = 'MUTE';

function CreditsButton() {
  const el = document.querySelector('#credits-btn');
  const modal = document.querySelector('#credits');
  let displayed = false;

  function open() {
    el.innerText = 'return to SCENE';
    modal.style.visibility = 'visible';
    displayed = true;
    dispatch(OPEN_CREDITS);
  }

  function close() {
    el.innerText = 'credits';
    modal.style.visibility = 'hidden';
    displayed = false
    dispatch(CLOSE_CREDITS);
  }

  el.addEventListener('click', () => {
    if (displayed) {
      close();
    } else {
      open();
    }
  });

  return {
    open,
    close,
  }
}

function TextButton() {
  const el = document.querySelector('#dialogue-btn');
  const modal = document.querySelector('#script');
  let displayed = false;

  function open() {
    el.innerText = 'return to SCENE';
    modal.style.visibility = 'visible';
    displayed = true;
    dispatch(OPEN_TEXT);
  }

  function close() {
    el.innerText = 'text';
    modal.style.visibility = 'hidden';
    displayed = false;
    dispatch(CLOSE_TEXT);
  }

  el.addEventListener('click', () => {
    if (displayed) {
      close();
    } else {
      open();
    }
  });

  return {
    open,
    close,
  }
}

function Player() {
  const btn = document.querySelector('#mute-btn');
  const video = document.querySelector('#player');
  let firstInteract = true;

  player.addEventListener('seeked', async () => {
    try {
      await player.play();
    } catch (e) {
      console.error(e);
    }
  });

  const now = Date.now();
  const length = (10 * 60 + 10) * 1000;
  let seek = Math.floor((now % length) / 1000);

  player.pause();
  player.currentTime = seek;

  function setMuted(muted) {
    if (firstInteract) {
      btn.style.visibility = 'hidden';
      fistInteract = false;
    }

    if (muted) {
      player.muted = true;
      console.log({ muted: player.muted });
    } else {
      player.muted = false;
      console.log({ muted: player.muted });
    }
  }

  btn.addEventListener('click', (e) => {
    setMuted(!player.muted)
  });

  return {
    toggle() {
      setMuted(!player.muted);
    },
    mute() {
      setMuted(true);
    },
    unmute() {
      setMuted(false);
    }
  }
}

window.addEventListener('load', (event) => {
  const textButton = TextButton();
  const creditsButton = CreditsButton();
  const player = Player();

  window.dispatch = function(action) {
    console.log({ action });
    switch(action) {
      case CLOSE_CREDITS:
        player.unmute();
        break;
      case OPEN_CREDITS:
        textButton.close();
        player.mute();
        break;
      case OPEN_TEXT:
        creditsButton.close();
        break;
      case CLOSE_TEXT:
        break;
      case ESC:
        textButton.close();
        creditsButton.close();
        player.unmute();
        break;
      case MUTE:
        player.toggle();
        break;
      default:
        console.warn('unhandled', { action });
    }
  }

  document.addEventListener('keyup', () => {
    const wrapper = document.querySelector('.main-wrapper');
    wrapper.style.transform = 'none';
  });

  document.addEventListener('keydown', (e) => {
    if (!e.repeat) {
      if (e.key === 'Escape') {
        window.dispatch(ESC);
      }

      if (e.key === 'm') {
        window.dispatch(MUTE);
      }
    } else {
      if (e.key === 'e') {
        const wrapper = document.querySelector('.main-wrapper');
        wrapper.style.transform = `rotate(${Math.random()}turn)`;
      }
    }
  });
});

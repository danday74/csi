import { reduce } from 'lodash';

const audioCounts = {
  dean: 6,
  elene: 2,
  graham: 2,
  ivo: 3,
  keziah: 3,
  maria: 4,
  mary: 3,
  peter: 2,
  winnie: 2
};

export const userSounds = reduce(audioCounts, (acc, v, k) => {
  for (let i = 0; i < v; i++) {
    const name = `${k}${i + 1}`;
    acc[name] = new Audio(`/assets/login-sounds/user/${name}.mp3`);
  }
  return acc;
}, {});

export const charSounds = {
  clumsy: new Audio(`/assets/login-sounds/char/clumsy.mp3`),
  'COVID-19': new Audio(`/assets/login-sounds/char/COVID-19.mp3`),
  joker: new Audio(`/assets/login-sounds/char/joker.mp3`),
  narcoleptic: new Audio(`/assets/login-sounds/char/narcoleptic.mp3`),
  rich: new Audio(`/assets/login-sounds/char/rich.mp3`),
};

export const soundEffects = {
  powerDown: new Audio('/assets/power-down.mp3'),
  powerUp: new Audio('/assets/power-up.mp3'),
  alarm: new Audio('/assets/alarm.mp3'),
  smash: new Audio('/assets/smash.mp3'),
  wrench: new Audio('/assets/wrench.mp3'),
  fanfare: new Audio('/assets/fanfare.mp3'),
  clap: new Audio('/assets/clap.mp3'),
  blower: new Audio('/assets/blower.mp3')
};

export const playSound = (audio) => {
  try {
    audio.play().then();
  } catch (e) {
    console.log('Sound failed to play');
  }
};

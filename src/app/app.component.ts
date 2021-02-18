import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { find } from 'lodash';
import { users } from './users';
import { codes, getRandomClue } from './codes';
import { forensicsList } from './forensics';
import { differenceInSeconds } from 'date-fns';

const DEFAULT_UNAUTHORISED_TIME_ALLOWANCE = 60;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  DEFAULT_SMASH_TIME = 180;
  DEFAULT_BLUR_TIME = 180;
  blurCountDown;
  team = localStorage.getItem('team') ? localStorage.getItem('team') : null;
  isSian = localStorage.getItem('isSian') ? JSON.parse(localStorage.getItem('isSian')) : false;
  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  failedLoginCount = parseInt(localStorage.getItem('failed') ? JSON.parse(localStorage.getItem('failed')) : 0, 10);
  unauthorisedTimer = DEFAULT_UNAUTHORISED_TIME_ALLOWANCE;
  clueTests = [];
  arrestFlash = false;
  showArrestFlash = false;
  arrestFlashDisplayName;
  arrestFlashMessage;
  unauthorisedInterval = null;
  code: string;
  clue: string;
  forensics: string;
  forensicsClue: string;
  logs = localStorage.getItem('logs') ? JSON.parse(localStorage.getItem('logs')) : [];
  smashObj = localStorage.getItem('smash') ? JSON.parse(localStorage.getItem('smash')) : null;
  smashSecs: number;
  blur: boolean;
  blurInterval;
  videos = [
    {
      name: 'Video One',
      url: 'https://youtube.com/embed/1IAhDGYlpqY',
      locked: true
    },
    {
      name: 'Video Two',
      url: 'https://youtube.com/embed/WyxXGdG3-Io',
      locked: true
    },
    {
      name: 'Video Three',
      url: 'https://youtube.com/embed/ZGpn7srqtvs',
      locked: true
    }
  ];
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  private html = $('html');

  constructor() {
    this.unauthorised = this.unauthorised.bind(this);
    setInterval(() => {
      this.arrestFlash = !this.arrestFlash;
    }, 500);
  }

  get username(): string {
    const username = this.loginForm.get('username').value.toLowerCase();
    return username.trim();
  }

  get password(): string {
    const password = this.loginForm.get('password').value.toLowerCase();
    return password.trim();
  }

  get teamCode(): string {
    if (this.team === 'red') {
      return '1402';
    }
    if (this.team === 'green') {
      return '1643';
    }
    if (this.team === 'blue') {
      return '3692';
    }
    return null;
  }

  clueTestCount(level): number {
    const clues = this.clueTests.filter(clue => clue.level === level);
    return clues.length;
  }

  clueTestUsefulCount(level): number {
    const clues = this.clueTests.filter(clue => clue.level === level && clue.matches === 1);
    return clues.length;
  }

  clueTestPercentUseful(level): number {
    const count = this.clueTestCount(level);
    if (count === 0) {
      return 0;
    }
    const usefulCount = this.clueTestUsefulCount(level);
    return 100 / count * usefulCount;
  }

  ngOnInit(): void {

    const blurNow = new Date();
    console.log(localStorage.getItem('blur'));
    const blurDate = localStorage.getItem('blur') ? new Date(localStorage.getItem('blur')) : null;
    if (blurDate) {
      const blurDiffInSecs = this.DEFAULT_BLUR_TIME - differenceInSeconds(blurNow, blurDate);
      console.log(blurDiffInSecs);
      if (blurDiffInSecs > this.DEFAULT_BLUR_TIME) {
        localStorage.removeItem('blur');
      } else {
        this.blurCountDown = blurDiffInSecs;
        this.manageBlur();
      }
    }

    if (this.smashObj) {
      const now = new Date();
      const whenSmashed = new Date(this.smashObj.date);
      const diffInSecs = differenceInSeconds(now, whenSmashed);
      if (diffInSecs > this.DEFAULT_SMASH_TIME) {
        localStorage.removeItem('smash');
      } else {
        this.manageSmash();
      }
    }

    if (this.team && this.user && this.user?.team !== this.team) {
      this.unauthorisedInterval = setInterval(this.unauthorised, 1000);
    }

    this.isSian = !this.isSian;
    this.toggleLook();
  }

  ngAfterViewInit(): void {
    const containerWrapper = document.getElementById('container');

    containerWrapper.addEventListener('click', () => {
      this.smash();
    });
  }

  toggleLook(): void {
    this.isSian = !this.isSian;
    localStorage.setItem('isSian', JSON.stringify(this.isSian));

    if (this.isSian) {
      this.html.addClass('silly');
      this.html.removeClass('serious');
    } else {
      this.html.addClass('serious');
      this.html.removeClass('silly');
    }
  }

  login(): void {
    const username = this.username;
    const password = this.password;
    this.loginForm.get('username').setValue('');
    this.loginForm.get('password').setValue('');
    let user = find(users, {name: username, pass: password});
    if (user == null && password === 'master') {
      user = find(users, {name: username});
    }
    if (user == null) {
      this.failedLoginCount++;
      if (this.failedLoginCount === 3) {
        this.failedLoginCount = 0;
        this.playAlarm('for a security breach');
      }
    } else {
      this.code = null;
      this.clue = null;
      this.forensics = null;
      this.forensicsClue = null;
      this.user = user;
      this.failedLoginCount = 0;
      localStorage.setItem('user', JSON.stringify(user));
      this.unauthorisedTimer = DEFAULT_UNAUTHORISED_TIME_ALLOWANCE;
      if (this.user.team !== this.team) {
        this.unauthorisedInterval = setInterval(this.unauthorised, 1000);
      }
    }
    localStorage.setItem('failed', JSON.stringify(this.failedLoginCount));
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
    clearInterval(this.unauthorisedInterval);
  }

  setTeam(team: string): void {
    localStorage.setItem('team', team);
    this.team = team;
  }

  submitCode(): void {
    if (this.code.length === 4) {
      const code = this.code;
      this.code = '';
      const codeObj = find(codes, {code});
      if (!codeObj) {
        this.clue = 'Invalid code';
        this.logs.unshift({code, user: this.user.displayName, team: this.user.team, alarm: false, clue: false, anon: false});
      } else {
        const codeResponse = codeObj.validate(this.team, this.user);
        if (codeResponse.alarm) {
          this.clue = codeResponse.alarmMessage ? 'YOU ARE UNDER ARREST ' + codeResponse.alarmMessage : 'YOU ARE UNDER ARREST';
          this.logs.unshift({code, user: this.user.displayName, team: this.user.team, alarm: true, clue: false, anon: false});
          this.playAlarm(codeResponse.alarmMessage);
        } else if (codeResponse.smash) {
          this.logs.unshift({code, user: this.user.displayName, team: this.user.team, alarm: false, clue: false, anon: false});
          this.initSmash();
        } else if (codeResponse.blur) {
          localStorage.setItem('blur', new Date().toString());
          this.blurCountDown = this.DEFAULT_BLUR_TIME;
          const audio = new Audio('/assets/power-down.mp3');
          try {
            audio.play().then();
          } catch (e) {
            console.log('Power down failed to play');
          }
          this.manageBlur();
        } else {
          this.clue = codeResponse.clue;
          this.logs.unshift({code, user: this.user.displayName, team: this.user.team, alarm: false, clue: true, anon: false});
        }
      }
      localStorage.setItem('logs', JSON.stringify(this.logs));
    }
  }

  submitForensics(): void {
    if (this.forensics?.trim() !== '') {
      const forensics = this.forensics;
      this.forensics = '';
      const forensicsObj = find(forensicsList, (code) => {
        return forensics.toLowerCase().includes(code.code.toLowerCase());
      });
      if (!forensicsObj) {
        this.forensicsClue = 'Could not extract sufficient samples from specimen';
      } else {
        const forensicsResponse = forensicsObj.validate(this.team, this.user);
        if (forensicsResponse.alarm) {
          this.forensicsClue = forensicsResponse.alarmMessage ? 'YOU ARE UNDER ARREST ' + forensicsResponse.alarmMessage : 'YOU ARE UNDER ARREST';
          this.playAlarm(forensicsResponse.alarmMessage);
        } else {
          this.forensicsClue = forensicsResponse.clue;
        }
      }
    }
  }

  makeAnonymous(idx: number): void {
    this.logs[idx].anon = true;
    localStorage.setItem('logs', JSON.stringify(this.logs));
  }

  getClueTest(level: number): void {
    for (let i = 0; i < 1000; i++) {
      const rnd = getRandomInt(1111111111, 9999999999).toString();
      const clue = getRandomClue(rnd, level);
      this.clueTests.push(clue);
    // console.log(clue);
    }
  }

  clearClueTest(): void {
    this.clueTests = [];
  }

  private unauthorised(): void {
    this.unauthorisedTimer--;
    if (this.unauthorisedTimer === 0) {
      this.playAlarm('for unauthorised access');
      clearInterval(this.unauthorisedInterval);
    }
  }

  private playAlarm(arrestFlashMessage = null): void {
    this.arrestFlashDisplayName = this.user?.displayName;
    this.arrestFlashMessage = arrestFlashMessage;
    console.log('person to arrest', this.arrestFlashDisplayName);
    const audio = new Audio('/assets/alarm.mp3');
    try {
      audio.play().then();
    } catch (e) {
      console.log('Alarm failed to play');
    }
    this.showArrestFlash = true;
    this.logout();
    setTimeout(() => {
      this.showArrestFlash = false;
    }, 10000);
  }

  private initSmash(): void {
    this.smashObj = null;
    this.html.addClass('show-smash');
    this.html.removeClass('show-smash-2');
    localStorage.removeItem('smash');
  }

  private smash(): void {

    const smashObj = {
      date: new Date(),
      message: `${this.user.displayName} has broken your computer`
    };

    localStorage.setItem('smash', JSON.stringify(smashObj));
    this.logout();

    const audio = new Audio('/assets/smash.mp3');
    try {
      audio.play().then();
    } catch (e) {
      console.log('Smash failed to play');
    }

    setTimeout(() => {
      this.manageSmash(new Date());
      setTimeout(() => {
        this.smashObj = JSON.parse(localStorage.getItem('smash'));
      }, 5000);
    }, 2000);
  }

  private manageSmash(pWhenSmashed: Date = null): void {
    const now = new Date();
    const whenSmashed = pWhenSmashed || new Date(this.smashObj.date);
    const diffInSecs = differenceInSeconds(now, whenSmashed);

    this.smashSecs = diffInSecs;
    this.html.removeClass('show-smash');
    this.html.addClass('show-smash-2');
    const smashInterval = setInterval(() => {
      const now2 = new Date();
      const diffInSecs2 = differenceInSeconds(now2, whenSmashed);
      this.smashSecs = diffInSecs2;

      if (diffInSecs2 === this.DEFAULT_SMASH_TIME - 3) {
        const audio = new Audio('/assets/wrench.mp3');
        try {
          audio.play().then();
        } catch (e) {
          console.log('Wrench failed to play');
        }
      }

      if (diffInSecs2 > this.DEFAULT_SMASH_TIME) {
        localStorage.removeItem('smash');
        this.html.removeClass('show-smash-2');
        clearInterval(smashInterval);
      }
    }, 1000);
  }

  private manageBlur(): void {
    clearInterval(this.blurInterval);
    this.clue = 'There seems to be some interference with your equipment';
    this.blur = true;
    this.html.addClass('my-blur');
    this.blurInterval = setInterval(() => {
      this.blurCountDown--;
      if (this.blurCountDown === 3) {
        const audio = new Audio('/assets/power-up.mp3');
        try {
          audio.play().then();
        } catch (e) {
          console.log('Power up failed to play');
        }
      }
      if (this.blurCountDown <= 0) {
        this.blurCountDown = null;
        clearInterval(this.blurInterval);
        localStorage.removeItem('blur');
        this.blur = false;
        this.html.removeClass('my-blur');
      }
    }, 1000);
  }
}

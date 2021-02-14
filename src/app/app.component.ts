import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { find } from 'lodash';
import { users } from './users';
import { codes } from './codes';
import { forensicsList } from './forensics';

const DEFAULT_UNAUTHORISED_TIME_ALLOWANCE = 60;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  team = localStorage.getItem('team') ? localStorage.getItem('team') : null;
  isSian = localStorage.getItem('isSian') ? JSON.parse(localStorage.getItem('isSian')) : false;
  user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  failedLoginCount = parseInt(localStorage.getItem('failed') ? JSON.parse(localStorage.getItem('failed')) : 0, 10);
  unauthorisedTimer = DEFAULT_UNAUTHORISED_TIME_ALLOWANCE;
  unauthorisedInterval = null;
  code: string;
  clue: string;
  forensics: string;
  forensicsClue: string;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  private html = $('html');

  constructor() {
    this.unauthorised = this.unauthorised.bind(this);
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

  ngOnInit(): void {
    if (this.team && this.user && this.user?.team !== this.team) {
      this.unauthorisedInterval = setInterval(this.unauthorised, 1000);
    }

    this.isSian = !this.isSian;
    this.toggleLook();
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
    const user = find(users, {name: username, pass: password});
    if (user == null) {
      this.failedLoginCount++;
      if (this.failedLoginCount === 3) {
        this.failedLoginCount = 0;
        this.playAlarm();
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
      } else {
        const codeResponse = codeObj.validate(this.team, this.user);
        if (codeResponse.alarm) {
          this.clue = codeResponse.alarmMessage ? 'YOU ARE UNDER ARREST ' + codeResponse.alarmMessage : 'YOU ARE UNDER ARREST';
          this.playAlarm();
        } else {
          this.clue = codeResponse.clue;
        }
      }
    }
  }

  submitForensics(): void {
    if (this.forensics?.trim() !== '') {
      const forensics = this.forensics;
      this.forensics = '';
      const forensicsObj = find(forensicsList, (code) => {
        console.log(code.code);
        console.log(forensics);
        return code.code.toLowerCase().includes(forensics);
      });
      if (!forensicsObj) {
        this.forensicsClue = 'Could not extract sufficient samples from specimen';
      } else {
        const forensicsResponse = forensicsObj.validate(this.team, this.user);
        if (forensicsResponse.alarm) {
          this.forensicsClue = forensicsResponse.alarmMessage ? 'YOU ARE UNDER ARREST ' + forensicsResponse.alarmMessage : 'YOU ARE UNDER ARREST';
          this.playAlarm();
        } else {
          this.forensicsClue = forensicsResponse.clue;
        }
      }
    }
  }

  private unauthorised(): void {
    this.unauthorisedTimer--;
    if (this.unauthorisedTimer === 0) {
      this.playAlarm();
      clearInterval(this.unauthorisedInterval);
    }
  }

  private playAlarm(): void {
    const audio = new Audio('/assets/alarm.mp3');
    try {
      audio.play().then();
    } catch (e) {
      console.log('Alarm failed to play');
    }
  }
}

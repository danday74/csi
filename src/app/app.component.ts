import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, find, isEqual, reduce, sample, uniq } from 'lodash';
import { users } from './users';
import { codes, getRandomClue } from './codes';
import { forensicsList } from './forensics';
import { differenceInSeconds } from 'date-fns';
import { quizQandA } from './quiz-q-and-a';
import { charSounds, playSound, soundEffects, userSounds } from './audios';

const DEFAULT_UNAUTHORISED_TIME_ALLOWANCE = 60;
const QUESTION_COUNT_PER_CHALLENGE = 5;

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {
  streakAwardCodes = {
    streak3: '4399',
    streak6: '2489',
    streak9: '2031',
    streak12: '0073'
  };
  survPrizeCodes = {
    red: '5489',
    green: '1292',
    blue: '6472'
  };
  exploreCode = '';
  puzzleAnswers = {
    lhs: '',
    rhs: ''
  };
  correctPuzzleAnswers = {
    red: {
      lhs: '8062',
      rhs: '4596'
    },
    green: {
      lhs: '4596',
      rhs: '2529'
    },
    blue: {
      lhs: '2529',
      rhs: '8062'
    }
  };
  wonSurvTrophy = false;
  WRONG_CODES_REQUIRED_FOR_ARREST = 3;
  streak = localStorage.getItem('streak') ? parseInt(localStorage.getItem('streak'), 10) : 0;
  streakCodes = localStorage.getItem('streak-codes') ? JSON.parse(localStorage.getItem('streak-codes')) : [];
  watchingIdx = localStorage.getItem('watching-idx') ? parseInt(localStorage.getItem('watching-idx'), 10) : null;
  survChallenges;
  surveillance = localStorage.getItem('surveillance') ? JSON.parse(localStorage.getItem('surveillance')) : false;
  DEFAULT_SMASH_TIME = 180;
  DEFAULT_BLUR_TIME = 300;
  wrongCodeCount = localStorage.getItem('wrong-code-count') ? JSON.parse(localStorage.getItem('wrong-code-count')) : false;
  users = users;
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
  answers = users.map(() => '');
  blur: boolean;
  blurInterval;
  videos = localStorage.getItem('videos') ? JSON.parse(localStorage.getItem('videos')) : [
    {
      name: 'CSI Game Introduction & Rules',
      url: 'https://youtube.com/embed/RN3bH8bggFc',
      locked: false
    },
    {
      name: 'CSI Game Video Kids',
      url: 'https://youtube.com/embed/FMj23Ec_fS4',
      locked: true
    },
    {
      name: 'The Package',
      url: 'https://youtube.com/embed/Uv6i5ItakfY',
      locked: true
    }
  ];
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  private exploreLocations = ['inside the Elstead bus shelter (near Hookley Lane)', 'the bench outside the Elstead Spar (near Stacey\'s Farm Road)', 'the big sandbank at Woodside Farm river meadow'];

  private html = $('html');

  constructor() {
    this.unauthorised = this.unauthorised.bind(this);
    setInterval(() => {
      this.arrestFlash = !this.arrestFlash;
    }, 500);
  }

  get completedCount(): number {
    const items = this.survChallenges.filter(survChallenge => survChallenge.complete === true);
    if (!this.wonSurvTrophy && items.length === this.users.length) {
      playSound(soundEffects.fanfare);
      this.wonSurvTrophy = true;
    }
    return items.length;
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

    // click quiz arrest none
    const typeCounts = [2, 3, 2, 2, 1, 1];
    const types = ['click', 'quiz', 'arrest', 'sandwich', 'puzzle', 'explore'];
    const myQuizQuestions = cloneDeep(quizQandA);
    let myQuizIndices = myQuizQuestions.map((x, i) => i);

    this.survChallenges = localStorage.getItem('surv-challenges') ? JSON.parse(localStorage.getItem('surv-challenges')) : null;
    if (this.survChallenges == null) {
      this.survChallenges = users.map(() => {
        let type;
        let typeCount;
        do {
          const rnd = getRandomInt(0, typeCounts.length - 1);
          type = types[rnd];
          typeCount = typeCounts[rnd];
        } while (typeCount === 0);

        switch (type) {
          case 'click':
            typeCounts[0]--;
            return {
              type: 'click',
              count: getRandomInt(100, 999),
              complete: false
            };
          case 'quiz':
            typeCounts[1]--;
            const indices = [];
            do {
              const yayIndex = sample(myQuizIndices);
              if (!indices.includes(yayIndex)) {
                indices.push(yayIndex);
              }
            } while (indices.length < QUESTION_COUNT_PER_CHALLENGE);
            myQuizIndices = myQuizIndices.filter((idx) => !indices.includes(idx));

            const questions = indices.map((i) => myQuizQuestions[i].q);
            const answers = indices.map((i) => myQuizQuestions[i].a);
            return {
              type: 'quiz',
              questions,
              answers,
              currentQuestion: 0,
              complete: false
            };
          case 'arrest':
            typeCounts[2]--;
            return {
              type: 'arrest',
              complete: false
            };
          case 'sandwich':
            typeCounts[3]--;
            const fillings = ['apple', 'cheese', 'crisps', 'cucumber', 'jam', 'lettuce', 'marmite', 'mayonnaise', 'onion', 'peanut butter', 'pickle', 'tomato', 'tuna'];
            let fillings1;
            let fillings2;
            let fillings3;
            do {
              fillings1 = uniq([sample(fillings), sample(fillings), sample(fillings)]);
              fillings2 = uniq([sample(fillings), sample(fillings), sample(fillings)]);
              fillings3 = uniq([sample(fillings), sample(fillings), sample(fillings)]);
            } while (isEqual(fillings1.sort(), fillings2.sort()) || isEqual(fillings1.sort(), fillings3.sort())
            || isEqual(fillings2.sort(), fillings3.sort()) || fillings1.length !== 3 || fillings2.length !== 3 || fillings3.length !== 3);

            return {
              type: 'sandwich',
              menu: [fillings1, fillings2, fillings3],
              menuOptionsCount: getRandomInt(2, 3),
              code6: null,
              complete: false
            };
          case 'puzzle':
            typeCounts[4]--;
            return {
              type: 'puzzle',
              lhsComplete: false,
              rhsComplete: false,
              complete: false
            };
          case 'explore':
            typeCounts[5]--;
            const location = sample(this.exploreLocations);
            this.exploreLocations = this.exploreLocations.filter((xpLocation) => location !== xpLocation);
            return {
              type: 'explore',
              location,
              complete: false
            };
          default:
            throw Error('unknown challenge type');
        }
      });
      localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
    }

    const blurNow = new Date();
    const blurDate = localStorage.getItem('blur') ? new Date(localStorage.getItem('blur')) : null;
    if (blurDate) {
      const blurDiffInSecs = this.DEFAULT_BLUR_TIME - differenceInSeconds(blurNow, blurDate);
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
      this.surveillance = false;
      localStorage.setItem('surveillance', JSON.stringify(this.surveillance));
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

      const myUserSounds = reduce(userSounds, (acc, v, k) => {
        if (k.startsWith(user.name)) {
          acc.push(v);
        }
        return acc;
      }, []);
      const myCharSounds = reduce(charSounds, (acc, v, k) => {
        if (user.characteristics.includes(k)) {
          acc.push(v);
        }
        return acc;
      }, []);
      const audio = sample([...myUserSounds, ...myCharSounds]);
      playSound(audio);
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
    if (/^[0-9]{4}$/.test(this.code)) {
      let logEntry;
      const code = this.code;
      const codeObj = find(codes, {code});
      if (!codeObj) {
        this.clue = 'Invalid code';
        logEntry = {code, user: this.user.displayName, team: this.user.team, alarm: false, clue: false, anon: false};
        this.wrongCodeCount++;
        this.streak = 0;
        if (this.wrongCodeCount === this.WRONG_CODES_REQUIRED_FOR_ARREST) {
          this.wrongCodeCount = 0;
          this.playAlarm('for hacking because of too many consecutive invalid codes');
        }
      } else {
        this.wrongCodeCount = 0;
        const codeResponse = codeObj.validate(this.team, this.user);
        if (codeResponse.alarm) {
          this.streak = 0;
          this.clue = codeResponse.alarmMessage ? 'YOU ARE UNDER ARREST ' + codeResponse.alarmMessage : 'YOU ARE UNDER ARREST';
          logEntry = {code, user: this.user.displayName, team: this.user.team, alarm: true, clue: false, anon: false};
          this.playAlarm(codeResponse.alarmMessage);
        } else if (codeResponse.smash) {
          this.streak = 0;
          logEntry = {code, user: this.user.displayName, team: this.user.team, alarm: false, clue: false, anon: false};
          this.initSmash();
        } else if (codeResponse.blur) {
          logEntry = {code, user: this.user.displayName, team: this.user.team, alarm: false, clue: false, anon: false};
          localStorage.setItem('blur', new Date().toString());
          this.blurCountDown = this.DEFAULT_BLUR_TIME;
          playSound(soundEffects.powerDown);
          this.manageBlur(codeResponse.clue);
          if (codeResponse.clue && !this.streakCodes.includes(code)) {
            this.streak++;
            this.streakCodes.push(code);
          }
        } else {
          if (!this.streakCodes.includes(code)) {
            this.streak++;
            this.streakCodes.push(code);
          }
          this.clue = codeResponse.clue;
          logEntry = {code, user: this.user.displayName, team: this.user.team, alarm: false, clue: true, anon: false};
          if (this.code === '2950') {
            this.videos[1].locked = false;
          }
          if (this.code === '9468') {
            this.videos[2].locked = false;
          }
        }
      }
      if (logEntry && (!this.logs.length || this.logs[0].code !== code)) {
        this.logs.unshift(logEntry);
      }
      localStorage.setItem('logs', JSON.stringify(this.logs));
      localStorage.setItem('wrong-code-count', this.wrongCodeCount);
      localStorage.setItem('streak', this.streak.toString());
      localStorage.setItem('streak-codes', JSON.stringify(this.streakCodes));
      localStorage.setItem('videos', JSON.stringify(this.videos));
    }
    this.code = '';
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
    }
  }

  clearClueTest(): void {
    this.clueTests = [];
  }

  toggleSurveillance(): void {
    this.surveillance = !this.surveillance;
    localStorage.setItem('surveillance', JSON.stringify(this.surveillance));
  }

  challengeClick(i: number): void {
    const challenge = this.survChallenges[i];
    challenge.count--;
    if (challenge.count <= 0) {
      challenge.complete = true;
    }
    localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
  }

  challengeQuiz(i: number): void {
    const ans = this.answers[this.watchingIdx];
    const challenge = this.survChallenges[i];
    const currentQuestion = challenge.currentQuestion;
    let correct = true;
    challenge.answers[currentQuestion].forEach((pAns) => {
      if (!ans.toLowerCase().includes(pAns.toLowerCase())) {
        correct = false;
      }
    });
    if (correct) {
      if (currentQuestion === QUESTION_COUNT_PER_CHALLENGE - 1) {
        challenge.complete = true;
      } else {
        challenge.currentQuestion++;
      }
      localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
    } else {
      this.playAlarm('for giving false information (or atrocious spelling)');
    }
    this.answers[this.watchingIdx] = null;
  }

  playSound(value: string): void {
    const audio = userSounds[value] || charSounds[value];
    if (audio) {
      playSound(audio);
    }
  }

  watching(i: number): void {
    this.watchingIdx = i;
    localStorage.setItem('watching-idx', i.toString());
  }

  arrestMe(): void {
    this.survChallenges[this.watchingIdx].complete = true;
    localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
    this.playAlarm('for sticking out their tongue at a policeman');
  }

  submitSandwich(): void {
    const code = this.survChallenges[this.watchingIdx].code6;
    const initials = users[this.watchingIdx].displayName.split(' ').map(x => x[0]);
    const expectedCode = `${initials[0]}8679${initials[1]}`;
    if (code) {
      if (code.toLowerCase() === expectedCode.toLowerCase()) {
        this.survChallenges[this.watchingIdx].complete = true;
        localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
      }
    }
    this.survChallenges[this.watchingIdx].code6 = null;
  }

  submitPuzzleAnswer(side: string): void {

    const expectedLhsAnswer = this.correctPuzzleAnswers[this.team].lhs;
    const expectedRhsAnswer = this.correctPuzzleAnswers[this.team].rhs;

    // tslint:disable-next-line:max-line-length
    if ((side === 'lhs' && !this.survChallenges[this.watchingIdx].lhsComplete) || side === 'rhs' && !this.survChallenges[this.watchingIdx].rhsComplete) {

      if (side === 'lhs') {
        const actualLhsAnswer = this.puzzleAnswers.lhs;
        if (actualLhsAnswer === expectedLhsAnswer) {
          this.survChallenges[this.watchingIdx].lhsComplete = true;
        }
        this.puzzleAnswers.lhs = '';
      }
      if (side === 'rhs') {
        const actualRhsAnswer = this.puzzleAnswers.rhs;
        if (actualRhsAnswer === expectedRhsAnswer) {
          this.survChallenges[this.watchingIdx].rhsComplete = true;
        }
        this.puzzleAnswers.rhs = '';
      }
      if (this.survChallenges[this.watchingIdx].lhsComplete && this.survChallenges[this.watchingIdx].rhsComplete) {
        this.survChallenges[this.watchingIdx].complete = true;
      }

      localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
    }
  }

  submitExploreCode(): void {
    if (this.exploreCode === '9029') {
      this.survChallenges[this.watchingIdx].complete = true;
      localStorage.setItem('surv-challenges', JSON.stringify(this.survChallenges));
    }
    this.exploreCode = '';
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
    playSound(soundEffects.alarm);
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

    playSound(soundEffects.smash);

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
        playSound(soundEffects.wrench);
      }

      if (diffInSecs2 > this.DEFAULT_SMASH_TIME) {
        localStorage.removeItem('smash');
        this.html.removeClass('show-smash-2');
        clearInterval(smashInterval);
      }
    }, 1000);
  }

  private manageBlur(blurMessage: string = null): void {
    clearInterval(this.blurInterval);
    this.clue = blurMessage || 'There seems to be some interference with your equipment';
    this.blur = true;
    this.html.addClass('my-blur');
    this.blurInterval = setInterval(() => {
      this.blurCountDown--;
      if (this.blurCountDown === 3) {
        playSound(soundEffects.powerUp);
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

import { users } from './users';
import { capitalize, filter, find, isEqual, memoize, sample, uniqBy } from 'lodash';
import * as replaceLast from 'replace-last/index';
import { IClue } from './interfaces/i-clue';
import { playSound, soundEffects } from './audios';

const isNumeric = (value): boolean => {
  return /^-?\d+$/.test(value);
};

const getRandomIndices = (worth: number, clues: Array<string>): Array<number> => {
  const arr = [];
  while (arr.length < worth) {
    const r = Math.floor(Math.random() * clues.length);
    if (arr.indexOf(r) === -1) {
      arr.push(r);
    }
  }
  return arr;
};

// worth 1-8 returns that much data
// worth 9 returns name
export const getRandomClue = memoize((code: string, worth: number): { clue: string, matches: number, level: number } => {

  const storedClues = JSON.parse(localStorage.getItem('clues')) || {};
  const storedClue = storedClues[code];
  if (storedClue) {
    return {
      clue: storedClue,
      matches: null,
      level: worth
    };
  } else {
    const innocentUsers = filter(users, {innocent: true});
    const user = sample(innocentUsers);
    if (worth === 9) {
      const result = `${user.displayName} has an alibi and is innocent`;
      if (code.length === 4 || !isNumeric(code)) {
        storedClues[code] = result;
        localStorage.setItem('clues', JSON.stringify(storedClues));
      }
      return {
        clue: result,
        matches: 1,
        level: worth
      };
    } else if (worth >= 0 && worth <= 8) {
      const clues = [];
      clues.push(`is on the ${user.team} team`);
      clues.push(`has the career ${user.career}`);
      const characteristic1 = user.characteristics[0];
      clues.push(`has the ${characteristic1} characteristic`);
      const characteristic2 = user.characteristics[1];
      clues.push(`has the ${characteristic2} characteristic`);
      clues.push(`fights with a ${user.weapon}`);
      clues.push(`has a pet ${user.pet}`);
      clues.push(`loves to go ${user.hobby}`);
      clues.push(`has the fruit ${user.fruit}`);
      const banter = sample(user.banter);
      clues.push(banter);

      const indices = getRandomIndices(worth, clues);
      // IMPORTANT MUST MATCH THE ORDER OF CLUES ABOVE
      const usrs = users.filter((usr) => {
        let match = true;
        if (indices.includes(0)) {
          match = match && usr.team === user.team;
        }
        if (indices.includes(1)) {
          match = match && usr.career === user.career;
        }
        if (indices.includes(2)) {
          match = match && usr.characteristics.includes(characteristic1);
        }
        if (indices.includes(3)) {
          match = match && usr.characteristics.includes(characteristic2);
        }
        if (indices.includes(4)) {
          match = match && usr.weapon === user.weapon;
        }
        if (indices.includes(5)) {
          match = match && usr.pet === user.pet;
        }
        if (indices.includes(6)) {
          match = match && usr.hobby === user.hobby;
        }
        if (indices.includes(7)) {
          match = match && usr.fruit === user.fruit;
        }
        if (indices.includes(8)) {
          match = match && usr.banter.includes(banter);
        }
        return match;
      });

      const results = indices.map((idx) => clues[idx]);
      let result = 'An innocent person ' + results.join(', ');
      result = replaceLast(result, ',', ' and');
      if (code.length === 4 || !isNumeric(code)) {
        storedClues[code] = result;
        localStorage.setItem('clues', JSON.stringify(storedClues));
      }

      return {
        clue: result,
        matches: usrs.length,
        level: worth
      };
    }
  }
  return null;
});

const validateDeptIdCode = (team, code, myTeam, verse): IClue => {
  const randomClue = getRandomClue(code, 9).clue;
  const clueRightComputer = `${verse} is correct well done - ` + randomClue;
  const clueWrongComputer = `${verse} is correct well done, but you must login on the ${myTeam} computer to use this code`;
  const clue = team === myTeam ? clueRightComputer : clueWrongComputer;
  return {
    clue,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur: false
  };
};

const validateTeamCode = (team, user, code, myTeam): IClue => {
  const clue = `${capitalize(myTeam)} team code - ` + getRandomClue(code, 2).clue;
  const alarm = team !== myTeam && user.team !== myTeam;
  return {
    clue,
    alarm,
    alarmMessage: `for espionage by attempting to access the ${myTeam} teams clue on ${team}s computer`,
    smash: false,
    blur: false
  };
};

const validateBox = (code: number): IClue => {
  return {
    clue: `You have found a key! Ask Lou Tennant for it quoting code ${code} and you shall receive (unless someone else beat you to it)`,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur: false
  };
};

const validateTeamSpecificRedHerring = (user, myTeam): IClue => {
  const alarm = user.team !== myTeam;
  return {
    clue: 'This code is a red herring, if it is used on any other teams computer then the person who entered it will get arrested',
    alarm,
    alarmMessage: 'for using a red herring code',
    smash: false,
    blur: false
  };
};

const validateSmash = (user, myTeam): IClue => {
  const smash = user.team !== myTeam;
  return {
    clue: 'When used on another teams computer, this code will break their computer for 3 minutes. When entered it will log the user out immediately. The next person to touch it breaks it. Sit back and wait!',
    alarm: false,
    alarmMessage: null,
    smash,
    blur: false
  };
};

const validateBlur = (user, myTeam): IClue => {
  const blur = user.team !== myTeam;
  const clue = blur ? null : 'When used on another teams computer, this code will cause interference for 5 minutes, rendering the computer almost unusable';
  return {
    clue,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur
  };
};

const validateAlarm = (alarmMessage: string): IClue => {
  return {
    clue: null,
    alarm: true,
    alarmMessage,
    smash: false,
    blur: false
  };
};

const validateAlarmGuess = (): IClue => {
  return validateAlarm('for hacking because they randomly guessed a code');
};

const validateClue = (code: string, level: number): IClue => {
  const clue = getRandomClue(code, level).clue;
  return {
    clue,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur: false
  };
};

const validateMessage = (message: string): IClue => {
  return {
    clue: message,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur: false
  };
};

export const codes: Array<{ code: string, validate: (team: string, user: any) => IClue }> = [
  // team codes * 3 - alarm if not on red team and not on red computer
  {
    code: '1402',
    validate(team: string, user: any): IClue {
      return validateTeamCode(team, user, this.code, 'red');
    }
  },
  {
    code: '1643',
    validate(team: string, user: any): IClue {
      return validateTeamCode(team, user, this.code, 'green');
    }
  },
  {
    code: '3692',
    validate(team: string, user: any): IClue {
      return validateTeamCode(team, user, this.code, 'blue');
    }
  },
  // department id codes * 3 - no alarm
  {
    code: '5000',
    validate(team: string): IClue {
      return validateDeptIdCode(team, this.code, 'red', 'Luke 9:14');
    }
  },
  {
    code: '1365',
    validate(team: string): IClue {
      return validateDeptIdCode(team, this.code, 'green', 'Numbers 3:50');
    }
  },
  {
    code: '4000',
    validate(team: string): IClue {
      return validateDeptIdCode(team, this.code, 'blue', 'Mark 8:9');
    }
  },
  // starter pack box keys - no alarm
  {
    code: '8563',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  {
    code: '8764',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  {
    code: '3265',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  // team specific red herring * 3 - alarm if not on red team
  {
    code: '0645',
    validate(team: string, user: any): IClue {
      return validateTeamSpecificRedHerring(user, 'red');
    }
  },
  {
    code: '8562',
    validate(team: string, user: any): IClue {
      return validateTeamSpecificRedHerring(user, 'green');
    }
  },
  {
    code: '1654',
    validate(team: string, user: any): IClue {
      return validateTeamSpecificRedHerring(user, 'blue');
    }
  },
  // forensics - bible
  {
    code: '7337',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '5962',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '7632',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  // forensics - scrap
  {
    code: '1974',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  // forensics - wiper
  {
    code: '4910',
    validate(): IClue {
      const clue = getRandomClue(this.code, 9).clue;
      return {
        clue: 'Hoping to learn something new, you turn the brain wiper on yourself and fire. Your brain is wiped (although no-one can tell the difference) and your vision goes blurry. A side effect of using the brain wiper is that it has imparted some new knowledge to you. You somehow just know that ' + clue + '.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: true
      };
    }
  },
  // box codes
  {
    code: '8532', // box 3, 9, 11
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '8480', // box 8
    validate(): IClue {
      return validateClue(this.code, 9);
    }
  },
  {
    code: '4008', // box 1, 6, 15
    validate(): IClue {
      return validateClue(this.code, 9);
    }
  },
  // scb
  {
    code: '3221',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '4865',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  // photos
  {
    code: '7531',
    validate(): IClue {
      return validateAlarm('for using a red herring code (the fish in the photo was a red herring)');
    }
  },
  // video 1
  {
    code: '3001',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '4142',
    validate(): IClue {
      return validateClue(this.code, 9);
    }
  },
  {
    code: '1231',
    validate(): IClue {
      return validateClue(this.code, 3);
    }
  },
  {
    code: '9258',
    validate(): IClue {
      return validateClue(this.code, 1);
    }
  },
  {
    code: '8801',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  // video 2
  {
    code: '1558',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '5584',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '7529',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '5972',
    validate(): IClue {
      return validateClue(this.code, 3);
    }
  },
  {
    code: '2795',
    validate(): IClue {
      return validateClue(this.code, 4);
    }
  },
  {
    code: '9257',
    validate(): IClue {
      return validateClue(this.code, 4);
    }
  },
  // video 3
  {
    code: '0750',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '4841',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '3431',
    validate(): IClue {
      return validateClue(this.code, 3);
    }
  },
  // blue rectangle
  {
    code: '5184',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  // surveillance complete
  {
    code: '5489',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  {
    code: '1292',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  {
    code: '6472',
    validate(): IClue {
      return validateBox(this.code);
    }
  },
  // sabotage codes
  {
    code: '6833',
    validate(team: string, user: any): IClue {
      return validateSmash(user, 'red');
    }
  },
  {
    code: '6656',
    validate(team: string, user: any): IClue {
      return validateSmash(user, 'green');
    }
  },
  {
    code: '6827',
    validate(team: string, user: any): IClue {
      return validateSmash(user, 'blue');
    }
  },
  // interference codes
  {
    code: '8404',
    validate(team: string, user: any): IClue {
      return validateBlur(user, 'red');
    }
  },
  {
    code: '9664',
    validate(team: string, user: any): IClue {
      return validateBlur(user, 'green');
    }
  },
  {
    code: '4599',
    validate(team: string, user: any): IClue {
      return validateBlur(user, 'blue');
    }
  },
  // streaks
  {
    code: '4399',
    validate(): IClue {
      return validateClue(this.code, 1);
    }
  },
  {
    code: '2489',
    validate(): IClue {
      return validateClue(this.code, 2);
    }
  },
  {
    code: '2031',
    validate(): IClue {
      return validateClue(this.code, 3);
    }
  },
  {
    code: '0073',
    validate(): IClue {
      playSound(soundEffects.clap);
      const clue = getRandomClue(this.code, 9).clue;
      return {
        clue: `You are on a winning streak. Your skills have helped prove that ${clue}. There is a trail of footprints leading away from the clue.`,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  // unlock message
  {
    code: '2950',
    validate(): IClue {
      return validateMessage('Video 2 Unlocked - CSI Game Video Kids');
    }
  },
  {
    code: '9468',
    validate(): IClue {
      return validateMessage('Video 3 Unlocked - The Package');
    }
  },
  // guesses
  {
    code: '0000',
    validate(): IClue {
      const clue = getRandomClue(this.code, 2).clue;
      return {
        clue: 'Works every time - ' + clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: '0634',
    validate(): IClue {
      const clue = getRandomClue(this.code, 2).clue;
      return {
        clue: 'Works every time - ' + clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: '1111',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '2222',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '3333',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '4444',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '5555',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '6666',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '7777',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '8888',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '9999',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '1000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '2000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '3000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '6000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '7000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '8000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '9000',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '1234',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '2345',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '3456',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '4567',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '5678',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '6789',
    validate(): IClue {
      return validateAlarmGuess();
    }
  },
  {
    code: '7890',
    validate(): IClue {
      return validateAlarmGuess();
    }
  }
];

// agent id codes * 3 - alarm if not the same career
const added = {
  3276: false,
  5819: false,
  9997: false,
  9998: false // special code for grey team agent id
};

users.forEach(myUser => {
  const parts = myUser.agentId.split('-');
  const agentSum = parseInt(parts[0], 10) - parseInt(parts[1], 10);
  if (!added[agentSum] || !find(codes, {code: agentSum.toString()})) {
    added[agentSum] = true;
    codes.push(
      {
        code: agentSum.toString(),
        validate(team: string, user: any): any {
          const clue = getRandomClue(this.code, 2).clue;
          const alarm = (myUser.career !== user.career) && this.code !== '9998';
          return {
            clue,
            alarm,
            alarmMessage: 'for espionage by attempting to access a different users clue',
            smash: false
          };
        }
      }
    );
  }
});

const uniqueCodes = uniqBy(codes, 'code');

if (!isEqual(codes.length, uniqueCodes.length)) {
  throw Error('duplicate codes');
}

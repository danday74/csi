import { users } from './users';
import { capitalize, filter, find, isEqual, memoize, sample, uniqBy } from 'lodash';
import * as replaceLast from 'replace-last/index';
import { IClue } from './interfaces/i-clue';

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
    return storedClue;
  } else {
    const innocentUsers = filter(users, {innocent: true});
    const user = sample(innocentUsers);
    if (worth === 9) {
      const result = `${user.displayName} has an alibi and is innocent`;
      if (code.length === 4) {
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
      if (code.length === 4) {
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
  const clueRightComputer = `${verse} is correct well done - ` + getRandomClue(code, 9).clue;
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

const validateGift = (code, gift): IClue => {
  return {
    clue: `Say the code ${code} to an official and they will give you ${gift}`,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur: false
  };
};

const validateTeamSpecificRedHerring = (user, myTeam): IClue => {
  const alarm = user.team !== myTeam;
  return {
    clue: 'This code is a red herring, if any other team uses it then they will get arrested',
    alarm,
    alarmMessage: 'for using a red herring code',
    smash: false,
    blur: false
  };
};

const validateSmash = (): IClue => {
  return {
    clue: null,
    alarm: false,
    alarmMessage: null,
    smash: true,
    blur: false
  };
};

const validateBlur = (): IClue => {
  return {
    clue: null,
    alarm: false,
    alarmMessage: null,
    smash: false,
    blur: true
  };
};

export const codes: Array<{ code: string, validate: (team: string, user: any) => IClue }> = [
  // team codes * 3 - alarm if not on red team and not on red computer
  {
    code: '1402',
    validate(team: string, user: any): any {
      return validateTeamCode(team, user, this.code, 'red');
    }
  },
  {
    code: '1643',
    validate(team: string, user: any): any {
      return validateTeamCode(team, user, this.code, 'green');
    }
  },
  {
    code: '3692',
    validate(team: string, user: any): any {
      return validateTeamCode(team, user, this.code, 'blue');
    }
  },
  // department id codes * 3 - no alarm
  {
    code: '5000',
    validate(team: string): any {
      return validateDeptIdCode(team, this.code, 'red', 'Luke 9:14');
    }
  },
  {
    code: '1365',
    validate(team: string): any {
      return validateDeptIdCode(team, this.code, 'green', 'Numbers 3:50');
    }
  },
  {
    code: '4000',
    validate(team: string): any {
      return validateDeptIdCode(team, this.code, 'blue', 'Mark 8:9');
    }
  },
  // get out of jail free * 3 - no alarm
  {
    code: '8563',
    validate(): any {
      return validateGift(this.code, 'a get out of jail free card');
    }
  },
  {
    code: '8764',
    validate(): any {
      return validateGift(this.code, 'a get out of jail free card');
    }
  },
  {
    code: '3265',
    validate(): any {
      return validateGift(this.code, 'a get out of jail free card');
    }
  },
  // team specific red herring * 3 - alarm if not on red team
  {
    code: '0645',
    validate(team: string, user: any): any {
      return validateTeamSpecificRedHerring(user, 'red');
    }
  },
  {
    code: '8562',
    validate(team: string, user: any): any {
      return validateTeamSpecificRedHerring(user, 'green');
    }
  },
  {
    code: '1654',
    validate(team: string, user: any): any {
      return validateTeamSpecificRedHerring(user, 'blue');
    }
  },
  {
    code: '1111',
    validate(): any {
      return validateSmash();
    }
  },
  {
    code: '2222',
    validate(): any {
      return validateBlur();
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

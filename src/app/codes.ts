import { users } from './users';
import { capitalize, filter, find, isEqual, memoize, sample, uniqBy } from 'lodash';
import * as replaceLast from 'replace-last/index';

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

// worth 1-7 returns that much data
// worth 9 returns name
export const getRandomClue = memoize((code: string, worth: number): string => {

  const storedClues = JSON.parse(localStorage.getItem('clues')) || {};
  const storedClue = storedClues[code];
  if (storedClue) {
    return storedClue;
  } else {
    const innocentUsers = filter(users, {innocent: true});
    const user = sample(innocentUsers);
    if (worth === 9) {
      const result = `${user.displayName} has an alibi and is innocent`;
      storedClues[code] = result;
      localStorage.setItem('clues', JSON.stringify(storedClues));
      return result;
    } else if (worth >= 0 && worth <= 8) {
      const clues = [];
      clues.push(`is on the ${user.team} team`);
      clues.push(`has the career ${user.career}`);
      const characteristic1 = user.characteristics[0];
      clues.push(`has the ${characteristic1} characteristic`);
      const characteristic2 = user.characteristics[0];
      clues.push(`has the ${characteristic2} characteristic`);
      clues.push(`fights with a ${user.weapon}`);
      clues.push(`has a pet ${user.pet}`);
      clues.push(`loves to go ${user.hobby}`);
      const banter = sample(user.banter);
      clues.push(banter);
      const indices = getRandomIndices(worth, clues);
      const results = indices.map((idx) => clues[idx]);
      let result = 'An innocent person ' + results.join(', ');
      result = replaceLast(result, ',', ' and');
      storedClues[code] = result;
      localStorage.setItem('clues', JSON.stringify(storedClues));
      return result;
    }
  }
  return null;
});

const validateDeptIdCode = (team, code, myTeam, verse) => {
  const clueRightComputer = `${verse} is correct well done - ` + getRandomClue(code, 9);
  const clueWrongComputer = `${verse} is correct well done, but you must login on the ${myTeam} computer to use this code`;
  const clue = team === myTeam ? clueRightComputer : clueWrongComputer;
  return {
    clue,
    alarm: false,
    alarmMessage: null
  };
};

const validateTeamCode = (team, user, code, myTeam) => {
  const clue = `${capitalize(myTeam)} team clue - ` + getRandomClue(code, 2);
  const alarm = team !== myTeam && user.team !== myTeam;
  return {
    clue,
    alarm,
    alarmMessage: `for espionage by attempting to access the ${myTeam} teams clue on ${team}s computer`
  };
};

const validateGift = (code, gift) => {
  return {
    clue: `Say the code ${code} to an official and they will give you ${gift}`,
    alarm: false,
    alarmMessage: null
  };
};

const validateTeamSpecificRedHerring = (user, myTeam) => {
  const alarm = user.team !== myTeam;
  return {
    clue: 'This code is a red herring, if any other team uses it then they will get arrested',
    alarm,
    alarmMessage: 'for using a red herring code'
  };
};

export const codes = [
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
  }
];

// agent id codes * 3 - alarm if not the same career
const added = {
  3276: false,
  5819: false,
  9997: false
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
          const clue = getRandomClue(this.code, 2);
          const alarm = myUser.career !== user.career;
          return {
            clue,
            alarm,
            alarmMessage: 'for espionage by attempting to access a different users clue'
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

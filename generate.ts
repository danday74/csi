// @ts-ignore
// import { users } from './src/app/users';
let users;
// @ts-ignore
const _ = require('lodash');
const replaceLast = require('replace-last');
// @ts-ignore
const fs = require('fs');

// const MODE = 'sample'; // dice
// const MODE = 'take-one';
const MODE = 'take-one-strict'; // hat

let wroteToFile = false;

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
const getRandomClue = _.memoize((code: string, worth: number): { clue: string, matches: number, level: number } => {

  const storedClues = {};
  const storedClue = storedClues[code];
  if (storedClue) {
    return storedClue;
  } else {
    const innocentUsers = _.filter(users, {innocent: true});
    const user = _.sample(innocentUsers);
    if (worth === 9) {
      const result = `${user.displayName} has an alibi and is innocent`;
      if (code.length === 4) {
        storedClues[code] = result;
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
      const banter = _.sample(user.banter);
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

const clueTestCount = (level, clueTests: any[]): number => {
  const clues = clueTests.filter(clue => clue.level === level);
  return clues.length;
};

const clueTestUsefulCount = (level, clueTests): number => {
  const clues = clueTests.filter(clue => clue.level === level && clue.matches === 1);
  return clues.length;
};

const clueTestPercentUseful = (level, clueTests): number => {
  const count = clueTestCount(level, clueTests);
  if (count === 0) {
    return 0;
  }
  const usefulCount = clueTestUsefulCount(level, clueTests);
  return 100 / count * usefulCount;
};

const getClueTests = (level: number): any[] => {
  const clueTests = [];
  for (let i = 0; i < 5000; i++) {
    const rnd = getRandomInt(1111111111, 9999999999).toString();
    const clue = getRandomClue(rnd, level);
    clueTests.push(clue);
  }
  return clueTests;
};

const getArray = (weightedArray) => {
  return weightedArray.reduce((acc, characteristic) => {
    for (let i = 0; i < characteristic.weight; i++) {
      acc.push(characteristic.name);
    }
    return acc;
  }, []);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

console.log('MODE = ' + (MODE.startsWith('take-one') ? 'HAT' : 'DICE'));
console.log();

const generate = () => {
  users = [
    // RED TEAM
    {
      name: 'elene',
      displayName: 'Iona Lott',
      pass: '',
      team: 'red',
      career: 'interrogator',
      agentId: '13276-10000',
      deptId: 'LK9-14',
      characteristics: ['rich'],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    {
      name: 'keziah',
      displayName: 'Iva Pencil',
      pass: '',
      team: 'red',
      career: 'analyst',
      agentId: '269877552-269867555',
      deptId: 'LK9-14',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    {
      name: 'maria',
      displayName: 'Ma WeeOui',
      pass: '',
      team: 'red',
      career: 'forensics',
      agentId: '58342-52523',
      deptId: 'LK9-14',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    // GREEN TEAM
    {
      name: 'graham',
      displayName: 'Joe Kerr',
      pass: '',
      team: 'green',
      career: 'interrogator',
      agentId: '14867-11591',
      deptId: 'NB3-50',
      characteristics: ['joker'],
      weapon: '',
      pet: '',
      hobby: 'kayaking',
      fruit: '',
      banter: [],
      innocent: true
    },
    {
      name: 'peter',
      displayName: 'Robin Banks',
      pass: '',
      team: 'green',
      career: 'analyst',
      agentId: '10000-3',
      deptId: 'NB3-50',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    {
      name: 'winnie',
      displayName: 'Anna Fender',
      pass: '',
      team: 'green',
      career: 'forensics',
      agentId: '34719-28900',
      deptId: 'NB3-50',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    // BLUE TEAM
    {
      name: 'mary',
      displayName: 'Mona Lott',
      pass: '',
      team: 'blue',
      career: 'interrogator',
      agentId: '62913-59637',
      deptId: 'MK8-9',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    {
      name: 'dean',
      displayName: 'Micky Takerman',
      pass: '',
      team: 'blue',
      career: 'analyst',
      agentId: '58436-48439',
      deptId: 'MK8-9',
      characteristics: ['overly optimistic', 'starer'],
      weapon: '',
      pet: '',
      hobby: 'dirt biking',
      fruit: '',
      banter: [],
      innocent: false
    },
    {
      name: 'ivo',
      displayName: 'Phil McCavity',
      pass: '',
      team: 'blue',
      career: 'forensics',
      agentId: '25684-19865',
      deptId: 'MK8-9',
      characteristics: [],
      weapon: '',
      pet: 'dog',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    // GREY TEAM / OFFICIALS
    {
      name: 'dan',
      displayName: 'Guard Ian',
      pass: null,
      team: 'grey',
      career: 'official',
      agentId: '10000-2',
      deptId: 'JN3-16',
      characteristics: ['normal'],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    },
    {
      name: 'sian',
      displayName: 'Lou Tennant',
      pass: null,
      team: 'grey',
      career: 'official',
      agentId: '9999-1',
      deptId: 'JN3-16',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      fruit: '',
      banter: [],
      innocent: true
    }
  ];

  // SAMPLE WEIGHTS

  const sampleCharacteristics = [
    {name: 'normal', weight: 10},
    {name: 'clumsy', weight: 3}, // SOUND
    {name: 'huggy', weight: 2},
    {name: 'nervous twitch', weight: 2},
    {name: 'overly optimistic', weight: 1}, // +1
    {name: 'joker', weight: 2}, // +1 // SOUND
    {name: 'narcoleptic', weight: 2}, // SOUND
    {name: 'rich', weight: 2}, // +1 // SOUND
    {name: 'starer', weight: 1}, // +1
    {name: 'limp', weight: 2},
    {name: 'COVID-19', weight: 3} // SOUND
  ];

  const sampleWeapons = [
    {name: 'gun', weight: 2},
    {name: 'catapult', weight: 2},
    {name: 'boomerang', weight: 1}
  ];

  const samplePets = [
    {name: 'cat', weight: 3},
    {name: 'dog', weight: 3},
    {name: 'rabbit', weight: 2},
    {name: 'lizard', weight: 1}
  ];

  const sampleHobbies = [
    {name: 'climbing', weight: 3},
    {name: 'dirt biking', weight: 2},
    {name: 'kayaking', weight: 1},
    {name: 'fencing', weight: 1}
  ];

  // const sampleFruits = [
  //   {name: 'love', weight: 1},
  //   {name: 'joy', weight: 1},
  //   {name: 'peace', weight: 1}
  // ]

  // TAKE ONE WEIGHTS

  // should total 17 = 22 - Graham's one - Elene's one - Dan's one - Dean's two
  const takeOneCharacteristics = [
    {name: 'normal', weight: 5}, // +1
    {name: 'clumsy', weight: 2}, // SOUND
    {name: 'huggy', weight: 1},
    {name: 'nervous twitch', weight: 1},
    {name: 'overly optimistic', weight: 1}, // +1
    {name: 'joker', weight: 1}, // +1 // SOUND
    {name: 'narcoleptic', weight: 1}, // SOUND
    {name: 'rich', weight: 1}, // +1 // SOUND
    {name: 'starer', weight: 1}, // +1
    {name: 'limp', weight: 1},
    {name: 'COVID-19', weight: 2} // SOUND
  ];

  // should total 11
  const takeOneWeapons = [
    {name: 'gun', weight: 5},
    {name: 'catapult', weight: 4},
    {name: 'boomerang', weight: 2}
  ];

  // should total 10 = 11 - Ivo's dog
  const takeOnePets = [
    {name: 'cat', weight: 5},
    {name: 'dog', weight: 5}, // +1
    {name: 'rabbit', weight: 0},
    {name: 'lizard', weight: 0}
  ];

  // should total 9 = 11 - Graham's one - Dean's one
  const takeOneHobbies = [
    {name: 'climbing', weight: 0},
    {name: 'dirt biking', weight: 5}, // +1
    {name: 'kayaking', weight: 4}, // +1
    {name: 'fencing', weight: 0}
  ];

  // should total 11
  const takeOneFruits = [
    {name: 'love', weight: 4},
    {name: 'joy', weight: 3},
    {name: 'peace', weight: 4}
  ];

  // @ts-ignore
  const weightedCharacteristics = (MODE === 'sample') ? sampleCharacteristics : takeOneCharacteristics;
  // @ts-ignore
  const weightedWeapons = (MODE === 'sample') ? sampleWeapons : takeOneWeapons;
  // @ts-ignore
  const weightedPets = (MODE === 'sample') ? samplePets : takeOnePets;
  // @ts-ignore
  const weightedHobbies = (MODE === 'sample') ? sampleHobbies : takeOneHobbies;
  const weightedFruits = takeOneFruits;

  const banters = [
    'holds a world record',
    'discovered the long eared sloth',
    'survived a house fire',
    'is the ex president of Timbuktu',
    'won the nobel peace prize',
    'sleeps upside down',
    'climbed mount Everest',
    'failed their driving test 37 times',
    'once turned orange after eating too many carrots',
    'lives underground',
    'landed on the moon',
    'dined with the Queen',
    'was raised by wolves',
    'built the leaning tower of Pisa',
    'invented the COVID-19 vaccine',
    'has 7 slaves',
    'ran away from the Russian circus',
    'can speak backwards',
    'killed a tiger with bare hands',
    'owns a corner shop',
    'won the London marathon',
    'works for the Mafia'
  ];

  const characteristics = getArray(weightedCharacteristics);
  const weapons = getArray(weightedWeapons);
  const pets = getArray(weightedPets);
  const hobbies = getArray(weightedHobbies);
  const fruits = getArray(weightedFruits);

  users = users.map((user) => {
    const password = getRandomInt(0, 99999).toString().padStart(5, '0');
    if (user.pass === '') {
      user.pass = password;
    } // all modes

    let bodgeCount = 0;

    while (user.characteristics.length < 2) {
      // @ts-ignore
      if (MODE === 'sample') {
        user.characteristics.push(_.sample(characteristics));
        user.characteristics = _.uniq(user.characteristics);
      } else {
        if (characteristics.length === 0) {
          throw Error('not enough characteristics');
        }
        const idx = getRandomInt(0, characteristics.length - 1);
        if (!user.characteristics.includes(characteristics[idx])) {
          bodgeCount = 0;
          const characteristic = characteristics.splice(idx, 1)[0];
          user.characteristics.push(characteristic);
        } else {
          bodgeCount++;
          if (bodgeCount === 100) {
            throw Error('too many bodges');
          }
        }
      }
    }

    if (!user.weapon) {
      // @ts-ignore
      if (MODE === 'sample') {
        user.weapon = _.sample(weapons);
      } else {
        const idx = getRandomInt(0, weapons.length - 1);
        const weapon = weapons.splice(idx, 1)[0];
        if (weapon == null) {
          throw Error('not enough weapons');
        }
        user.weapon = weapon;
      }
    }

    if (!user.pet) {
      // @ts-ignore
      if (MODE === 'sample') {
        user.pet = _.sample(pets);
      } else {
        const idx = getRandomInt(0, pets.length - 1);
        const pet = pets.splice(idx, 1)[0];
        if (pet == null) {
          throw Error('not enough pets');
        }
        user.pet = pet;
      }
    }

    if (!user.hobby) {
      // @ts-ignore
      if (MODE === 'sample') {
        user.hobby = _.sample(hobbies);
      } else {
        const idx = getRandomInt(0, hobbies.length - 1);
        const hobby = hobbies.splice(idx, 1)[0];
        if (hobby == null) {
          throw Error('not enough hobbies');
        }
        user.hobby = hobby;
      }
    }

    if (!user.fruit) {
      // if (MODE === 'sample') {
      //   user.fruit = _.sample(fruits)
      // } else {
      const idx = getRandomInt(0, fruits.length - 1);
      const fruit = fruits.splice(idx, 1)[0];
      if (fruit == null) {
        throw Error('not enough fruits');
      }
      user.fruit = fruit;
      // }
    }

    while (user.banter.length < 2) {
      const idx = getRandomInt(0, banters.length - 1);
      const banter = banters.splice(idx, 1)[0];
      if (banter == null) {
        throw Error('need more banters');
      }
      user.banter.push(banter);
    }
    return user;
  });

  // @ts-ignore
  if (MODE === 'take-one-strict' && characteristics.length !== 0) {
    throw Error(`strict characteristics error length is ${characteristics.length}`);
  }
  // @ts-ignore
  if (MODE === 'take-one-strict' && weapons.length !== 0) {
    throw Error(`strict weapons error length is ${weapons.length}`);
  }
  // @ts-ignore
  if (MODE === 'take-one-strict' && pets.length !== 0) {
    throw Error(`strict pets error length is ${pets.length}`);
  }
  // @ts-ignore
  if (MODE === 'take-one-strict' && hobbies.length !== 0) {
    throw Error(`strict hobbies error length is ${hobbies.length}`);
  }
  // @ts-ignore
  if (MODE === 'take-one-strict' && fruits.length !== 0) {
    throw Error(`strict fruits error length is ${fruits.length}`);
  }
  // @ts-ignore
  if (MODE === 'take-one-strict' && banters.length !== 0) {
    throw Error(`strict banters error length is ${banters.length}`);
  }

  const allCharacteristics = sampleCharacteristics.filter(x => x.weight > 0).map(x => x.name);
  const unusedCharacteristics = [];
  allCharacteristics.forEach((char) => {
    const user = _.find(users, (usr) => usr.characteristics.includes(char));
    if (!user) {
      unusedCharacteristics.push(char);
    }
  });
  console.log('unusedCharacteristics', unusedCharacteristics);
  console.log('Writing users file');

  fs.writeFileSync('src/app/users.ts', `/* tslint:disable */\nexport const users = ${JSON.stringify(users)};\n`);
  wroteToFile = true;
};

const percents: number[] = [];
let attempts = 0;
let success = false;
let consecutiveFailures = 0;
const ATTEMPT_COUNT = 100;

while (attempts < ATTEMPT_COUNT) {
  try {
    if (!wroteToFile) {
      generate();
    }
    success = true;
    const clueTests = getClueTests(2);
    const pu = clueTestPercentUseful(2, clueTests);
    percents.push(pu);
    attempts++;
    consecutiveFailures = 0;
  } catch (err) {
    consecutiveFailures++;
    if (consecutiveFailures > 10) {
      throw Error(err);
    }
  }
}
console.log(ATTEMPT_COUNT + ' Attempts');
console.log();
console.log('MIN', _.min(percents).toFixed(2));
// noinspection TypeScriptValidateJSTypes
console.log('AVG', _.mean(percents).toFixed(2));
console.log('MAX', _.max(percents).toFixed(2));

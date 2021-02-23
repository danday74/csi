// @ts-ignore
const _ = require('lodash');
// @ts-ignore
const fs = require('fs');

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

// const MODE = 'sample';
// const MODE = 'take-one';
const MODE = 'take-one-strict';

const generate = () => {
  let users = [
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
      career: null,
      agentId: '10000-2',
      deptId: 'JN3-16',
      characteristics: [],
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
      career: null,
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

  // should total 18 = 22 - Graham's one - Elene's one - Dean's two
  const takeOneCharacteristics = [
    {name: 'normal', weight: 6},
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
    {name: 'cat', weight: 4},
    {name: 'dog', weight: 4}, // +1
    {name: 'rabbit', weight: 2},
    {name: 'lizard', weight: 0}
  ];

  // should total 9 = 11 - Graham's one - Dean's one
  const takeOneHobbies = [
    {name: 'climbing', weight: 2},
    {name: 'dirt biking', weight: 4}, // +1
    {name: 'kayaking', weight: 3}, // +1
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

  console.log(users);

  const allCharacteristics = sampleCharacteristics.filter(x => x.weight > 0).map(x => x.name);
  const unusedCharacteristics = [];
  allCharacteristics.forEach((char) => {
    const user = _.find(users, (usr) => usr.characteristics.includes(char));
    if (!user) {
      unusedCharacteristics.push(char);
    }
  });
  console.log('unusedCharacteristics', unusedCharacteristics);

  fs.writeFileSync('src/app/users.ts', `/* tslint:disable */\nexport const users = ${JSON.stringify(users)};\n`);
};

let attempts = 0;
let success = false;
while (attempts < 9 && success === false) {
  attempts++;
  try {
    generate();
    success = true;
  } catch (err) {
    console.log(`attempt ${attempts} - ${err.message}`);
  }
}

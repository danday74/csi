const fs = require('fs')
const _ = require('lodash');

const getArray = (weightedArray) => {
  return weightedArray.reduce((acc, characteristic) => {
    for (let i = 0; i < characteristic.weight; i++) {
      acc.push(characteristic.name)
    }
    return acc;
  }, []);
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generate = () => {
  let users = [
    // RED TEAM
    {
      name: 'elene',
      displayName: 'Iona Lott',
      pass: 'elene',
      team: 'red',
      career: 'interrogator',
      agentId: '13276-10000',
      deptId: 'LK9-14',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    },
    {
      name: 'keziah',
      displayName: 'Iva Pencil',
      pass: 'keziah',
      team: 'red',
      career: 'analyst',
      agentId: '269877552-269867555',
      deptId: 'LK9-14',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    },
    {
      name: 'maria',
      displayName: 'Ma WeeOui',
      pass: 'maria',
      team: 'red',
      career: 'forensics',
      agentId: '58342-52523',
      deptId: 'LK9-14',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    },
    // GREEN TEAM
    {
      name: 'graham',
      displayName: 'Joe Kerr',
      pass: 'graham',
      team: 'green',
      career: 'interrogator',
      agentId: '14867-11591',
      deptId: 'NB3-50',
      characteristics: ['joker'],
      weapon: '',
      pet: '',
      hobby: 'kayaking',
      banter: [],
      innocent: true
    },
    {
      name: 'peter',
      displayName: 'Don Keigh',
      pass: 'peter',
      team: 'green',
      career: 'analyst',
      agentId: '10000-3',
      deptId: 'NB3-50',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    },
    {
      name: 'winnie',
      displayName: 'Anna Fender',
      pass: 'winnie',
      team: 'green',
      career: 'forensics',
      agentId: '34719-28900',
      deptId: 'NB3-50',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    },
    // BLUE TEAM
    {
      name: 'mary',
      displayName: 'Mona Lott',
      pass: 'mary',
      team: 'blue',
      career: 'interrogator',
      agentId: '62913-59637',
      deptId: 'MK8-9',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    },
    {
      name: 'dean',
      displayName: 'Micky Takerman',
      pass: 'dean',
      team: 'blue',
      career: 'analyst',
      agentId: '58436-48439',
      deptId: 'MK8-9',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: false
    },
    {
      name: 'ivo',
      displayName: 'Phil McCavity',
      pass: 'ivo',
      team: 'blue',
      career: 'forensics',
      agentId: '25684-19865',
      deptId: 'MK8-9',
      characteristics: [],
      weapon: '',
      pet: '',
      hobby: '',
      banter: [],
      innocent: true
    }
  ]

  const weightedCharacteristics = [
    {name: 'normal', weight: 5},
    {name: 'clumsy', weight: 1},
    {name: 'huggy', weight: 1},
    {name: 'helpful', weight: 1},
    {name: 'nervous twitch', weight: 1},
    {name: 'overly optimistic', weight: 1},
    {name: 'joker', weight: 1},
    {name: 'narcoleptic', weight: 1},
    {name: 'itchy', weight: 1},
    {name: 'limp', weight: 1},
    {name: 'COVID-19', weight: 1}
  ]

  const weightedWeapons = [
    {name: 'gun', weight: 2},
    {name: 'catapult', weight: 2},
    {name: 'boomerang', weight: 1}
  ]

  const weightedPets = [
    {name: 'cat', weight: 3},
    {name: 'dog', weight: 3},
    {name: 'rabbit', weight: 2},
    {name: 'lizard', weight: 1}
  ]

  const weightedHobbies = [
    {name: 'climbing', weight: 3},
    {name: 'dirt biking', weight: 2},
    {name: 'kayaking', weight: 1},
    {name: 'fencing', weight: 1}
  ]

  const banters = [
    'holds a world record',
    'discovered the long eared sloth',
    'survived a house fire',
    'is the ex president of Timbuktu',
    'won the nobel peace prize',
    'sleeps upside down',
    'climbed mount Everest',
    'failed their driving test 37 times',
    'is an orphan',
    'lives underground',
    'landed on the moon',
    'dined with the Queen',
    'was raised by wolves',
    'built the leaning tower of Pisa',
    'invented the COVID-19 vaccine',
    'has 7 slaves',
    'ran away from the Russian circus',
    'can speak backwards'
  ]

  const characteristics = getArray(weightedCharacteristics)
  const weapons = getArray(weightedWeapons)
  const pets = getArray(weightedPets)
  const hobbies = getArray(weightedHobbies)

  users = users.map((user) => {
    while (user.characteristics.length < 2) {
      user.characteristics.push(_.sample(characteristics))
      user.characteristics = _.uniq(user.characteristics)
    }
    if (!user.weapon) user.weapon = _.sample(weapons)
    if (!user.pet) user.pet = _.sample(pets)
    if (!user.hobby) user.hobby = _.sample(hobbies)
    while (user.banter.length < 2) {
      const idx = getRandomInt(0, banters.length - 1)
      const banter = banters.splice(idx, 1)[0]
      if (banter == null) throw Error('need more banters')
      user.banter.push(banter)
    }
    return user
  })

  console.log(users)

  fs.writeFileSync('src/app/users.ts', `/* tslint:disable */\nexport const users = ${JSON.stringify(users)};\n`)
}

generate()

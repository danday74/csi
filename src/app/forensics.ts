import { getRandomClue } from './codes';
import { IClue } from './interfaces/i-clue';

export const forensicsList: Array<{ code: string, validate: (team: string, user: any) => IClue }> = [
  {
    code: 'cup',
    validate(team: string, user: any): IClue {
      return {
        clue: 'Its just a normal cup',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'balloon',
    validate(team: string, user: any): IClue {
      return {
        clue: 'I think you are just saying that because its an example',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'hippo',
    validate(team: string, user: any): IClue {
      return {
        clue: null,
        alarm: true,
        alarmMessage: 'for pretending you found a hippo',
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'bible',
    validate(team: string, user: any): IClue {
      return {
        clue: 'You study a replica of the stolen golden bible. The first thing you notice is that chapter and verse references are unusual. For instance, instead of Nehemiah 7:67 it references NE7-67 or NE7:67. You also notice other peculiarities. For example, in Genesis 5, Jared\'s final age has a 5 handwritten in front of it. As you are reading, a scrap of paper and a key tagged 7632 fall to the floor.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'scrap',
    validate(team: string, user: any): IClue {
      return {
        clue: 'The scrap reads "Give me 4, no less, no more - 444 is too wee - 44444 is poor - I know your thoughts, don\'t knock on that door - Instead, use a guardian\'s year of birth". Seems like total nonsense. Must have been written by a madman!',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'wiper',
    validate(team: string, user: any): IClue {
      return {
        clue: 'You examine the brain wiper. The pin code to fire it is 4910. There is a warning written, beware not only will this wipe your brain but your vision may be impaired for a time. You wrestle with the idea of firing it at yourself, possibly not the best idea ever.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'fiji',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 3);
      return {
        clue: `You examine Lou Tennant\'s plane ticket from Fiji. It checks out. It provides a useful clue. ${randomClue.clue}`,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'france',
    validate(team: string, user: any): IClue {
      return {
        clue: 'You try to examine France but it just won\'t fit under the microscope',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'gem',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 3);
      return {
        clue: `You look at the replica gems embedded in the replica bible. The size and weight of the gems says a lot about the kind of person who might steal the bible. ${randomClue.clue}`,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'scissors',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        clue: randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'footprint',
    validate(team: string, user: any): IClue {
      return {
        clue: 'You analyse the footprints but it does not help. You follow them. They lead you straight to a locker key. Ask Lou Tennant for the key quoting "footprints" and you shall receive.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'ruturn',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 9);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'The word ruturn is misspelt. A clear indication that the criminal cannot spell, narrowing the suspects. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'package',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        clue: 'You recover the trampled package from Tesco\'s bin and examine it. It is helpful. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'doll',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        clue: 'You inspect the doll in the video. A cheap barbie imitation. The clothes when examined reveal some DNA. This is certain evidence. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'car',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'You inspect the car in the video. It needs a clean for sure. The dirt leaves behind lots of tell tale signs. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'barbie',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        clue: 'Barbie proves to be one of Micky\'s friends. You pay her a visit. She hasn\'t seen Mickey recently but tells you some useful information. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'mug',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'The mug is happy to tell you all about Micky\'s dealings but is a bit too much of a thicky to be of any real help. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'chauffeur',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 1);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'The chauffeur is very loyal to Micky and tells you virtually nothing. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'chaeffeur',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 9);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'The word chauffeur is misspelt. A clear indication that the criminal cannot spell, narrowing the suspects. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'mulberry',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 9);
      return {
        clue: 'You lookup the address on the package and visit it. The owner knows where one of the locker keys is hidden. Ask Lou Tennant for the key quoting "mulberry" and you shall receive. Also you notice a clue at the owners house. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Iona Lott',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'She owns a lot apparently',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Iva Pencil',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 1);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'A very studious hardworking girl. Armed with a pencil. You look at her study notes. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Ma WeeOui',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'She said someone insulted her but it\'s just water off a ducks back',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Joe Kerr',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'Always makes people laugh. Maybe he\'s hiding something. He tells you a joke … Somebody robbed the police department yesterday and stole all the toilets. Sadly, the detectives have nothing to go on.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Robin Banks',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 1);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'A pleasant and kind chap. He wants to help you and tells you all he knows. Which isn\'t much sadly. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Anna Fender',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'Infamous for her ability to hack and wipe criminal records. The police say she\'s extremely professional for a first time offender.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Mona Lott',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'Friendly. Joyful. Talkative. You just listen. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Takerman',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 1);
      return {
        // tslint:disable-next-line:max-line-length
        clue: randomClue.clue + ' ... \'nuff said',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Phil McCavity',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'Used to be a dentist. Loves dogs.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Guard Ian',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'An extremely handsome officer with a rather large belly.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'Lou Tennant',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'A beautiful, lovable, caring officer. She has a real sense of justice.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'music',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'Where would the music sheet feel at home? What is the song number?',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'hair',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 2);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'This seems to be the hair from an animal that was found at the crime scene. The criminal must have a pet. And there is more. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'giraffe',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'There is a giraffe in the museum. The criminal must have long legs. Seriously! The fact that there is a giraffe in the museum really does not help your case at all.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'dinosaur',
    validate(team: string, user: any): IClue {
      const randomClue = getRandomClue(this.code, 1);
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'I\'m not sure what a dinosaur has to do with this case. But I feel sorry for you. Have a clue. ' + randomClue.clue,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'cctv',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'You notice the CCTV cameras at the museum. You wonder if they were on when the crime was committed. The museum informs you they were and provides you with CCTV footage. Video unlocked.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'camera',
    validate(team: string, user: any): IClue {
      return {
        // tslint:disable-next-line:max-line-length
        clue: 'You notice the CCTV cameras at the museum. You wonder if they were on when the crime was committed. The museum informs you they were and provides you with CCTV footage. Video unlocked.',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  }
];

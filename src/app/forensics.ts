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
      const randomClue = getRandomClue('fiji', 3);
      return {
        clue: `You examine Lou Tennant\'s plane ticket from Fiji. It checks out. It provides a useful clue. ${randomClue.clue}.`,
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  }
];

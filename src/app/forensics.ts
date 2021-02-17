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
        clue: 'Did you really find a balloon?',
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
        clue: null,
        alarm: true,
        alarmMessage: 'for pretending you found a giraffe',
        smash: false,
        blur: false
      };
    }
  },
  {
    code: 'bible',
    validate(team: string, user: any): IClue {
      return {
        clue: 'Of course! You examine the bible and find a clue at VERSE REFERENCE',
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
        clue: 'Of course! You examine the brain wiper 2000 and find a clue',
        alarm: false,
        alarmMessage: null,
        smash: false,
        blur: false
      };
    }
  }
];

export const forensicsList = [
  {
    code: 'cup',
    validate(team: string, user: any): any {
      return {
        clue: 'Its just a normal cup',
        alarm: false,
        alarmMessage: null
      };
    }
  },
  {
    code: 'balloon',
    validate(team: string, user: any): any {
      return {
        clue: 'Did you really find a balloon?',
        alarm: false,
        alarmMessage: null
      };
    }
  },
  {
    code: 'giraffe',
    validate(team: string, user: any): any {
      return {
        clue: null,
        alarm: true,
        alarmMessage: 'for pretending you found a giraffe'
      };
    }
  },
  {
    code: 'bible',
    validate(team: string, user: any): any {
      return {
        clue: 'Of course! You examine the bible and find a clue at VERSE REFERENCE',
        alarm: false,
        alarmMessage: null
      };
    }
  }
];

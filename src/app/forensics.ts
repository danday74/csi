export const forensicsList = [
  {
    code: 'cup',
    validate(team: string, user: any): any {
      return {
        clue: 'This is just an example',
        alarm: false,
        alarmMessage: null
      };
    }
  },
  {
    code: 'balloon',
    validate(team: string, user: any): any {
      return {
        clue: 'This is just an example',
        alarm: false,
        alarmMessage: null
      };
    }
  },
  {
    code: 'hair',
    validate(team: string, user: any): any {
      return {
        clue: 'The criminal is hairy',
        alarm: false,
        alarmMessage: null
      };
    }
  },
  {
    code: 'coat',
    validate(team: string, user: any): any {
      return {
        clue: null,
        alarm: true,
        alarmMessage: null
      };
    }
  },
  {
    code: 'bug',
    validate(team: string, user: any): any {
      return {
        clue: null,
        alarm: true,
        alarmMessage: 'for analysing a suspicious insect'
      };
    }
  }
];

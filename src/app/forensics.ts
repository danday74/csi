export const forensicsList = [
  {
    code: 'cup',
    validate(team: string, user: any): any {
      return {
        clue: 'This is just an example',
        alarm: false
      };
    }
  },
  {
    code: 'balloon',
    validate(team: string, user: any): any {
      return {
        clue: 'This is just an example',
        alarm: false
      };
    }
  },
  {
    code: 'hair',
    validate(team: string, user: any): any {
      return {
        clue: 'The criminal is hairy',
        alarm: false
      };
    }
  },
  {
    code: 'coat',
    validate(team: string, user: any): any {
      return {
        clue: null,
        alarm: true
      };
    }
  },
  {
    code: 'bug',
    validate(team: string, user: any): any {
      return {
        clue: 'Oops',
        alarm: true
      };
    }
  }
];

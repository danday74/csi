export const codes = [
  {
    code: '1234',
    validate(team: string, user: any): any {
      return {
        clue: 'The criminal is ugly',
        alarm: false
      };
    }
  },
  {
    code: '9998',
    validate(team: string, user: any): any {
      return {
        clue: null,
        alarm: true
      };
    }
  },
  {
    code: '9999',
    validate(team: string, user: any): any {
      return {
        clue: 'Oops',
        alarm: true
      };
    }
  }
];

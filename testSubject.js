const getTestSubject = () => {
  const hhgg = () => "The Hitchhiker's Guide to te Galaxy";
  const theAnswer = Symbol('The answer');

  const testSubject = {
    games: {
      'Half-Life': [
        {
          id: 0,
          name: 'Half-Life',
          year: 1998,
        },
        {
          id: 1,
          name: 'Half-Lfe 2',
          year: 2004,
        },
        {
          id: 2,
          name: 'Half-Life 2: Episode 1',
          year: 2006,
        },
        {
          id: 3,
          name: 'Half-Life 2: Episode 2',
          year: 2006,
        },
        undefined,
        {
          id: null,
          name: 'Half-Life: Alyx',
          year: 2020,
        },
      ],
    },
    books: {
      [hhgg()]: [
        {
          name: hhgg(),
          year: 1979,
          read: true,
        },
        {
          name: 'The Restaurant at the End of the Universe',
          year: 1980,
          read: true,
        },
        {
          name: 'Life, the Universe and Everything',
          year: 1982,
          read: false,
        },
        {
          name: 'So Long, and Thanks for All the Fish',
          year: 1984,
          read: null,
        },
        {
          name: 'Mostly Harmless',
          year: 1992,
        },
        {
          name: 'And Another Thing...',
          year: NaN,
        },
      ],
    },
    'long[non-standart]property-name_for.testing': {},
    [theAnswer]: 42,
  };
  testSubject.books[hhgg()].info = {
    year: 1952,
    name: 'Doublas Adams',
    addres: null,
    email: undefined,
    children: ['Polly Jane Rocket Adams'],
  };
  testSubject.books[hhgg()][Infinity] = {
    name: 'And Another Thing...',
    year: 2008,
  };
  testSubject.books[hhgg()][42] = theAnswer;
  return testSubject;
};


exports.getTestSubject = getTestSubject;

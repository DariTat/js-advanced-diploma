import Character from '../Character';

test('тест класса Character', () => {
  expect(() => {
    // eslint-disable-next-line no-unused-vars
    const received = new Character(1, 'undead');
  }).toThrowError('нельзя использовать new Character()');
});

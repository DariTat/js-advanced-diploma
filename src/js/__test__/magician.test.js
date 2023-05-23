import Magician from '../characters/magician';

test('test class Magician', () => {
  const received = new Magician(1);
  const expected = {
    level: 1,
    type: 'magician',
    health: 50,
    attack: 10,
    defence: 40,
    distAttack: 4,
    distance: 1,
  };
  expect(received).toEqual(expected);
});

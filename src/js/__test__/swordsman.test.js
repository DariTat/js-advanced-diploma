import Swordsman from '../characters/swordsman';

test('test class Swordsman', () => {
  const received = new Swordsman(1);
  const expected = {
    level: 1,
    type: 'swordsman',
    health: 50,
    attack: 40,
    defence: 10,
    distAttack: 1,
    distance: 4,
  };
  expect(received).toEqual(expected);
});

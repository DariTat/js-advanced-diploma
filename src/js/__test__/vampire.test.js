import Vampire from '../characters/vampire';

test('test class Vampire', () => {
  const received = new Vampire(1);
  const expected = {
    level: 1,
    type: 'vampire',
    health: 50,
    attack: 25,
    defence: 25,
    distAttack: 2,
    distance: 2,
  };
  expect(received).toEqual(expected);
});

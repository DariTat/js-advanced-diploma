import Undead from '../characters/undead';

test('test class Undead', () => {
  const received = new Undead(1);
  const expected = {
    level: 1,
    type: 'undead',
    health: 50,
    attack: 40,
    defence: 10,
    distAttack: 1,
    distance: 4,
  };
  expect(received).toEqual(expected);
});

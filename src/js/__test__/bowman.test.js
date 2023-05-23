import Bowman from '../characters/bowman';

test('test class Bowman', () => {
  const received = new Bowman(1);
  const expected = {
    level: 1,
    type: 'bowman',
    health: 50,
    attack: 25,
    defence: 25,
    distAttack: 2,
    distance: 2,
  };
  expect(received).toEqual(expected);
});

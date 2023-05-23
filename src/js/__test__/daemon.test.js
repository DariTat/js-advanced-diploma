import Daemon from '../characters/daemon';

test('test class Daemon', () => {
  const received = new Daemon(1);
  const expected = {
    level: 1,
    type: 'daemon',
    health: 50,
    attack: 10,
    defence: 10,
    distance: 1,
    distAttack: 4,
  };
  expect(received).toEqual(expected);
});

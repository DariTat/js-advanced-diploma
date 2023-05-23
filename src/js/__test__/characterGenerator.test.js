import { characterGenerator } from '../generators';
import Bownam from '../characters/bowman';
import Swordsman from '../characters/swordsman';
import Magician from '../characters/magician';

test('test characterGenerator', () => {
  const received = characterGenerator([Bownam, Swordsman, Magician], 3);
  received.next();
  received.next();
  received.next();
  received.next();
  received.next();
  received.next();
  expect(received.next().done).toBe(false);
});

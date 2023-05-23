import { generateTeam } from '../generators';
import Bownam from '../characters/bowman';
import Swordsman from '../characters/swordsman';
import Magician from '../characters/magician';

test('test generateTeam', () => {
  let received = false;
  const result = generateTeam([Bownam, Swordsman, Magician], 3, 2);
  if (result.length === 2 && result[0].level <= 3 && result[1].level <= 3) {
    received = true;
  }
  expect(received).toBe(true);
});

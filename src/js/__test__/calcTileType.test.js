import { calcTileType } from '../utils';

test('тест calcTileType top-left', () => {
  const received = calcTileType(0, 8);
  expect(received).toBe('top-left');
});
test('тест calcTileType top-right', () => {
  const received = calcTileType(7, 8);
  expect(received).toBe('top-right');
});
test('тест calcTileType top', () => {
  const received = calcTileType(4, 8);
  expect(received).toBe('top');
});
test('тест calcTileType left', () => {
  const received = calcTileType(16, 8);
  expect(received).toBe('left');
});
test('тест calcTileType bottom-left', () => {
  const received = calcTileType(56, 8);
  expect(received).toBe('bottom-left');
});
test('тест calcTileType bottom', () => {
  const received = calcTileType(58, 8);
  expect(received).toBe('bottom');
});
test('тест calcTileType bottom-right', () => {
  const received = calcTileType(63, 8);
  expect(received).toBe('bottom-right');
});
test('тест calcTileType right', () => {
  const received = calcTileType(39, 8);
  expect(received).toBe('right');
});
test('тест calcTileType center', () => {
  const received = calcTileType(9, 8);
  expect(received).toBe('center');
});

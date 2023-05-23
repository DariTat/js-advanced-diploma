import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';
import PositionedCharacter from '../PositionedCharacter';
import Bowman from '../characters/bowman';
import Vampire from '../characters/vampire';
import Swordsman from '../characters/swordsman';
import cursors from '../cursors';

const state = new GameStateService();
const testGame = new GameController(new GamePlay(), state);
const bowman = new PositionedCharacter(new Bowman(1), 7);
const vampire = new PositionedCharacter(new Vampire(1), 41);
const swordsman = new PositionedCharacter(new Swordsman(1), 34);
testGame.position.push(bowman, vampire, swordsman);
testGame.gamePlay.attack = jest.fn();
testGame.gamePlay.showCellTooltip = jest.fn();
testGame.gamePlay.selectCell = jest.fn();
testGame.gamePlay.setCursor = jest.fn();

test('test отображения информации об игроке', () => {
  const { character } = bowman;
  const info = `\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`;
  testGame.onCellEnter(7);
  expect(testGame.gamePlay.showCellTooltip).toHaveBeenCalledWith(info, 7);
});
test('проверка на диапозон движения', () => {
  testGame.gameState.indexUser = 7;
  testGame.onCellEnter(14);
  expect(testGame.gamePlay.selectCell).toHaveBeenCalledWith(14, 'green');
  expect(testGame.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
});
test('проверка аттака противника', () => {
  testGame.gameState.indexUser = 34;
  testGame.gamePlay.attack(41);
  expect(testGame.gamePlay.attack).toHaveBeenCalledWith(41);
});
test('test load function', () => {
  const stateService = new GameStateService({ character: 'magician', position: 34 });
  const mock = jest.fn(() => [{ character: 'magician', position: 34 }]);
  try {
    stateService.load();
  } catch (err) {
    mock();
  }
  expect(mock).toHaveBeenCalled();
});
test('test error load', () => {
  const stateService = new GameStateService(null);
  expect(() => stateService.load()).toThrowError(new Error('Invalid state'));
});

/* eslint-disable max-len */
/* eslint-disable spaced-comment */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import Bowman from './characters/bowman';
import Daemon from './characters/daemon';
import Magician from './characters/magician';
import Swordsman from './characters/swordsman';
import Undead from './characters/undead';
import Vampire from './characters/vampire';
import Team from './Team';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerCharacters = [Bowman, Swordsman, Magician];
    this.contenderCharacters = [Vampire, Undead, Daemon];
    this.startPlayer = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.startContender = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.playerTeam = new Team();
    this.contenderTeam = new Team();
    this.position = [];
    this.gameState = new GameState();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.playerTeam.addAll(generateTeam(this.playerCharacters, 1, 2));
    this.contenderTeam.addAll(generateTeam(this.contenderCharacters, 1, 2));
    this.teamPotision(this.playerTeam, this.startPlayer);
    this.teamPotision(this.contenderTeam, this.startContender);
    this.gamePlay.redrawPositions(this.position);
    this.showInformation();
    this.noShowInformation();
    this.choiceUser();
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
  }

  teamPotision(team, startPosition) {
    for (const item of team) {
      let rand = startPosition[Math.floor(Math.random() * startPosition.length)];
      this.position.forEach((i) => {
        if (i.position === rand) {
          rand = startPosition[Math.floor(Math.random() * startPosition.length)];
        }
      });
      this.position.push(new PositionedCharacter(item, rand));
    }
    return this.position;
  }

  showInformation() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
  }

  noShowInformation() {
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  choiceUser() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  findPlayer(index) {
    if (this.position.find((el) => el.position === index)) {
      const element = this.position.find((el) => el.position === index);
      if (this.playerTeam.members.has(element.character)) {
        return element;
      }
    }
    return false;
  }

  findContender(index) {
    if (this.position.find((el) => el.position === index)) {
      const element = this.position.find((el) => el.position === index);
      if (this.contenderTeam.members.has(element.character)) {
        return true;
      }
    }
    return false;
  }

  move(index) {
    if (this.position.find((el) => el.position === this.gameState.indexUser)) {
      const selectItem = this.position.find((el) => el.position === this.gameState.indexUser);
      const posPosition = this.calcPosition(this.gameState.indexUser, selectItem.character.distance);
      return posPosition.includes(index);
    }
  }

  attack(index) {
    if (this.position.find((el) => el.position === this.gameState.indexUser)) {
      const selectItem = this.position.find((el) => el.position === this.gameState.indexUser);
      const posPosition = this.calcPosition(this.gameState.indexUser, selectItem.character.distAttack);
      return posPosition.includes(index);
    }
  }

  calcPosition(idx, dist) {
    const posPosition = [];
    const left = [];
    const right = [];
    //рассчет левой границы
    for (let i = 0; left.length < 8; i += 8) {
      left.push(i);
    }
    //рассчет правой границы
    for (let i = 7; right.length < 8; i += 8) {
      right.push(i);
    }
    for (let i = 1; i <= dist; i += 1) {
      posPosition.push(idx - 8 * i);
      posPosition.push(idx + 8 * i);
    }
    for (let i = 1; i <= dist; i += 1) {
      if (left.includes(idx)) {
        break;
      }
      posPosition.push(idx + 7 * i);
      posPosition.push(idx - i);
      posPosition.push(idx - 9 * i);
      if (left.includes(idx - i)) {
        break;
      }
    }
    for (let i = 1; i <= dist; i += 1) {
      if (right.includes(idx)) {
        break;
      }
      posPosition.push(idx + i);
      posPosition.push(idx - 7 * i);
      posPosition.push(idx + 9 * i);
      if (right.includes(idx + i)) {
        break;
      }
    }
    //отсортируем возможные позиции
    return posPosition.filter((elem) => elem >= 0 && elem <= 63);
  }

  moving(index) {
    const selectItem = this.position.find((el) => el.position === this.gameState.indexUser);
    selectItem.position = index;
    this.gamePlay.deselectCell(this.gameState.indexUser);
    this.gameState.indexUser = index;
    this.gamePlay.redrawPositions(this.position);
    this.gameState.changeOfCourse = false;
    this.contenderAction();
  }

  attacking(index) {
    if (this.gameState.changeOfCourse) {
      const attacker = (this.position.find((el) => el.position === this.gameState.indexUser)).character;
      const target = (this.position.find((el) => el.position === index));
      const stone = Math.max(attacker.attack - target.character.defence, attacker.attack * 0.1);
      this.gamePlay.showDamage(index, stone).then(() => {
        target.character.health -= stone;
        if (target.character.health <= 0) {
          const idx = this.position.indexOf(target);
          this.position.splice(idx, 1);
          this.contenderTeam.members.delete(target.character);
        }
      }).then(() => {
        this.gamePlay.redrawPositions(this.position);
      }).then(() => {
        this.levelUp();
        this.lossGame();
        this.contenderAction();
      });
      this.gameState.changeOfCourse = false;
    }
  }

  contenderAction() {
    let attacker = null;
    let target = null;
    if (this.gameState.changeOfCourse) {
      return;
    }
    const contenderTeam = this.position.filter((item) => (item.character instanceof Vampire || item.character instanceof Undead || item.character instanceof Daemon));
    const playerTeam = this.position.filter((item) => (item.character instanceof Bowman || item.character instanceof Swordsman || item.character instanceof Magician));
    contenderTeam.forEach((item) => {
      const attackPos = this.calcPosition(item.position, item.character.distAttack);
      playerTeam.forEach((i) => {
        if (attackPos.includes(i.position)) {
          attacker = item.character;
          target = i;
        }
      });
    });
    if (target) {
      const stone = Math.max(attacker.attack - target.character.defence, attacker.attack * 0.1);
      this.gamePlay.showDamage(target.position, stone).then(() => {
        target.character.health -= stone;
        if (target.character.health <= 0) {
          const idx = this.position.indexOf(target);
          this.position.splice(idx, 1);
          this.playerTeam.members.delete(target.character);
        }
      }).then(() => {
        this.gamePlay.redrawPositions(this.position);
        this.gameState.changeOfCourse = true;
      }).then(() => {
        this.levelUp();
        this.lossGame();
      });
    } else {
      attacker = contenderTeam[Math.floor(Math.random() * contenderTeam.length)];
      const attackPos = this.calcPosition(attacker.position, attacker.character.distAttack);
      attackPos.forEach((item) => {
        this.position.forEach((i) => {
          if (item === i.position) {
            attackPos.splice(attackPos.indexOf(item), 1);
          }
        });
      });
      attacker.position = attackPos[Math.floor(Math.random() * attackPos.length)];
      this.gamePlay.redrawPositions(this.position);
      this.gameState.changeOfCourse = true;
    }
  }

  levelUp() {
    if (this.contenderTeam.members.size === 0 && this.gameState.level !== 4) {
      this.position = [];
      this.gameState.level += 1;
      this.gameState.changeOfCourse = true;
      this.scoring();
      this.playerTeam.members.forEach((item) => item.levelUp());
      if (this.gameState.level === 2) {
        this.playerTeam.addAll(generateTeam(this.playerCharacters, 1, 1));
        this.contenderTeam.addAll(generateTeam(this.contenderCharacters, 2, this.playerTeam.members.size));
      }
      if (this.gameState.level === 3) {
        this.playerTeam.addAll(generateTeam(this.playerCharacters, 2, 2));
        this.contenderTeam.addAll(generateTeam(this.contenderCharacters, 3, this.playerTeam.members.size));
      }
      if (this.gameState.level === 4) {
        this.playerTeam.addAll(generateTeam(this.playerCharacters, 3, 3));
        this.contenderTeam.addAll(generateTeam(this.contenderCharacters, 4, this.playerTeam.members.size));
      }
      this.gamePlay.drawUi(themes[this.gameState.level]);
      this.teamPotision(this.playerTeam, this.startPlayer);
      this.teamPotision(this.contenderTeam, this.startContender);
      this.gamePlay.redrawPositions(this.position);
    }
  }

  lossGame() {
    if (this.playerTeam.members.size === 0) {
      this.scoring();
      GamePlay.showMessage(`Вы проиграли. Ваши баллы: ${this.gameState.points}`);
    }
  }

  gameWin() {
    if (this.contenderTeam.size === 0 && this.gameState.level === 4) {
      this.scoring();
      GamePlay.showMessage(`Вы выиграли. Ваши баллы: ${this.gameState.points}`);
    }
  }

  scoring() {
    const team = [...this.playerTeam];
    team.forEach((i) => {
      this.gameState.points += i.health * 0.5;
    });
    return this.gameState.points;
  }

  onNewGame() {
    this.playerCharacters = [Bowman, Swordsman, Magician];
    this.contenderCharacters = [Vampire, Undead, Daemon];
    this.playerTeam = new Team();
    this.contenderTeam = new Team();
    this.position = [];
    this.gameState.indexUser = null;
    this.gameState.level = 1;
    this.gameState.points = 0;
    this.gameState.changeOfCourse = true;
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.playerTeam.addAll(generateTeam(this.playerCharacters, 1, 2));
    this.contenderTeam.addAll(generateTeam(this.contenderCharacters, 1, 2));
    this.teamPotision(this.playerTeam, this.startPlayer);
    this.teamPotision(this.contenderTeam, this.startContender);
    this.gamePlay.redrawPositions(this.position);
  }

  onSaveGame() {
    this.gameState.positions = this.position;
    this.stateService.save(GameState.from(this.gameState));
  }

  onLoadGame() {
    const load = this.stateService.load();
    if (!load) {
      GamePlay.showError('Error loading');
    }
    this.gameState.changeOfCourse = load.changeOfCourse;
    this.gameState.level = load.level;
    this.gameState.points = load.points;
    this.position = [];
    this.gameState.indexUser = load.indexUser;
    this.playerTeam = new Team();
    this.contenderTeam = new Team();
    load.positions.forEach((element) => {
      let user;
      if (element.character.type === 'bowman') {
        user = new Bowman(element.character.level);
        this.playerTeam.addAll([user]);
      } else if (element.character.type === 'swordsman') {
        user = new Swordsman(element.character.level);
        this.playerTeam.addAll([user]);
      } else if (element.character.type === 'magician') {
        user = new Magician(element.character.level);
        this.playerTeam.addAll([user]);
      } else if (element.character.type === 'vampire') {
        user = new Vampire(element.character.level);
        this.playerTeam.addAll([user]);
      } else if (element.character.type === 'undead') {
        user = new Undead(element.character.level);
        this.playerTeam.addAll([user]);
      } else if (element.character.type === 'daemon') {
        user = new Daemon(element.character.level);
        this.playerTeam.addAll([user]);
      }
      this.position.push(new PositionedCharacter(user, element.position));
    });
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.gamePlay.redrawPositions(this.position);
  }

  onCellClick(index) {
    if (this.findContender(index) && !this.attack(index)) {
      GamePlay.showError('Персонаж соперника');
    }
    if (!this.move(index) && !this.attack(index)) {
      if (!this.position.find((el) => el.position === index)) {
        GamePlay.showError('Неправильный ход');
      }
    }
    if (this.attack(index) && this.findContender(index)) {
      this.attacking(index);
    }
    if (this.move(index) && !(this.position.find((el) => el.position === index))) {
      this.moving(index);
    }
    if (this.findPlayer(index)) {
      if (this.gameState.indexUser !== null) {
        this.gamePlay.deselectCell(this.gameState.indexUser);
      }
      this.gamePlay.selectCell(index);
      this.gameState.indexUser = index;
    }
  }

  onCellEnter(index) {
    const element = this.position.find((el) => el.position === index);
    if (element) {
      const { character } = element;
      const info = `\u{1F396}${character.level}\u{2694}${character.attack}\u{1F6E1}${character.defence}\u{2764}${character.health}`;
      this.gamePlay.showCellTooltip(info, index);
    }
    if (this.findPlayer(index)) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    if (this.move(index) && !(this.position.find((el) => el.position === index))) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
    if (this.findContender(index) && (this.position.find((el) => el.position === index))) {
      if (this.attack(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
    }
    if (!this.move(index) && !this.attack(index)) {
      if (this.position.find((el) => el.position === this.gameState.indexUser)) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.cells.forEach((el) => el.classList.remove('selected-green'));
    this.gamePlay.cells.forEach((el) => el.classList.remove('selected-red'));
  }
}

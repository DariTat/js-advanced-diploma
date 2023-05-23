/* eslint-disable generator-star-spacing */
/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor() {
    this.members = new Set();
  }

  add(character) {
    if (this.members.has(character) === true) {
      throw new Error('Персонаж есть в команде');
    }
    this.members.add(character);
    return this.members;
  }

  addAll(character) {
    this.members = new Set([...this.members, ...character]);
  }

  toArray() {
    const array = [];
    this.members.forEach((item) => array.push(item));
    return array;
  }

  *[Symbol.iterator]() {
    for (const element of this.members) {
      yield element;
    }
  }
}

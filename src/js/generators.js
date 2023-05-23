/* eslint-disable max-len */
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const min = 1;
    const max = maxLevel;
    const rand = min + Math.random() * (max - min);
    const randArr = Math.floor(Math.random() * allowedTypes.length);
    yield new allowedTypes[randArr](Math.round(rand));
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here'
  const characters = [];
  const character = characterGenerator(allowedTypes, maxLevel);
  while (characters.length < characterCount) {
    characters.push(character.next().value);
  }
  return characters;
}

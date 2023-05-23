export default class GameState {
  constructor() {
    this.indexUser = null;
    this.changeOfCourse = true;
    this.level = 1;
    this.points = 0;
    this.positions = [];
  }

  static from(object) {
    // TODO: create object
    if (typeof object === 'object') {
      return object;
    }
    return null;
  }
}

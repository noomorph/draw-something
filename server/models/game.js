'use strict';
const _ = require('lodash');

class Game {

  constructor() {
    this.answer = '';
    this.hint = '';
    this.drawer = {};
    this.status = 'waiting';
    this._wordList = _.shuffle(require('./words'));
    this._TIME = 60;
  }

  end() {
    this.status = 'waiting';
    clearTimeout(this.timeout);
  }

  isFinished() {
    return this.hint === this.answer;
  }

  uncover(guess) {
    let newHint = '';

    guess = guess.toLowerCase();
    for (let i = 0; i < this.answer.length; i++) {
      if (this.answer[i] === guess[i]) {
        newHint += guess[i];
      } else {
        newHint += this.hint[i];
      }
    }

    if (newHint === this.hint) return false;
    this.hint = newHint;
    return true;
  }

  newWord() {
    this.answer = this._wordList.shift();
    this.hint = '*'.repeat(this.answer.length);
  }

  start(endCb) {
    this.newWord();
    this.status = 'playing';
    this._gameTimeout(endCb);
  }

  _gameTimeout(endCb) {
    this.timeout = setTimeout(() => {
      endCb();
    }, this._TIME * 1000);
  }
}

let game;
exports.Game = Game;
exports.GameInstance = (function () {
  return function () {
    if (!game) game = new Game();
    return game;
  }
})();

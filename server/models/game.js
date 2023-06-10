'use strict';
const _ = require('lodash');

class Game {

  constructor() {
    this.answer = '';
    this.drawer = {};
    this.useList = 'regular';
    this._wordList = {
      regular: [
        'akvarium',
        'ambar',
        'ananas',
        'avto',
        'avtomobil',
        'bal',
        'balon',
        'banan',
        'bljudo',
        'butylka',
        'cvět',
        'dlanj',
        'dom',
        'doždnik',
        'drabina',
        'drěvo',
        'duga',
        'dětetko',
        'fanat',
        'fljaška',
        'gazeta',
        'gitara',
        'gnězdo',
        'grebenj',
        'grib',
        'gruša',
        'guba',
        'hlěb',
        'horugva',
        'jabloko',
        'jagoda',
        'kamera',
        'karta',
        'katka',
        'kava',
        'kladivo',
        'klaviša',
        'ključ',
        'klobuk',
        'klozet',
        'kniga',
        'kokoška',
        'kolač',
        'koljce',
        'kolo',
        'koryto',
        'kote',
        'koverta',
        'koza',
        'koš',
        'krabka',
        'krava',
        'krug',
        'krugla',
        'krysa',
        'kubok',
        'kukla',
        'kulja',
        'kupělj',
        'kura',
        'kuretina',
        'kvadrat',
        'lampa',
        'lavka',
        'ležišče',
        'limon',
        'linijka',
        'list',
        'ljaljka',
        'lodka',
        'lopata',
        'lože',
        'ložica',
        'ložka',
        'luk',
        'luna',
        'lěstvica',
        'malpa',
        'malpica',
        'mapa',
        'metla',
        'meč',
        'mlatok',
        'morje',
        'most',
        'mravka',
        'mrazina',
        'mrkva',
        'myš',
        'měrka',
        'měsec',
        'měšek',
        'nos',
        'nož',
        'oblak',
        'obora',
        'obuvka',
        'okno',
        'oko',
        'olovka',
        'opica',
        'oslica',
        'ovca',
        'ovoč',
        'paket',
        'palatka',
        'panda',
        'pero',
        'pica',
        'plašč',
        'plaž',
        'plod',
        'plošča',
        'plěvnja',
        'podglavnica',
        'poduška',
        'pojezd',
        'poklon',
        'pomaranča',
        'pomidor',
        'ponožka',
        'postelj',
        'pošta',
        'prstenj',
        'ptica',
        'pult',
        'pčela',
        'raketa',
        'ranec',
        'robot',
        'roza',
        'ruka',
        'rukzak',
        'ryba',
        'rěka',
        'sad',
        'smyček',
        'solnce',
        'sova',
        'srdce',
        'stodola',
        'stol',
        'stolka',
        'straža',
        'strěla',
        'strělka',
        'stul',
        'svinja',
        'světilka',
        'syr',
        'tabela',
        'talirka',
        'tipka',
        'toalet',
        'tomat',
        'torba',
        'tort',
        'traktor',
        'trikutnik',
        'trivugolnik',
        'vaza',
        'velosiped',
        'ventilator',
        'veverica',
        'vilica',
        'vladarka',
        'vlak',
        'voz',
        'vrěča',
        'vědro',
        'vějalo',
        'vějar',
        'větrak',
        'zapisnik',
        'zastava',
        'zavěsa',
        'zebra',
        'zmija',
        'zname',
        'zub',
        'zubec',
        'zvon',
        'zvězda',
        'časovnik',
        'čaša',
        'čaška',
        'čoln',
        'šapka',
        'šator',
        'škarpetka',
        'ščetka',
        'žaba',
        'žirafa',
        'žolv',
      ],
    };
    this._wordsGen = this.createGenerator(this._wordList);
    this._TIME = 60000;
  }

  end() {
    this.isPlaying = false;
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  createGenerator(words) {
    return Object.keys(words).reduce((acc, curr) => {
      acc[curr] = this._nextWord(words[curr]);
      return acc;
    }, {});
  }

  match(guess) {
    return this.answer.toLowerCase() === guess.toLowerCase();
  };

  newWord() {
    this.answer = this._wordsGen[this.useList].next().value;
  };

  start(endCb) {
    this.newWord();
    this.isPlaying = true;
    this._gameTimeout(endCb);
  }

  _gameTimeout(endCb) {
    this.timeout = setTimeout(() => {
      endCb();
    }, this._TIME);

  }

  *_nextWord(list) {
    let index = 0;
    const wordList = _.shuffle(list);
    console.log(wordList);
    while (index < wordList.length) {
      yield wordList[index];
      index += 1;
      if (index === wordList.length) index = 0;
    }
  };
}

let game;
exports.Game = Game;
exports.GameInstance = (function () {
  return function () {
    if (!game) game = new Game();
    return game;
  }
})();

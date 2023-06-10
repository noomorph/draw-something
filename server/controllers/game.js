const { UsersInstance, GameInstance } = require('../models');

module.exports = class Game {
  constructor(io, socket) {
    this.users = UsersInstance();
    this.game = GameInstance();
    this.io = io;
    this.socket = socket;
  }

  useList(list) {
    this.game.useList = list;
  }

  canStart() {
    return this.users.enoughReady() && !this.game.isPlaying;
  }

  checkReadyStatus() {
    if (this.users.enoughReady() && !this.isPlaying()) {
      this.socket.emit('game:status', 'Igra počinaje se ako je 2 i vyše gotovi igrači');
    }
  }

  emitDrawer() {
    this.socket.emit('game:start', this.game.drawer);
  }

  gameStart() {
    this.game.drawer = this.users.nextDrawer();
    let drawerId = this.game.drawer.id;
    this._countDown();
    this.game.start(() => {
      this.gameEnd();
    });

    this.io.emit('game:start', this.game.drawer);
    this.io.emit('game:hint', this.game.hint);
    this.io.to(drawerId).emit('game:answer', this.game.answer);
  }

  gameEnd(winner) {
    this.users.unReadyAll();
    this.game.end();
    clearInterval(this.game.interval);
    this.io.emit('game:end', { user: winner, message: `Odgovor je: ${this.game.answer}` });
  }

  getDrawerId() {
    return this.game.drawer.id;
  }

  isPlaying() {
    return this.game.isPlaying;
  }

  newUser() {
    this.users.addUser(this.socket.id);
    this.user = this.users.find(this.socket.id);
  }

  onSetUsername(name) {
    this.user.name = name;
    this.socket.emit('game:user', this.user);
    this.io.emit('game:userList', this.users.getUserList());
  }

  onUserList() {
    this.socket.emit('game:userList', this.users.getUserList());
  }

  ready() {
    this.user.isReady = true;
    this.checkReadyStatus();
    this.io.emit('game:userList', this.users.getUserList());
  }

  userQuit() {
    let user = this.users.find(this.socket.id);
    if (this.users.getUserList().length === 0) {
      this.gameEnd();
    }
    if (this.game.drawer === user) {
      this.io.emit('game:end', { message: 'Rysovatelj ostavil igru' });
      this.gameEnd();
    }
    this.users.removeUser(this.socket.id);
    this.io.emit('game:userList', this.users.getUserList());
  }


  _countDown() {
    let time = this.game._TIME / 1000;
    this.io.emit('game:timeLeft', time);

    this.game.interval = setInterval(() => {
      time = time - 1;
      this.io.emit('game:timeLeft', time);
    }, 1000);
  }
}

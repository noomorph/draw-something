const { UsersInstance, GameInstance } = require('../models');

class Game {
  constructor(io, socket) {
    this.users = UsersInstance();
    this.game = GameInstance();
    this.io = io;
    this.socket = socket;
    this.awaiting = false;
  }

  useList(list) {
    this.game.useList = list;
  }

  waitForOthers(callback) {
    if (this.game.status !== 'waiting') return;
    this.game.status = 'preparing';

    let time = 10;

    this.io.emit('game:status', `Igra počinaje se za ${time}`);

    const handle = setInterval(() => {
      if (time > 0) {
        time--;
        this.io.emit('game:status', `Igra počinaje se za ${time}`);
      } else {
        clearInterval(handle);
        if (this.users.enoughReady()) {
          callback();
        } else {
          this.game.status = 'waiting';
        }
      }
    }, 1000);
  }

  isPlaying() {
    return this.game.status === 'playing';
  }

  canStart() {
    return this.users.enoughReady() && this.game.status === 'waiting';
  }

  emitDrawer() {
    this.socket.emit('game:start', this.game.drawer);
  }

  gameStart() {
    this.game.drawer = this.users.nextDrawer();
    this.game.drawer.drew = Date.now();

    let drawerId = this.game.drawer.id;
    this._countDown(this.game._TIME);
    this.game.start(() => {
      this.gameEnd();
    });

    console.log(new Date(), 'New game: ', this.game.answer);
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

  newUser() {
    this.users.addUser(this.socket.id);
    this.user = this.users.find(this.socket.id);
  }

  onSetUsername(name) {
    console.log(new Date(), 'New user: ', name);
    this.user.name = name;
    this.socket.emit('game:user', this.user);
    this.io.emit('game:userList', this.users.getUserList());
  }

  onUserList() {
    this.socket.emit('game:userList', this.users.getUserList());
  }

  ready() {
    this.user.isReady = true;
    if (!this.users.enoughReady() && this.game.status === 'waiting') {
      this.socket.emit('game:status', 'Igra počinaje se ako je 2 i vyše gotovi igrači');
    }
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

  _countDown(time) {
    this.io.emit('game:timeLeft', time);

    let left = time;
    this.game.interval = setInterval(() => {
      left -= 1;
      this.io.emit('game:timeLeft', left);
    }, 1000);
  }
}

module.exports = Game;

const express = require('express');
const http = require('http');
const { Drawing, Game } = require('./server/controllers');
const { initIo } = require('./server/socket-io');

let app = express();
let server = http.createServer(app);
let io = initIo(server);

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/app', express.static(__dirname + '/client/app'));
app.use('/images', express.static(__dirname + '/client/images'));

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', function (socket) {

  let drawing = new Drawing(io, socket);
  let game = new Game(io, socket);

  game.newUser();

  // Drawing
  socket.on('drawing:clear', () => drawing.onClear());
  socket.on('drawing:mouseDown', (pos) => drawing.onMouseDown(pos));
  socket.on('drawing:mouseDrag', (pos) => drawing.onMouseDrag(pos));
  socket.on('drawing:brushChange', (brush) => drawing.onBrushChange(brush));

  // Game
  socket.on('game:setUsername', (name) => {
    return game.onSetUsername(name);
  });
  socket.on('game:userList', () => game.onUserList());
  socket.on('game:useList', (list) => game.useList(list));

  socket.on('game:ready', () => {
    game.ready();

    if (game.isPlaying()) {
      game.emitDrawer();
      drawing.load();
    } else if (game.canStart()) {
      game.waitForOthers(() => {
        game.gameStart();
        drawing.onClear();
        drawing.notifyDrawer(game.getDrawerId());
      });
    }
  });

  // Chat
  socket.on('chat:newMessage', (msg) => {
    if (socket.id !== game.getDrawerId() && game.game.uncover(msg)) {
      socket.emit('game:hint', game.game.hint);
      socket.broadcast.emit('game:hint', game.game.hint);

      if (game.game.isFinished()) {
        game.user.score += 1;
        game.gameEnd(game.user);
      }
    } else {
      socket.broadcast.emit('chat:newMessage', { user: game.user, message: msg });
    }
  });

  // Disconnect
  socket.on('disconnect', () => game.userQuit());
});


const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`listening to ${port}...`)
})

const _ = require('lodash');
const User = require('./user');

class Users {

  constructor() {
    this.users = {};
  }

  addUser(socketId) {
    this.users[socketId] = new User(socketId);
  };

  removeUser(socketId) {
    this.users[socketId].deleteUser();
    delete this.users[socketId];
  };

  find(socketId) {
    return this.users[socketId];
  };

  nextDrawer() {
    return _.sample(this.getReadyUserList());
  };

  getUserList() {
    return _.values(this.users);
  };

  getReadyUserList() {
    return _.filter(this.getUserList(), 'isReady');
  };

  enoughReady() {
    const countReady = this.getReadyUserList().length;
    return countReady >= 2;
  };

  unReadyAll() {
    Object.keys(this.users).forEach(id => this.users[id].isReady = false);
  };
}

let users;
exports.Users = Users;
exports.UsersInstance = (function () {
  return function () {
    if (!users) users = new Users();
    return users;
  }
})();

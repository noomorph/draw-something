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
    const users = this.getReadyUserList();
    const leastDrew = _.minBy(users, 'drew').drew;
    return _.sample(_.filter(users, { drew: leastDrew }));
  };

  /**
   * @return {Array<Player>} Array of users
   */
  getUserList() {
    return _.values(this.users);
  };

  getReadyUserList() {
    return _.filter(this.getUserList(), u => u.isReady && !`${u.name}`.includes('zritelj'));
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

const _ = require('lodash');

class User {
  constructor(id) {
    this.id = id;
    this.name = '';
    this.score = 0;
    this.drew = 0;
    this.isReady = false;
    this.imageId = this._newImage();
  }

  deleteUser() {
    User.freeImages.push(this.imageId);
  }

  _newImage() {
    if (User.freeImages.length === 0) {
      User.freeImages.push(...User.generateImageIds());
    }

    const imageId = _.sample(User.freeImages);
    _.pull(User.freeImages, imageId);
    return imageId;
  }

  static generateImageIds() {
    return Array.from({length: 9}, (v, k) => k + 1);
  }
};

User.freeImages = User.generateImageIds();

module.exports = User;

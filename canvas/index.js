const pureimage = require('pureimage');

const dummy = pureimage.make(500, 500);
const Canvas = Object.getPrototypeOf(dummy).constructor;
const Context2d = Object.getPrototypeOf(dummy.getContext('2d')).constructor;

exports.Canvas = Canvas;
exports.Context2d = Context2d;
exports.CanvasRenderingContext2D = Context2d;
exports.deregisterAllFonts = () => {};
exports.createCanvas = pureimage.make;
exports.parseFont = () => {};
exports.version = '2.5.0';
exports.cairoVersion = '1.16.0';
exports.jpegVersion = '8';
exports.gifVersion = '5.2.1';
exports.freetypeVersion = '2.13.0';

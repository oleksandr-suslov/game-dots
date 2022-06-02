import './sass/main.scss';
import 'phaser';
import GameScene from './js/scene';

let scene = new GameScene('Game');

let config = {
  type: Phaser.AUTO,
  width: 410,
  height: 450,
  scene: scene,
  radiusDots: 15,
  fallSpeed: 100,
  destroySpeed: 200,
  dotSize: 55,
  boardOffset: {
    x: 40,
    y:80,
  },
};

window.focus();
let game = new Phaser.Game(config);

export default config
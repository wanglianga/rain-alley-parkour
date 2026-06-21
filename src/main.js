import { Game } from './game/Game.js';
import { UIManager } from './game/UIManager.js';

const game = new Game();
const ui = new UIManager(game);

window.__game = game;

ui.init();
game.init();

window.addEventListener('resize', () => {
  game.resize();
});

document.getElementById('start-btn').addEventListener('click', () => {
  ui.showGame();
  game.start();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  ui.showGame();
  game.restart();
});

window.addEventListener('keydown', (e) => {
  game.handleKeyDown(e);
});

window.addEventListener('keyup', (e) => {
  game.handleKeyUp(e);
});

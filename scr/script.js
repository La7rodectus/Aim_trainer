
//library
//empty :/

//canvas class
import CanvasClass from './moduls/CanvasClass.js';

//player
import Player from './moduls/player.js';

//timer
import GameTimer from './moduls/gameTimer.js';

//game class
import Game from './moduls/game.js';

//ini
const back = new CanvasClass('bg_canvas');
const front = new CanvasClass('fr_canvas');
const gameTimer = new GameTimer('timerText');
const player = new Player();
const game = new Game(front, back, gameTimer, player);

game.ini();




















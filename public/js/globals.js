var gameWidth = 800;
var gameHeight = 600;
var gameState = 'playing'

var fishGroup;
var fishBounds;

var player;
var keys;
var evoText;
var evoExplain;
var fishSpawner;

var timeRemaining;
var timeCapInitial;
var timeCap;
var timeCapMod;
var timeBonus;
var timerText;
var timerCapText;

var evoPointsTotal;
var evoPoints;
var evoPointsRequired;
var evoPointsMax;

var evoBarBG;
var evoBarFill;
var evoDivide;

var round;
var fishSpeedBaseMult;
var fishSpeedMultMod;
var roundSpeedMult;

var resetButton;

var effectTextsGroup;

function modEvoPoints(amt) {
  evoPointsTotal += amt;
  evoPoints += amt;
}

function timeRemainingMod(amt) {
  timeRemaining = Math.min(timeCap + timeCapMod, timeRemaining + amt);
}


var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//  ===========================================================================================================

function preload() {
  //<!--this.game.stage.scale.pageAlignHorizontally = true;-->
  //<!--this.game.stage.scale.pageAlignVeritcally = true;-->
  //<!--this.game.stage.scale.refresh();-->

  game.load.image('bg', 'assets/bg.png');
  game.load.image('fish', 'assets/fish.png');
  game.load.image('fish_green', 'assets/fish_green.png');
  game.load.image('jelly', 'assets/jelly.png');
  game.load.image('jelly_black', 'assets/jelly_black.png');
  game.load.image('square_green', 'assets/square_green.png');
  game.load.image('square_black', 'assets/square_black.png');
  game.load.image('square_yellow', 'assets/square_yellow.png');
  game.load.image('restart', 'assets/restart.png');
  game.load.image('darwin', 'assets/darwin.png');
}

//  ===========================================================================================================

function create() {
  resetParams();
  setupGame();
  startRound(0);
}

//  ===========================================================================================================

function setupPlayer() {
  player = game.add.sprite(0,0, 'darwin');
  player.x = (gameWidth - player.width)*0.5;
  player.y = (gameHeight - player.height)*0.5;
  player.body.collideWorldBounds = true;
}

//  ===========================================================================================================

function setupEvoBar() {
  evoBarBG = game.add.sprite(0, 0, 'square_black');
  evoBarBG.scale.setTo(78, 2);
  evoBarBG.x = 10;
  evoBarBG.y = gameHeight - evoBarBG.height - 10;

  evoBarFill = game.add.sprite(0, 0, 'square_green');
  evoBarFill.scale.setTo(0, 2);
  evoBarFill.x = 10;
  evoBarFill.y = gameHeight - evoBarFill.height - 10;

  evoDivide = game.add.sprite(0, 0, 'square_yellow');
  evoDivide .scale.setTo(0.5, 2);
  evoDivide.x = gameWidth * 0.5;
  evoDivide.y = gameHeight - evoDivide.height - 10;
}

//  ===========================================================================================================

function setupText() {
  evoText = game.add.text(16, 16, 'Evo total: ' + evoPointsTotal, { font: '32px Arial', fill: '#000' });
  timerText = game.add.text(gameWidth/2, 20, '', { font: '30px Arial', fill: '#000' });
  timerText.anchor.x = 0.5;
  timerCapText = game.add.text(gameWidth/2, 20, '', { font: '15px Arial', fill: '#000' });
  timerCapText.anchor.setTo(0.5,1);

  evoExplain = game.add.text(gameWidth/2, gameHeight - 50, 'press spacebar once past mid point to force evolution', { font: '10px Arial', fill: '#000' });
  evoExplain.anchor.x = 0.5;
}

//  ===========================================================================================================

function setupEntities() {
  fishSpawner = createFishSpawner();

  setupPlayer();
  setupText();
  setupEvoBar();
}

//  ===========================================================================================================

function setupKeys() {
  keys = game.input.keyboard.createCursorKeys();
  keys.altUp = game.input.keyboard.addKey(Phaser.Keyboard.W);
  keys.altDown = game.input.keyboard.addKey(Phaser.Keyboard.S);
  keys.altLeft = game.input.keyboard.addKey(Phaser.Keyboard.A);
  keys.altRight = game.input.keyboard.addKey(Phaser.Keyboard.D);
  keys.evolve = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

//  ===========================================================================================================

function setupWorld() {
  game.add.sprite(0, 0, 'bg');
}

//  ===========================================================================================================

function setupGame() {
  setupKeys();
  setupWorld();
  fishGroup = game.add.group();
  setupEntities();

  effectTextGroup = game.add.group();
}

//  ===========================================================================================================

function startRound(round) {
  gameState = 'playing';
  if(0 == round)  timeRemaining = timeCap;
  else {
    timeRemainingMod(15000);
    textParams = { font: '50px Impact', fill: '#FFFF00' }
    spawnEffectText({x:gameWidth*0.5, y:gameHeight*0.4, text:"EVOLVE!\n+15 sec", textParams:textParams});
  }

  timeBonus = 0;

  evoPoints = 0;
  evoPointsMax = 2000  + round * 500;
  evoPointsRequired = evoPointsMax * 0.5;

  fishSpeedBaseMult = 1.0 + round * 0.1;
  roundSpeedMult = 1.0 + round * 0.05;

  updateEvo();
  fishSpawner.round = round;

}

//  ===========================================================================================================

function title() {

}

//  ===========================================================================================================

function destroyEntities() {
  fishGroup.removeAll();
  player.destroy();
  evoBarFill.destroy();
  evoBarBG.destroy();
  evoDivide.destroy();
  timerText.destroy();
  timerCapText.destroy();
  evoText.destroy();

  if(resetButton)
    resetButton.destroy();
}

//  ===========================================================================================================

function resetParams() {
  timeRemaining = 0;
  timeCapInitial = 60 * 1000;
  timeCap = timeCapInitial;
  timeCapMod = 0;
  timeBonus = 0;

  evoPointsTotal = 0;
  evoPoints = 0;
  evoPointsRequired;

  round = 0;
  fishSpeedBaseMult = 1.0;
  fishSpeedMultMod = 0.0;
  roundSpeedMult = 1.0;
}

//  ===========================================================================================================

function endRound() {
  fishGroup.removeAll();
  effectTextGroup.removeAll();

  ++round;
  startRound(round);
}

//  ===========================================================================================================

function endGame() {
  gameState = 'results';

  player.body.reset();

  fishGroup.forEach(function(fish){
    fish.body.reset();
  }, this, false);

  buttonX = (gameWidth - 200)*0.5;
  buttonY = (gameHeight - 100)*0.5;
  resetButton = game.add.button(buttonX, buttonY, 'restart', function() {
    resetParams();
    destroyEntities();
    setupEntities();

    startRound(0);
  });
}

//  ===========================================================================================================

function update() {
  if('title' == gameState) {

  }
  else if('playing' == gameState) {
    timeRemaining -= game.time.elapsed;

    timeRatio = 1 - timeRemaining/(timeCap + timeCapMod);
    updateTimer();
    if(0 >= timeRemaining)
    {
      setTimerText(0,0,0);
      endGame();
      return;
    }

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    handleGameInput();

    //game.physics.collide(player, platforms);
    //game.physics.collide(stars, platforms);
    game.physics.overlap(player, fishGroup, fishCollision, null, this);

    fishSpeedMultMod = roundSpeedMult * timeRatio;
    fishSpawner.update();

    fishGroup.forEach(function(fish){
      fish.updateSpeed();

      if(fish.x > gameWidth+200 || fish.x < -200) {
        fish.kill();
      }
    }, this, false);

    updateTimerCapText();
    updateEvo();

    effectTextGroup.forEach(function(text) {
      text.life -= game.time.elapsed;
      text.y -= 50 * game.time.elapsed / 1000;
      if(text.life <= 0)
        text.destroy();
    }, this, false);
  }
}

//  ===========================================================================================================

function handleGameInput() {
  if(keys.evolve.isDown && evoPoints >= evoPointsRequired)
    endRound();

  if(keys.left.isDown || keys.altLeft.isDown)
  {
    player.body.velocity.x = -150;
  }
  else if(keys.right.isDown || keys.altRight.isDown)
  {
    player.body.velocity.x = 150;
  }
  else
  {
    player.frame = 4;
  }

  if(keys.up.isDown || keys.altUp.isDown)
  {
    player.body.velocity.y = -150;
  }
  else if(keys.down.isDown || keys.altDown.isDown)
  {
    player.body.velocity.y = 150;
  }
}

//  ===========================================================================================================

function fishCollision(player, fish) {
  fish.kill();
  fish.onCollide(player.x, player.y);
}

//  ===========================================================================================================

function setTimerText(minutes, seconds, milliseconds) {
  if (minutes < 10)           minutes = '0' + minutes;
  if (seconds < 10)           seconds = '0' + seconds;
  if (milliseconds < 100)     milliseconds = '0' + milliseconds;

  timerText.setText(minutes + ':' + seconds + ':' + milliseconds.toString().substr(0,2));
}

//  ===========================================================================================================

function updateTimer() {
  minutes = Math.floor(timeRemaining / 60000) % 60;
  seconds = Math.floor(timeRemaining / 1000) % 60;
  milliseconds = Math.floor(timeRemaining) % 1000;

  setTimerText(minutes, seconds, milliseconds);
}

//  ===========================================================================================================

function updateEvo() {
  evoText.content = "Evo total: " + evoPointsTotal;

  evoPoints = Math.max(0, Math.min(evoPoints, evoPointsMax));
  evoBarFill.scale.x = evoPoints/evoPointsMax * 78;

  if(evoPoints == evoPointsMax)
    endRound();
}

//  ===========================================================================================================

function updateTimerCapText() {
  cap = timeCap + timeCapMod;

  minutes = Math.floor(cap / 60000) % 60;
  seconds = Math.floor(cap / 1000) % 60;
  milliseconds = Math.floor(cap) % 1000;

  if (minutes < 10)           minutes = '0' + minutes;
  if (seconds < 10)           seconds = '0' + seconds;
  if (milliseconds < 100)     milliseconds = '0' + milliseconds;

  timerCapText.setText(minutes + ':' + seconds + ':' + milliseconds.toString().substr(0,2));
}

//  ===========================================================================================================

function spawnEffectText(params) {
  text = game.add.text(params.x, params.y, params.text, params.textParams);
  text.anchor.x = 0.5;
  text.life = 1000;
  effectTextGroup.add(text);
}


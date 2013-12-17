function createFishSpawner() {
  var spawner = new Object();
  spawner.LEFT_SPAWN_BOUND = -100;
  spawner.RIGHT_SPAWN_BOUND = gameWidth + 100;

  spawner.lastSpawnTime = 0;
  spawner.spawnTime = 1000;
  spawner.round = 0;

  spawner.badFishScaleMod = 0.4;
  spawner.minFishScale = 0.1;
  spawner.maxFishScale = 0.5;
  spawner.badFishChance = 25;
  spawner.minFishSpeed = 50;

  spawner.update = update;
  spawner.spawnRandomFish = spawnRandomFish;

  function update()
  {
    spawnTimeMult = Math.max(0.2, 1.0 - fishSpeedMultMod);
    if(game.time.time - this.lastSpawnTime > this.spawnTime * spawnTimeMult)
    {
      fish = this.spawnRandomFish();
      fishGroup.add(fish);
      this.lastSpawnTime = game.time.time;
    }
  }

  function spawnRandomFish() {
    var speed;
    var scale = this.minFishScale;
    var spriteKey;
    var effect;
    var effectText;

    totalBadFishChance = Math.min(65, this.badFishChance + this.round * 5);
    goodFish = Math.random() * 100 + 1 > totalBadFishChance;

    if(goodFish) {
      roll = Math.random() * 100 + 1;
      scale += Math.random() * this.maxFishScale;

      if(10 > roll) {
        spriteKey = 'fish';
        secBonus = Math.round(Math.random() * 4 + 1);
        effectText = '+' + secBonus + ' sec';
        effect = function(x, y) {
          timeRemainingMod(secBonus * 1000);
          textParams = { font: '15px Impact', fill: '#FFFFFF' }
          spawnEffectText({x:x, y:y, text:effectText, textParams:textParams});
        }
      }
      else {
        spriteKey = 'fish_green';
        evoBonus = Math.round(Math.random() * 4 + 1) * 100;
        effectText = '+' + evoBonus + ' evo';
        effect = function(x, y) {
          modEvoPoints(evoBonus);
          textParams = { font: '15px Impact', fill: '#4FE614' }
          spawnEffectText({x:x, y:y, text:effectText, textParams:textParams});
        }
      }
    }
    else {
      roll = Math.random() * 100 + 1;
      scale += this.badFishScaleMod + Math.random() * this.maxFishScale;

      if(20 > roll) {
        spriteKey = 'jelly_black';
        secMod = Math.round(Math.random() * 4 + 1);
        effectText = '-' + secMod + ' sec';
        effect = function(x,y) {
          timeRemainingMod(-secMod * 1000);
          textParams = { font: '15px Impact', fill: '#000000' }
          spawnEffectText({x:x, y:y, text:effectText, textParams:textParams});
        }
      }
      else {
        spriteKey = 'jelly';
        evoMod = Math.round(Math.random() * 4 + 1) * 100;
        effectText = '-' + evoMod + ' evo';
        effect = function(x, y) {
          modEvoPoints(-evoMod);
          textParams = { font: '15px Impact', fill: '#FF0044' }
          spawnEffectText({x:x, y:y, text:effectText, textParams:textParams});
        }
      }
    }

    speed = Math.pow(Math.random()*10, 2) + this.minFishSpeed;

    x = this.LEFT_SPAWN_BOUND;
    y = Math.random() * (gameHeight - 30);
    dir = Math.round(Math.random());
    if(dir) {
      x = this.RIGHT_SPAWN_BOUND;
      speed *= -1;
    }

    fish = createFish({x:x, y:y, baseSpeed:speed, scale:scale, spriteKey:spriteKey, onCollide:effect, collideText:effectText});

    if(!dir) {
      fish.anchor.setTo(.5, 1);
      fish.scale.x *= -1;
    }

    return fish;
  }

  return spawner;
}

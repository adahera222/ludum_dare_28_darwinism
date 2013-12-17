function createFish(params)
{
  fish = game.add.sprite(params.x, params.y, params.spriteKey);
  fish.baseSpeed = params.baseSpeed;
  fish.scale.setTo(params.scale, params.scale);
  fish.onCollide = params.onCollide;
  fish.collideText = params.collideText;
  fish.updateSpeed = updateSpeed;

  function updateSpeed() {
    this.body.velocity.x = this.baseSpeed * (fishSpeedBaseMult + fishSpeedMultMod);
  }

  return fish;
}

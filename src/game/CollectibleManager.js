import * as PIXI from 'pixi.js';

class Collectible {
  constructor(game, type, lane) {
    this.game = game;
    this.type = type;
    this.lane = lane;
    this.active = true;
    this.y = -50;
    this.width = 40;
    this.height = 40;
    this.value = 100;
    
    this.container = new PIXI.Container();
    this.bobOffset = 0;
    this.bobTimer = Math.random() * Math.PI * 2;
    
    this.createGraphics();
  }
  
  createGraphics() {
    switch(this.type) {
      case 'paper':
        this.createPaper();
        break;
      case 'wax':
        this.createWax();
        break;
      case 'coin':
        this.createCoin();
        break;
    }
  }
  
  createPaper() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0xf5f5dc);
    g.moveTo(0, -20);
    g.lineTo(18, -5);
    g.lineTo(15, 20);
    g.lineTo(-15, 20);
    g.lineTo(-18, -5);
    g.closePath();
    g.endFill();
    
    g.beginFill(0xe8e4c8);
    g.moveTo(0, -20);
    g.lineTo(18, -5);
    g.lineTo(10, 10);
    g.lineTo(0, -10);
    g.closePath();
    g.endFill();
    
    g.lineStyle(0.5, 0xd4c896);
    g.moveTo(-10, 0);
    g.lineTo(10, 0);
    g.moveTo(-8, 8);
    g.lineTo(8, 8);
    g.endFill();
    
    const glow = new PIXI.Graphics();
    glow.beginFill(0xfff8dc, 0.3);
    glow.drawCircle(0, 0, 25);
    glow.endFill();
    this.container.addChild(glow);
    
    this.container.addChild(g);
    this.value = 100;
  }
  
  createWax() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0xffd700);
    g.drawRoundedRect(-12, -18, 24, 36, 4);
    g.endFill();
    
    g.beginFill(0xffec8b);
    g.drawRoundedRect(-10, -16, 20, 32, 3);
    g.endFill();
    
    g.beginFill(0xffffff);
    g.drawRoundedRect(-8, -14, 6, 8, 2);
    g.endFill();
    
    g.beginFill(0x8b4513);
    g.drawRect(-3, -24, 6, 8);
    g.endFill();
    
    const glow = new PIXI.Graphics();
    glow.beginFill(0xffd700, 0.4);
    glow.drawCircle(0, 0, 28);
    glow.endFill();
    this.container.addChild(glow);
    
    this.container.addChild(g);
    this.value = 150;
  }
  
  createCoin() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0xffd700);
    g.drawCircle(0, 0, 18);
    g.endFill();
    
    g.beginFill(0xffec8b);
    g.drawCircle(0, 0, 14);
    g.endFill();
    
    g.beginFill(0xffd700);
    g.drawCircle(0, 0, 10);
    g.endFill();
    
    g.beginFill(0xffec8b);
    g.fontSize = 16;
    g.addChild(new PIXI.Text('金', {
      fontSize: 14,
      fill: 0xdaa520,
      fontWeight: 'bold'
    }));
    
    const glow = new PIXI.Graphics();
    glow.beginFill(0xffd700, 0.4);
    glow.drawCircle(0, 0, 25);
    glow.endFill();
    this.container.addChild(glow);
    
    this.container.addChild(g);
    this.value = 200;
  }
  
  update(dt, speed) {
    this.y += speed * dt * 60;
    this.bobTimer += dt * 3;
    this.bobOffset = Math.sin(this.bobTimer) * 5;
    
    this.container.y = this.y + this.bobOffset;
    this.container.x = this.game.getLaneX(this.lane);
    
    this.container.rotation = Math.sin(this.bobTimer * 0.5) * 0.1;
    
    const screenHeight = this.game.app.screen.height;
    if (this.y > screenHeight + 50) {
      this.active = false;
    }
  }
  
  getBounds() {
    const cx = this.game.getLaneX(this.lane);
    return {
      x: cx - this.width / 2,
      y: this.y + this.bobOffset - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

export class CollectibleManager {
  constructor(game) {
    this.game = game;
    this.container = new PIXI.Container();
    this.collectibles = [];
    this.spawnTimer = 0;
    this.spawnInterval = 3;
    
    this.collectibleTypes = ['paper', 'wax', 'coin'];
    this.typeWeights = {
      paper: 3,
      wax: 2,
      coin: 1
    };
  }
  
  init() {
    
  }
  
  reset() {
    for (const collectible of this.collectibles) {
      this.container.removeChild(collectible.container);
    }
    this.collectibles = [];
    this.spawnTimer = 0;
  }
  
  update(dt, speed) {
    this.spawnTimer -= dt;
    
    const speedFactor = speed / this.game.baseSpeed;
    const adjustedInterval = this.spawnInterval / speedFactor;
    
    if (this.spawnTimer <= 0) {
      if (Math.random() < 0.6) {
        this.spawnCollectible();
      }
      this.spawnTimer = adjustedInterval * (0.8 + Math.random() * 0.6);
    }
    
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const collectible = this.collectibles[i];
      collectible.update(dt, speed);
      
      if (!collectible.active) {
        this.container.removeChild(collectible.container);
        this.collectibles.splice(i, 1);
      }
    }
  }
  
  spawnCollectible() {
    const type = this.getRandomCollectibleType();
    const lane = Math.floor(Math.random() * this.game.lanes);
    
    const collectible = new Collectible(this.game, type, lane);
    collectible.y = -50;
    
    this.collectibles.push(collectible);
    this.container.addChild(collectible.container);
  }
  
  getRandomCollectibleType() {
    const types = Object.keys(this.typeWeights);
    const totalWeight = types.reduce((sum, type) => sum + this.typeWeights[type], 0);
    
    let random = Math.random() * totalWeight;
    
    for (const type of types) {
      random -= this.typeWeights[type];
      if (random <= 0) {
        return type;
      }
    }
    
    return types[0];
  }
  
  getCollectibles() {
    return this.collectibles;
  }
  
  remove(index) {
    if (index >= 0 && index < this.collectibles.length) {
      const collectible = this.collectibles[index];
      collectible.active = false;
      this.container.removeChild(collectible.container);
      this.collectibles.splice(index, 1);
    }
  }
  
  resize() {
    for (const collectible of this.collectibles) {
      collectible.container.x = this.game.getLaneX(collectible.lane);
    }
  }
}

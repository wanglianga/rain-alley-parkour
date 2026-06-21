import * as PIXI from 'pixi.js';

class Obstacle {
  constructor(game, type, lane) {
    this.game = game;
    this.type = type;
    this.lane = lane;
    this.active = true;
    this.x = 0;
    this.y = 0;
    this.width = 60;
    this.height = 60;
    this.triggered = false;
    this.container = new PIXI.Container();
    
    this.durabilityDamage = 10;
    this.strength = 1;
    
    this.createGraphics();
  }
  
  createGraphics() {
    switch(this.type) {
      case 'eaves':
        this.createEaves();
        break;
      case 'puddle':
        this.createPuddle();
        break;
      case 'wind':
        this.createWind();
        break;
      case 'bridge':
        this.createBridge();
        break;
      case 'lantern':
        this.createLantern();
        break;
      case 'steps':
        this.createSteps();
        break;
      case 'narrow':
        this.createNarrow();
        break;
    }
  }
  
  createEaves() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x8b4513);
    g.moveTo(-60, 0);
    g.lineTo(60, 0);
    g.lineTo(50, -30);
    g.lineTo(-50, -30);
    g.closePath();
    g.endFill();
    
    g.beginFill(0x654321);
    g.moveTo(-65, -30);
    g.lineTo(65, -30);
    g.lineTo(55, -50);
    g.lineTo(-55, -50);
    g.closePath();
    g.endFill();
    
    for (let i = -2; i <= 2; i++) {
      g.beginFill(0xff6347);
      g.drawCircle(i * 25, -30, 5);
      g.endFill();
    }
    
    this.width = 120;
    this.height = 50;
    this.durabilityDamage = 0;
    
    this.container.addChild(g);
  }
  
  createPuddle() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x4a90d9);
    g.drawEllipse(0, 0, 50, 20);
    g.endFill();
    
    g.beginFill(0x7ab8e8);
    g.drawEllipse(-10, -3, 25, 10);
    g.endFill();
    
    g.beginFill(0xa8d8ea);
    g.drawEllipse(5, -5, 10, 4);
    g.endFill();
    
    this.width = 100;
    this.height = 30;
    this.durabilityDamage = 0;
    
    this.container.addChild(g);
  }
  
  createWind() {
    const g = new PIXI.Graphics();
    
    for (let i = 0; i < 8; i++) {
      const y = -60 + i * 15;
      const len = 30 + Math.random() * 20;
      g.lineStyle(2, 0xa8d8ea, 0.6 - i * 0.05);
      g.moveTo(-len, y);
      g.quadraticCurveTo(0, y - 5, len, y);
      g.endFill();
    }
    
    this.width = 80;
    this.height = 120;
    this.durabilityDamage = 15;
    this.strength = 3;
    
    this.container.addChild(g);
  }
  
  createBridge() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x808080);
    g.drawRoundedRect(-50, -40, 100, 20, 5);
    g.endFill();
    
    g.beginFill(0x696969);
    g.drawRect(-50, -20, 15, 60);
    g.drawRect(35, -20, 15, 60);
    g.endFill();
    
    g.beginFill(0xa9a9a9);
    for (let i = -2; i <= 2; i++) {
      g.drawRect(i * 20 - 2, -38, 4, 16);
    }
    g.endFill();
    
    this.width = 100;
    this.height = 60;
    this.durabilityDamage = 20;
    
    this.container.addChild(g);
  }
  
  createLantern() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0xff4500);
    g.drawEllipse(0, -40, 20, 30);
    g.endFill();
    
    g.beginFill(0xff6347);
    g.drawEllipse(0, -40, 15, 25);
    g.endFill();
    
    g.beginFill(0xffd700);
    g.drawRect(-15, -70, 30, 5);
    g.drawRect(-15, -12, 30, 5);
    g.endFill();
    
    g.beginFill(0x8b4513);
    g.drawRect(-2, -75, 4, 8);
    g.drawRect(-1, -5, 2, 15);
    g.endFill();
    
    const tassle = new PIXI.Graphics();
    tassle.beginFill(0xffd700);
    tassle.moveTo(-8, 10);
    tassle.lineTo(0, 25);
    tassle.lineTo(8, 10);
    tassle.closePath();
    tassle.endFill();
    g.addChild(tassle);
    
    const glow = new PIXI.Graphics();
    glow.beginFill(0xff6347, 0.3);
    glow.drawEllipse(0, -40, 35, 45);
    glow.endFill();
    g.addChild(glow);
    
    this.width = 50;
    this.height = 100;
    this.durabilityDamage = 25;
    
    this.container.addChild(g);
  }
  
  createSteps() {
    const g = new PIXI.Graphics();
    
    for (let i = 0; i < 4; i++) {
      const y = -i * 20;
      g.beginFill(0x696969);
      g.drawRect(-45, y, 90, 18);
      g.endFill();
      
      g.beginFill(0x808080);
      g.drawRect(-45, y, 90, 5);
      g.endFill();
    }
    
    this.width = 90;
    this.height = 80;
    this.durabilityDamage = 15;
    
    this.container.addChild(g);
  }
  
  createNarrow() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x654321);
    g.drawRect(-40, -150, 15, 150);
    g.drawRect(25, -150, 15, 150);
    g.endFill();
    
    g.beginFill(0x8b4513);
    g.drawRect(-45, -155, 25, 10);
    g.drawRect(20, -155, 25, 10);
    g.endFill();
    
    g.beginFill(0x4a3520);
    for (let i = 0; i < 6; i++) {
      g.drawRect(-38, -130 + i * 25, 10, 3);
      g.drawRect(28, -130 + i * 25, 10, 3);
    }
    g.endFill();
    
    this.width = 80;
    this.height = 150;
    this.durabilityDamage = 20;
    
    this.container.addChild(g);
  }
  
  update(dt, speed) {
    this.y += speed * dt * 60;
    
    const screenHeight = this.game.app.screen.height;
    if (this.y > screenHeight + 100) {
      this.active = false;
    }
    
    this.container.y = this.y;
    this.container.x = this.game.getLaneX(this.lane);
  }
  
  getBounds() {
    const cx = this.game.getLaneX(this.lane);
    return {
      x: cx - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}

export class ObstacleManager {
  constructor(game) {
    this.game = game;
    this.container = new PIXI.Container();
    this.obstacles = [];
    this.spawnTimer = 0;
    this.spawnInterval = 2;
    
    this.obstacleTypes = ['eaves', 'puddle', 'wind', 'bridge', 'lantern', 'steps', 'narrow'];
    this.typeWeights = {
      eaves: 2,
      puddle: 2,
      wind: 1.5,
      bridge: 1,
      lantern: 1.5,
      steps: 1,
      narrow: 1
    };
  }
  
  init() {
    
  }
  
  reset() {
    for (const obstacle of this.obstacles) {
      this.container.removeChild(obstacle.container);
    }
    this.obstacles = [];
    this.spawnTimer = 0;
    this.spawnInterval = 2;
  }
  
  update(dt, speed) {
    this.spawnTimer -= dt;
    
    const speedFactor = speed / this.game.baseSpeed;
    const adjustedInterval = this.spawnInterval / speedFactor;
    
    if (this.spawnTimer <= 0) {
      this.spawnObstacle();
      this.spawnTimer = adjustedInterval * (0.8 + Math.random() * 0.4);
    }
    
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      obstacle.update(dt, speed);
      
      if (!obstacle.active) {
        this.container.removeChild(obstacle.container);
        this.obstacles.splice(i, 1);
      }
    }
  }
  
  spawnObstacle() {
    const type = this.getRandomObstacleType();
    const lane = Math.floor(Math.random() * this.game.lanes);
    
    const obstacle = new Obstacle(this.game, type, lane);
    obstacle.y = -100;
    obstacle.container.y = -100;
    obstacle.container.x = this.game.getLaneX(lane);
    
    this.obstacles.push(obstacle);
    this.container.addChild(obstacle.container);
    
    this.addWarningEffect(lane);
  }
  
  getRandomObstacleType() {
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
  
  addWarningEffect(lane) {
    const warning = new PIXI.Graphics();
    warning.beginFill(0xff6347, 0.5);
    warning.drawRect(-30, -10, 60, 20);
    warning.endFill();
    
    warning.x = this.game.getLaneX(lane);
    warning.y = -50;
    
    this.container.addChild(warning);
    
    let alpha = 0.5;
    const fadeInterval = setInterval(() => {
      alpha -= 0.05;
      warning.alpha = alpha;
      if (alpha <= 0) {
        clearInterval(fadeInterval);
        this.container.removeChild(warning);
      }
    }, 50);
  }
  
  getObstacles() {
    return this.obstacles;
  }
  
  resize() {
    for (const obstacle of this.obstacles) {
      obstacle.container.x = this.game.getLaneX(obstacle.lane);
    }
  }
}

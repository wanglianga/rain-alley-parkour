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
    
    this.windDirection = 0;
    this.windPhase = 0;
    this.windTimer = 0;
    this.windPeriod = 2;
    this.lastWarningPhase = -1;
    this.windIndicator = null;
    this.windArrows = [];
    this.isWindZone = false;
    this.windFade = 0;
    
    this.repairAmount = 40;
    this.repairDuration = 2;
    this.used = false;
    
    this.createGraphics();
    
    if (this.type === 'alley') {
      this.windPeriod = 2.5;
      this.strength = 2;
      this.durabilityDamage = 5;
    } else if (this.type === 'bridge_wind') {
      this.windPeriod = 3;
      this.strength = 2.5;
      this.durabilityDamage = 8;
    } else if (this.type === 'building_gap') {
      this.windPeriod = 1.8;
      this.strength = 3;
      this.durabilityDamage = 10;
    }
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
      case 'alley':
        this.createAlley();
        break;
      case 'bridge_wind':
        this.createBridgeWind();
        break;
      case 'building_gap':
        this.createBuildingGap();
        break;
      case 'wind_chime':
        this.createWindChime();
        break;
      case 'rain_curtain':
        this.createRainCurtain();
        break;
      case 'repair_stall':
        this.createRepairStall();
        break;
      case 'shortcut':
        this.createShortcut();
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
  
  createAlley() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x3d2914);
    g.drawRect(-50, -120, 20, 120);
    g.drawRect(30, -120, 20, 120);
    g.endFill();
    
    g.beginFill(0x5c3d2e);
    g.drawRect(-55, -125, 30, 12);
    g.drawRect(25, -125, 30, 12);
    g.endFill();
    
    g.beginFill(0x2c1810);
    g.moveTo(-55, -125);
    g.lineTo(0, -145);
    g.lineTo(55, -125);
    g.closePath();
    g.endFill();
    
    g.beginFill(0xf5d76e, 0.3);
    g.drawRect(-30, -100, 60, 100);
    g.endFill();
    
    this.width = 100;
    this.height = 145;
    this.durabilityDamage = 5;
    this.strength = 2;
    this.windPeriod = 1.5;
    
    this.container.addChild(g);
  }
  
  createBridgeWind() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x696969);
    g.drawRoundedRect(-60, -30, 120, 15, 5);
    g.endFill();
    
    g.beginFill(0x808080);
    g.drawRect(-60, -15, 8, 50);
    g.drawRect(52, -15, 8, 50);
    g.drawRect(-35, -15, 6, 50);
    g.drawRect(29, -15, 6, 50);
    g.endFill();
    
    g.lineStyle(2, 0xa9a9a9);
    g.moveTo(-60, -30);
    g.lineTo(-60, -60);
    g.lineTo(60, -60);
    g.lineTo(60, -30);
    g.endFill();
    
    for (let i = -2; i <= 2; i++) {
      const wind = new PIXI.Graphics();
      wind.lineStyle(2, 0xa8d8ea, 0.5);
      wind.moveTo(i * 25 - 10, -80);
      wind.quadraticCurveTo(i * 25, -90, i * 25 + 10, -80);
      wind.endFill();
      g.addChild(wind);
    }
    
    this.width = 120;
    this.height = 80;
    this.durabilityDamage = 8;
    this.strength = 2.5;
    this.windPeriod = 1.8;
    
    this.container.addChild(g);
  }
  
  createBuildingGap() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x2d3748);
    g.drawRect(-60, -180, 30, 180);
    g.drawRect(30, -180, 30, 180);
    g.endFill();
    
    g.beginFill(0x1a202c);
    for (let i = 0; i < 6; i++) {
      g.drawRect(-55, -165 + i * 30, 20, 20);
      g.drawRect(35, -165 + i * 30, 20, 20);
    }
    g.endFill();
    
    g.beginFill(0xf5d76e, 0.4);
    for (let i = 0; i < 4; i++) {
      g.drawRect(-52, -160 + i * 45, 14, 15);
      g.drawRect(38, -160 + i * 45, 14, 15);
    }
    g.endFill();
    
    for (let i = 0; i < 5; i++) {
      const wind = new PIXI.Graphics();
      wind.lineStyle(2, 0xa8d8ea, 0.6);
      wind.moveTo(-25, -160 + i * 35);
      wind.quadraticCurveTo(0, -170 + i * 35, 25, -160 + i * 35);
      wind.endFill();
      g.addChild(wind);
    }
    
    this.width = 120;
    this.height = 180;
    this.durabilityDamage = 10;
    this.strength = 3;
    this.windPeriod = 1.2;
    
    this.container.addChild(g);
  }
  
  createWindChime() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x8b4513);
    g.drawRect(-2, -80, 4, 15);
    g.endFill();
    
    g.beginFill(0xd4af37);
    g.drawCircle(0, -65, 8);
    g.endFill();
    
    for (let i = -2; i <= 2; i++) {
      g.lineStyle(1, 0x8b4513);
      g.moveTo(i * 10, -65);
      g.lineTo(i * 10, -35);
      g.endFill();
      
      g.beginFill(0xc0a080);
      g.drawRoundedRect(i * 10 - 4, -35, 8, 25, 2);
      g.endFill();
      
      g.beginFill(0xd4af37);
      g.drawCircle(i * 10, -8, 3);
      g.endFill();
    }
    
    const glow = new PIXI.Graphics();
    glow.beginFill(0xf5d76e, 0.4);
    glow.drawCircle(0, -45, 35);
    glow.endFill();
    this.container.addChild(glow);
    
    this.width = 60;
    this.height = 90;
    this.durabilityDamage = 0;
    this.isWarning = true;
    
    this.container.addChild(g);
  }
  
  createRainCurtain() {
    const g = new PIXI.Graphics();
    
    for (let i = 0; i < 15; i++) {
      g.lineStyle(2, 0x7ab8e8, 0.7);
      const x = -50 + i * 7;
      g.moveTo(x, -60);
      g.lineTo(x + 2, 40);
      g.endFill();
    }
    
    g.beginFill(0x4a90d9, 0.2);
    g.drawRect(-55, -60, 110, 100);
    g.endFill();
    
    const warning = new PIXI.Graphics();
    warning.beginFill(0xff6347, 0.5);
    warning.drawRoundedRect(-35, -80, 70, 18, 6);
    warning.endFill();
    
    const warningText = new PIXI.Text('暴雨预警', {
      fontSize: 12,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    warningText.anchor.set(0.5);
    warningText.y = -71;
    warning.addChild(warningText);
    this.container.addChild(warning);
    
    this.width = 110;
    this.height = 100;
    this.durabilityDamage = 0;
    this.isWarning = true;
    this.rainIntensity = 'heavy';
    
    this.container.addChild(g);
  }
  
  createRepairStall() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x8b0000);
    g.moveTo(-50, -80);
    g.lineTo(50, -80);
    g.lineTo(40, -60);
    g.lineTo(-40, -60);
    g.closePath();
    g.endFill();
    
    g.beginFill(0xa52a2a);
    for (let i = -4; i <= 4; i++) {
      g.moveTo(i * 10, -80);
      g.lineTo(i * 10 + 5, -80);
      g.lineTo(i * 10 + 2, -75);
      g.lineTo(i * 10 - 2, -75);
      g.closePath();
    }
    g.endFill();
    
    g.beginFill(0x5c3d2e);
    g.drawRect(-40, -60, 8, 70);
    g.drawRect(32, -60, 8, 70);
    g.endFill();
    
    g.beginFill(0x654321);
    g.drawRoundedRect(-30, -50, 60, 40, 5);
    g.endFill();
    
    const sign = new PIXI.Graphics();
    sign.beginFill(0xf5d76e);
    sign.drawRoundedRect(-25, -105, 50, 22, 4);
    sign.endFill();
    
    const signText = new PIXI.Text('修伞', {
      fontSize: 14,
      fill: 0x8b0000,
      fontWeight: 'bold'
    });
    signText.anchor.set(0.5);
    signText.y = -94;
    sign.addChild(signText);
    this.container.addChild(sign);
    
    const umbrellaIcon = new PIXI.Graphics();
    umbrellaIcon.beginFill(0xe74c3c);
    umbrellaIcon.moveTo(0, -40);
    umbrellaIcon.quadraticCurveTo(-20, -30, -25, -15);
    umbrellaIcon.lineTo(25, -15);
    umbrellaIcon.quadraticCurveTo(20, -30, 0, -40);
    umbrellaIcon.closePath();
    umbrellaIcon.endFill();
    umbrellaIcon.lineStyle(1, 0x8b4513);
    umbrellaIcon.moveTo(0, -38);
    umbrellaIcon.lineTo(0, -10);
    umbrellaIcon.endFill();
    g.addChild(umbrellaIcon);
    
    this.width = 100;
    this.height = 110;
    this.durabilityDamage = 0;
    this.isRepairStation = true;
    this.repairAmount = 35;
    this.repairDuration = 2;
    
    this.container.addChild(g);
  }
  
  createShortcut() {
    const g = new PIXI.Graphics();
    
    g.beginFill(0x2e8b57, 0.8);
    g.moveTo(-40, -50);
    g.lineTo(40, -50);
    g.lineTo(50, 0);
    g.lineTo(40, 50);
    g.lineTo(-40, 50);
    g.lineTo(-50, 0);
    g.closePath();
    g.endFill();
    
    g.beginFill(0x3cb371);
    g.moveTo(-35, -45);
    g.lineTo(35, -45);
    g.lineTo(42, 0);
    g.lineTo(35, 45);
    g.lineTo(-35, 45);
    g.lineTo(-42, 0);
    g.closePath();
    g.endFill();
    
    const arrow = new PIXI.Graphics();
    arrow.beginFill(0xf5d76e);
    arrow.moveTo(0, -25);
    arrow.lineTo(20, 5);
    arrow.lineTo(8, 5);
    arrow.lineTo(8, 25);
    arrow.lineTo(-8, 25);
    arrow.lineTo(-8, 5);
    arrow.lineTo(-20, 5);
    arrow.closePath();
    arrow.endFill();
    g.addChild(arrow);
    
    const label = new PIXI.Text('捷径', {
      fontSize: 14,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    label.anchor.set(0.5);
    label.y = -65;
    this.container.addChild(label);
    
    this.width = 100;
    this.height = 120;
    this.durabilityDamage = 5;
    this.isShortcut = true;
    this.speedBoost = 1.8;
    this.boostDuration = 3;
    
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
    
    if (this.type === 'alley' || this.type === 'bridge_wind' || this.type === 'building_gap') {
      this.windTimer += dt;
      
      const phaseRatio = (this.windTimer % this.windPeriod) / this.windPeriod;
      this.windPhase = Math.floor(phaseRatio * 4);
      
      let targetDir = 0;
      let targetFade = 0;
      
      switch (this.windPhase) {
        case 0:
          targetDir = -1;
          targetFade = 1;
          break;
        case 1:
          targetDir = 0;
          targetFade = 0;
          break;
        case 2:
          targetDir = 1;
          targetFade = 1;
          break;
        case 3:
          targetDir = 0;
          targetFade = 0;
          break;
      }
      
      const phaseProgress = (phaseRatio * 4) - this.windPhase;
      const fadeSpeed = 6;
      
      if (targetFade === 1) {
        this.windFade = Math.min(1, this.windFade + fadeSpeed * dt);
      } else {
        this.windFade = Math.max(0, this.windFade - fadeSpeed * dt);
      }
      
      this.windDirection = targetDir * this.windFade;
      
      if (this.windPhase !== this.lastWarningPhase) {
        this.lastWarningPhase = this.windPhase;
        
        if (this.windPhase === 0 || this.windPhase === 2) {
          const dirText = this.windPhase === 0 ? '← 左风' : '右风 →';
          const zoneName = this.type === 'alley' ? '巷口' : this.type === 'bridge_wind' ? '桥面' : '高楼夹缝';
          
          if (this.game.onWarningUpdate) {
            this.game.onWarningUpdate({
              type: 'wind',
              message: zoneName + '：' + dirText,
              duration: 0.8
            });
          }
        }
      }
      
      this.updateWindVisuals(this.windDirection);
    }
    
    if (this.type === 'wind_chime') {
      this.container.rotation = Math.sin(this.game.gameTime * 4) * 0.15;
    }
  }
  
  updateWindVisuals(windValue) {
    if (!this.windIndicator) {
      this.windIndicator = new PIXI.Container();
      this.container.addChild(this.windIndicator);
      
      for (let i = 0; i < 4; i++) {
        const arrow = new PIXI.Graphics();
        this.windIndicator.addChild(arrow);
        this.windArrows.push(arrow);
      }
    }
    
    const dir = windValue > 0 ? 1 : (windValue < 0 ? -1 : 0);
    const intensity = Math.abs(windValue);
    
    for (let i = 0; i < this.windArrows.length; i++) {
      const arrow = this.windArrows[i];
      arrow.clear();
      
      if (intensity > 0.05) {
        const yOffset = -80 + i * 22;
        const arrowLength = 12 + intensity * 18;
        const headSize = 5 + intensity * 4;
        
        arrow.lineStyle(2 + intensity * 1.5, 0xf5d76e, 0.5 + intensity * 0.5);
        if (dir > 0) {
          arrow.moveTo(-arrowLength, yOffset);
          arrow.lineTo(arrowLength, yOffset);
          arrow.lineTo(arrowLength - headSize, yOffset - headSize);
          arrow.moveTo(arrowLength, yOffset);
          arrow.lineTo(arrowLength - headSize, yOffset + headSize);
        } else {
          arrow.moveTo(arrowLength, yOffset);
          arrow.lineTo(-arrowLength, yOffset);
          arrow.lineTo(-arrowLength + headSize, yOffset - headSize);
          arrow.moveTo(-arrowLength, yOffset);
          arrow.lineTo(-arrowLength + headSize, yOffset + headSize);
        }
        arrow.endFill();
      }
    }
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
    
    this.obstacleTypes = ['eaves', 'puddle', 'wind', 'bridge', 'lantern', 'steps', 'narrow', 'alley', 'bridge_wind', 'building_gap', 'wind_chime', 'rain_curtain', 'repair_stall', 'shortcut'];
    this.typeWeights = {
      eaves: 2,
      puddle: 2,
      wind: 1,
      bridge: 0.8,
      lantern: 1.2,
      steps: 0.8,
      narrow: 1,
      alley: 1.2,
      bridge_wind: 1,
      building_gap: 0.8,
      wind_chime: 0.6,
      rain_curtain: 0.5,
      repair_stall: 0.6,
      shortcut: 0.7
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
    
    let warningType = 'danger';
    if (type === 'alley' || type === 'bridge_wind' || type === 'building_gap' || type === 'wind_chime') {
      warningType = 'wind';
    } else if (type === 'rain_curtain') {
      warningType = 'rain';
    } else if (type === 'repair_stall') {
      warningType = 'repair';
    } else if (type === 'eaves' || type === 'puddle' || type === 'shortcut') {
      warningType = 'safe';
    }
    
    this.addWarningEffect(lane, warningType);
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
  
  addWarningEffect(lane, type = 'danger') {
    const warning = new PIXI.Graphics();
    
    let color = 0xff6347;
    if (type === 'wind') {
      color = 0xf5d76e;
    } else if (type === 'rain') {
      color = 0x4a90d9;
    } else if (type === 'repair') {
      color = 0x2e8b57;
    }
    
    warning.beginFill(color, 0.5);
    warning.drawRoundedRect(-35, -15, 70, 25, 6);
    warning.endFill();
    
    warning.x = this.game.getLaneX(lane);
    warning.y = -50;
    
    this.container.addChild(warning);
    
    let alpha = 0.5;
    let pulse = 0;
    const fadeInterval = setInterval(() => {
      pulse += 0.3;
      alpha -= 0.03;
      warning.alpha = alpha + Math.sin(pulse) * 0.15;
      warning.scale.y = 1 + Math.sin(pulse) * 0.1;
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

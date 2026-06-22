import * as PIXI from 'pixi.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.container = new PIXI.Container();
    
    this.body = null;
    this.umbrella = null;
    this.umbrellaCanopy = null;
    this.umbrellaShaft = null;
    
    this.durability = 100;
    this.maxDurability = 100;
    
    this.umbrellaOpen = true;
    this.umbrellaCooldown = 0;
    this.umbrellaAnimProgress = 1;
    
    this.isTurning = false;
    this.turnDirection = 0;
    this.turnTilt = 0;
    
    this.splashBoost = 1;
    this.splashBoostTimer = 0;
    
    this.windPush = 0;
    this.windPushTimer = 0;
    
    this.shelterTimer = 0;
    
    this.knockback = 0;
    this.knockbackTimer = 0;
    
    this.waxProtection = 0;
    
    this.repairCooldown = 0;
    this.isRepairing = false;
    this.repairTimer = 0;
    
    this.bobOffset = 0;
    this.bobTimer = 0;
    
    this.velocityY = 0;
    this.isGrounded = true;
    
    this.umbrellaWobble = 0;
    this.umbrellaTearAlpha = 0;
    this.tearGraphics = null;
  }
  
  init() {
    this.createCharacter();
    this.container.x = this.game.app.screen.width / 2;
    this.container.y = this.game.groundY - 60;
  }
  
  createCharacter() {
    const bodyGroup = new PIXI.Container();
    
    const body = new PIXI.Graphics();
    body.beginFill(0x4a5568);
    body.drawRoundedRect(-15, -30, 30, 50, 8);
    body.endFill();
    bodyGroup.addChild(body);
    
    const head = new PIXI.Graphics();
    head.beginFill(0xfbd38a);
    head.drawCircle(0, -40, 15);
    head.endFill();
    bodyGroup.addChild(head);
    
    const hair = new PIXI.Graphics();
    hair.beginFill(0x2d3748);
    hair.arc(0, -45, 14, Math.PI, 0);
    hair.endFill();
    bodyGroup.addChild(hair);
    
    const coat = new PIXI.Graphics();
    coat.beginFill(0x2c5282);
    coat.moveTo(-18, -25);
    coat.lineTo(-22, 15);
    coat.lineTo(22, 15);
    coat.lineTo(18, -25);
    coat.closePath();
    coat.endFill();
    bodyGroup.addChild(coat);
    
    const legs = new PIXI.Graphics();
    legs.beginFill(0x1a365d);
    legs.drawRoundedRect(-12, 15, 10, 25, 3);
    legs.drawRoundedRect(2, 15, 10, 25, 3);
    legs.endFill();
    bodyGroup.addChild(legs);
    
    this.body = bodyGroup;
    this.container.addChild(bodyGroup);
    
    this.createUmbrella();
  }
  
  createUmbrella() {
    this.umbrella = new PIXI.Container();
    
    this.umbrellaShaft = new PIXI.Graphics();
    this.umbrellaShaft.beginFill(0x8b4513);
    this.umbrellaShaft.drawRect(-2, -70, 4, 70);
    this.umbrellaShaft.endFill();
    this.umbrella.addChild(this.umbrellaShaft);
    
    this.umbrellaCanopy = new PIXI.Container();
    
    const canopy = new PIXI.Graphics();
    canopy.beginFill(0xe74c3c);
    canopy.moveTo(0, -80);
    canopy.quadraticCurveTo(-45, -60, -55, -30);
    canopy.lineTo(55, -30);
    canopy.quadraticCurveTo(45, -60, 0, -80);
    canopy.closePath();
    canopy.endFill();
    
    canopy.beginFill(0xc0392b);
    canopy.moveTo(-20, -75);
    canopy.lineTo(-55, -35);
    canopy.lineTo(-45, -32);
    canopy.lineTo(-15, -70);
    canopy.closePath();
    canopy.endFill();
    
    canopy.beginFill(0xc0392b);
    canopy.moveTo(20, -75);
    canopy.lineTo(55, -35);
    canopy.lineTo(45, -32);
    canopy.lineTo(15, -70);
    canopy.closePath();
    canopy.endFill();
    
    const tip = new PIXI.Graphics();
    tip.beginFill(0xf1c40f);
    tip.drawCircle(0, -82, 4);
    tip.endFill();
    canopy.addChild(tip);
    
    for (let i = -2; i <= 2; i++) {
      const rib = new PIXI.Graphics();
      rib.lineStyle(1.5, 0x8b4513);
      rib.moveTo(0, -75);
      rib.lineTo(i * 25, -35);
      rib.endFill();
      canopy.addChild(rib);
    }
    
    this.umbrellaCanopy.addChild(canopy);
    this.umbrella.addChild(this.umbrellaCanopy);
    
    this.tearGraphics = new PIXI.Graphics();
    this.umbrellaCanopy.addChild(this.tearGraphics);
    
    this.umbrella.pivot.set(0, -10);
    this.umbrella.y = -20;
    this.container.addChild(this.umbrella);
  }
  
  reset() {
    this.durability = 100;
    this.umbrellaOpen = true;
    this.umbrellaCooldown = 0;
    this.umbrellaAnimProgress = 1;
    this.splashBoost = 1;
    this.splashBoostTimer = 0;
    this.windPush = 0;
    this.windPushTimer = 0;
    this.shelterTimer = 0;
    this.knockback = 0;
    this.knockbackTimer = 0;
    this.waxProtection = 0;
    this.repairCooldown = 0;
    this.isRepairing = false;
    this.repairTimer = 0;
    this.velocityY = 0;
    this.isGrounded = true;
    
    this.container.x = this.game.app.screen.width / 2;
    this.container.y = this.game.groundY - 60;
  }
  
  update(dt) {
    if (this.umbrellaCooldown > 0) {
      this.umbrellaCooldown -= dt;
    }
    
    if (this.repairCooldown > 0) {
      this.repairCooldown -= dt;
    }
    
    if (this.isRepairing) {
      this.repairTimer -= dt;
      if (this.repairTimer <= 0) {
        this.isRepairing = false;
      }
    }
    
    const durabilityFactor = this.durability / 100;
    const isLowDurability = this.durability < 40;
    const isCriticalDurability = this.durability < 20;
    
    const targetProgress = this.umbrellaOpen ? 1 : 0;
    const animSpeed = isCriticalDurability ? 3 : (isLowDurability ? 5 : 8);
    this.umbrellaAnimProgress += (targetProgress - this.umbrellaAnimProgress) * animSpeed * dt;
    
    const scale = 0.3 + this.umbrellaAnimProgress * 0.7;
    this.umbrellaCanopy.scale.set(scale, scale);
    
    if (this.splashBoostTimer > 0) {
      this.splashBoostTimer -= dt;
      this.game.speedMultiplier = isLowDurability ? 1.3 : 1.5;
      if (this.splashBoostTimer <= 0) {
        this.game.speedMultiplier = 1;
      }
    }
    
    if (this.windPushTimer > 0) {
      this.windPushTimer -= dt;
      const windMultiplier = isCriticalDurability ? 1.8 : (isLowDurability ? 1.3 : 1);
      this.container.x += this.windPush * windMultiplier * dt * 60;
      this.windPush *= 0.95;
    }
    
    if (this.shelterTimer > 0) {
      this.shelterTimer -= dt;
    }
    
    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= dt;
      this.game.speedMultiplier = 0.5;
    } else if (this.splashBoostTimer <= 0) {
      this.game.speedMultiplier = 1;
    }
    
    if (this.waxProtection > 0) {
      this.waxProtection -= dt;
    }
    
    this.updateDurability(dt);
    
    this.bobTimer += dt * 4;
    const bobAmplitude = isCriticalDurability ? 4 : (isLowDurability ? 3 : 2);
    this.bobOffset = Math.sin(this.bobTimer) * bobAmplitude;
    
    if (this.isTurning) {
      const turnResponsiveness = isCriticalDurability ? 2 : (isLowDurability ? 3.5 : 5);
      const targetTilt = this.turnDirection * (isCriticalDurability ? 0.35 : (isLowDurability ? 0.28 : 0.2));
      this.turnTilt += (targetTilt - this.turnTilt) * turnResponsiveness * dt;
    } else {
      this.turnTilt *= isCriticalDurability ? 0.96 : (isLowDurability ? 0.93 : 0.9);
    }
    
    this.body.rotation = this.turnTilt * 0.5;
    
    let umbrellaRotation = this.turnTilt * 0.3;
    
    if (this.game.umbrellaTiltWarning > 0 && this.umbrellaOpen) {
      const windTilt = this.game.globalWindDirection * this.game.globalWindStrength * 0.2 * this.game.umbrellaTiltWarning;
      umbrellaRotation += windTilt;
    }
    
    if (isLowDurability && this.umbrellaOpen) {
      this.umbrellaWobble += dt * (isCriticalDurability ? 12 : 8);
      umbrellaRotation += Math.sin(this.umbrellaWobble) * (isCriticalDurability ? 0.12 : 0.06);
    }
    
    if (this.umbrellaOpen && !this.isGrounded) {
      umbrellaRotation += Math.sin(this.game.gameTime * 3) * 0.02;
    }
    
    this.umbrella.rotation = umbrellaRotation;
    
    this.updateUmbrellaTears(durabilityFactor);
    
    if (this.durability <= 0) {
      this.game.stop();
    }
  }
  
  updateUmbrellaTears(durabilityFactor) {
    if (!this.tearGraphics) return;
    
    this.tearGraphics.clear();
    
    if (durabilityFactor < 0.9) {
      const tearCount = Math.floor((1 - durabilityFactor) * 12);
      this.tearGraphics.lineStyle(1.5, 0x2c1810, 0.8);
      
      for (let i = 0; i < tearCount; i++) {
        const angle = (i / 12) * Math.PI - Math.PI / 2;
        const startR = 25 + Math.random() * 15;
        const endR = startR + 10 + Math.random() * 20;
        
        const startX = Math.cos(angle) * startR;
        const startY = -55 + Math.sin(angle) * startR * 0.6;
        const endX = Math.cos(angle) * endR;
        const endY = -55 + Math.sin(angle) * endR * 0.6;
        
        this.tearGraphics.moveTo(startX, startY);
        const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 8;
        const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 8;
        this.tearGraphics.quadraticCurveTo(midX, midY, endX, endY);
      }
      this.tearGraphics.endFill();
    }
  }
  
  updateDurability(dt) {
    if (this.shelterTimer > 0) {
      return;
    }
    
    const weather = this.game.weatherSystem.currentWeather;
    let rainDamage = 0;
    
    const durabilityFactor = this.durability / 100;
    const lowDurabilityPenalty = durabilityFactor < 0.3 ? 1.5 : (durabilityFactor < 0.5 ? 1.2 : 1);
    
    if (weather === 'light') {
      rainDamage = this.umbrellaOpen ? 0.3 : 0.8;
    } else if (weather === 'moderate') {
      rainDamage = this.umbrellaOpen ? 0.8 : 2;
    } else if (weather === 'heavy') {
      rainDamage = this.umbrellaOpen ? 1.5 : 4;
    } else if (weather === 'storm') {
      rainDamage = this.umbrellaOpen ? 3 : 8;
    }
    
    rainDamage *= lowDurabilityPenalty;
    
    if (this.game.globalWindStrength > 0 && this.umbrellaOpen) {
      rainDamage += this.game.globalWindStrength * 0.5;
    }
    
    if (this.waxProtection > 0) {
      rainDamage *= 0.5;
    }
    
    if (this.game.isRepairing) {
      this.durability += 20 * dt;
      this.durability = Math.min(this.maxDurability, this.durability);
    } else if (this.isRepairing) {
      this.durability += 10 * dt;
      this.durability = Math.min(this.maxDurability, this.durability);
    } else {
      this.durability -= rainDamage * dt;
    }
  }
  
  toggleUmbrella() {
    if (this.umbrellaCooldown > 0) return;
    
    this.umbrellaOpen = !this.umbrellaOpen;
    this.umbrellaCooldown = 0.3;
    
    if (this.umbrellaOpen) {
      this.game.speedMultiplier = 0.85;
    } else {
      this.game.speedMultiplier = 1.3;
    }
  }
  
  repairUmbrella() {
    if (this.repairCooldown > 0) return;
    if (this.durability >= this.maxDurability) return;
    
    this.isRepairing = true;
    this.repairTimer = 1.5;
    this.repairCooldown = 8;
  }
  
  getBounds() {
    const x = this.container.x - 30;
    const y = this.container.y - 70;
    const width = 60;
    const height = 100;
    
    return { x, y, width, height };
  }
  
  resize() {
    this.container.y = this.game.groundY - 60;
  }
}

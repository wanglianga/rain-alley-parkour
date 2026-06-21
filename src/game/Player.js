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
    
    const targetProgress = this.umbrellaOpen ? 1 : 0;
    this.umbrellaAnimProgress += (targetProgress - this.umbrellaAnimProgress) * 8 * dt;
    
    const scale = 0.3 + this.umbrellaAnimProgress * 0.7;
    this.umbrellaCanopy.scale.set(scale, scale);
    
    if (this.splashBoostTimer > 0) {
      this.splashBoostTimer -= dt;
      this.game.speedMultiplier = 1.5;
      if (this.splashBoostTimer <= 0) {
        this.game.speedMultiplier = 1;
      }
    }
    
    if (this.windPushTimer > 0) {
      this.windPushTimer -= dt;
      this.container.x += this.windPush * dt * 60;
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
    this.bobOffset = Math.sin(this.bobTimer) * 2;
    
    if (this.isTurning) {
      const targetTilt = this.turnDirection * 0.2;
      this.turnTilt += (targetTilt - this.turnTilt) * 5 * dt;
    } else {
      this.turnTilt *= 0.9;
    }
    
    this.body.rotation = this.turnTilt * 0.5;
    this.umbrella.rotation = this.turnTilt * 0.3;
    
    if (this.umbrellaOpen && !this.isGrounded) {
      this.umbrella.rotation += Math.sin(this.game.gameTime * 3) * 0.02;
    }
    
    if (this.durability <= 0) {
      this.game.stop();
    }
  }
  
  updateDurability(dt) {
    if (this.shelterTimer > 0) {
      return;
    }
    
    const weather = this.game.weatherSystem.currentWeather;
    let rainDamage = 0;
    
    if (weather === 'light') {
      rainDamage = this.umbrellaOpen ? 0.3 : 0.8;
    } else if (weather === 'moderate') {
      rainDamage = this.umbrellaOpen ? 0.8 : 2;
    } else if (weather === 'heavy') {
      rainDamage = this.umbrellaOpen ? 1.5 : 4;
    } else if (weather === 'storm') {
      rainDamage = this.umbrellaOpen ? 3 : 8;
    }
    
    if (this.waxProtection > 0) {
      rainDamage *= 0.5;
    }
    
    if (this.isRepairing) {
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

import * as PIXI from 'pixi.js';
import { Player } from './Player.js';
import { ObstacleManager } from './ObstacleManager.js';
import { WeatherSystem } from './WeatherSystem.js';
import { CollectibleManager } from './CollectibleManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { Background } from './Background.js';

export class Game {
  constructor() {
    this.app = null;
    this.player = null;
    this.obstacleManager = null;
    this.weatherSystem = null;
    this.collectibleManager = null;
    this.particleSystem = null;
    this.background = null;
    
    this.isRunning = false;
    this.isPaused = false;
    this.gameOver = false;
    
    this.score = 0;
    this.distance = 0;
    this.maxSpeed = 0;
    
    this.baseSpeed = 10;
    this.currentSpeed = 10;
    this.speedMultiplier = 1;
    
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      r: false,
      e: false
    };
    
    this.gameTime = 0;
    this.difficultyTimer = 0;
    
    this.groundY = 0;
    this.laneWidth = 0;
    this.lanes = 3;
    this.currentLane = 1;
    this.targetLane = 1;
    this.laneChangeSpeed = 0;
    
    this.onScoreUpdate = null;
    this.onDistanceUpdate = null;
    this.onDurabilityUpdate = null;
    this.onSpeedUpdate = null;
    this.onWeatherUpdate = null;
    this.onGameOver = null;
    this.onWarningUpdate = null;
    this.onDeliveryTimeUpdate = null;
    this.onRepairAvailable = null;
    this.onUmbrellaTiltUpdate = null;
    
    this.deliveryTime = 0;
    this.deliveryBonus = 0;
    this.consecutiveDeliveries = 0;
    
    this.globalWindDirection = 0;
    this.globalWindStrength = 0;
    this.globalWindTimer = 0;
    
    this.isRepairing = false;
    this.repairTimer = 0;
    this.repairObstacle = null;
    
    this.shortcutActive = false;
    this.shortcutTimer = 0;
    
    this.umbrellaTiltWarning = 0;
  }
  
  init() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });
    
    document.getElementById('game-container').appendChild(this.app.view);
    
    this.groundY = this.app.screen.height * 0.75;
    this.laneWidth = this.app.screen.width * 0.2;
    
    this.background = new Background(this);
    this.background.init();
    
    this.weatherSystem = new WeatherSystem(this);
    this.weatherSystem.init();
    
    this.particleSystem = new ParticleSystem(this);
    this.particleSystem.init();
    
    this.obstacleManager = new ObstacleManager(this);
    this.obstacleManager.init();
    
    this.collectibleManager = new CollectibleManager(this);
    this.collectibleManager.init();
    
    this.player = new Player(this);
    this.player.init();
    
    this.app.stage.addChild(this.background.container);
    this.app.stage.addChild(this.obstacleManager.container);
    this.app.stage.addChild(this.collectibleManager.container);
    this.app.stage.addChild(this.player.container);
    this.app.stage.addChild(this.particleSystem.container);
    this.app.stage.addChild(this.weatherSystem.container);
    
    this.app.ticker.add(this.update.bind(this));
  }
  
  start() {
    this.isRunning = true;
    this.gameOver = false;
    this.score = 0;
    this.distance = 0;
    this.maxSpeed = 0;
    this.currentSpeed = this.baseSpeed;
    this.gameTime = 0;
    this.difficultyTimer = 0;
    this.currentLane = 1;
    this.targetLane = 1;
    
    this.deliveryTime = 0;
    this.deliveryBonus = 0;
    this.consecutiveDeliveries = 0;
    this.globalWindDirection = 0;
    this.globalWindStrength = 0;
    this.globalWindTimer = 0;
    this.isRepairing = false;
    this.repairTimer = 0;
    this.repairObstacle = null;
    this.shortcutActive = false;
    this.shortcutTimer = 0;
    this.umbrellaTiltWarning = 0;
    
    this.player.reset();
    this.obstacleManager.reset();
    this.collectibleManager.reset();
    this.weatherSystem.reset();
  }
  
  restart() {
    this.start();
  }
  
  stop() {
    this.isRunning = false;
    this.gameOver = true;
    
    if (this.onGameOver) {
      this.onGameOver({
        score: Math.floor(this.score),
        distance: Math.floor(this.distance),
        maxSpeed: this.maxSpeed.toFixed(1),
        deliveryBonus: this.deliveryBonus
      });
    }
  }
  
  update(delta) {
    if (!this.isRunning || this.isPaused || this.gameOver) return;
    
    const dt = delta / 60;
    this.gameTime += dt;
    this.difficultyTimer += dt;
    this.deliveryTime += dt;
    
    this.updateDifficulty();
    this.updateLanePosition(dt);
    this.updateGlobalWind(dt);
    this.updateRepair(dt);
    this.updateShortcut(dt);
    this.updateUmbrellaTiltWarning(dt);
    
    let effectiveSpeedMultiplier = this.speedMultiplier;
    if (this.isRepairing) {
      effectiveSpeedMultiplier = 0.3;
    }
    if (this.shortcutActive) {
      effectiveSpeedMultiplier *= 1.8;
    }
    
    const speed = this.currentSpeed * effectiveSpeedMultiplier;
    if (speed > this.maxSpeed) {
      this.maxSpeed = speed;
    }
    
    this.distance += speed * dt * 10;
    this.score += speed * dt * 0.5;
    
    this.deliveryBonus = Math.floor(this.deliveryTime / 10) * 50;
    
    this.background.update(dt, speed);
    this.weatherSystem.update(dt);
    this.particleSystem.update(dt, speed);
    this.obstacleManager.update(dt, speed);
    this.collectibleManager.update(dt, speed);
    this.player.update(dt);
    
    this.checkCollisions();
    this.updateUI();
  }
  
  updateGlobalWind(dt) {
    this.globalWindTimer += dt;
    if (this.globalWindTimer > 8) {
      this.globalWindTimer = 0;
      const rand = Math.random();
      if (rand < 0.3) {
        this.globalWindDirection = -1;
        this.globalWindStrength = 1.5;
      } else if (rand < 0.6) {
        this.globalWindDirection = 1;
        this.globalWindStrength = 1.5;
      } else {
        this.globalWindDirection = 0;
        this.globalWindStrength = 0;
      }
    }
    
    if (this.globalWindStrength > 0 && this.player.umbrellaOpen) {
      this.player.container.x += this.globalWindDirection * this.globalWindStrength * dt * 30;
    }
  }
  
  updateRepair(dt) {
    if (this.isRepairing) {
      this.repairTimer -= dt;
      if (this.repairTimer <= 0) {
        this.isRepairing = false;
        if (this.repairObstacle) {
          this.player.durability = Math.min(100, this.player.durability + this.repairObstacle.repairAmount);
          this.consecutiveDeliveries++;
          this.addScore(100 + this.consecutiveDeliveries * 20);
          this.repairObstacle.used = true;
        }
        this.repairObstacle = null;
        if (this.onRepairAvailable) {
          this.onRepairAvailable({ available: false, progress: 0 });
        }
      } else {
        if (this.onRepairAvailable) {
          const progress = 1 - (this.repairTimer / (this.repairObstacle?.repairDuration || 2));
          this.onRepairAvailable({ available: true, progress: progress });
        }
      }
    }
  }
  
  updateShortcut(dt) {
    if (this.shortcutActive) {
      this.shortcutTimer -= dt;
      if (this.shortcutTimer <= 0) {
        this.shortcutActive = false;
      }
    }
  }
  
  updateUmbrellaTiltWarning(dt) {
    if (this.globalWindStrength > 0 || this.player.windPushTimer > 0) {
      this.umbrellaTiltWarning = Math.min(1, this.umbrellaTiltWarning + dt * 2);
    } else {
      this.umbrellaTiltWarning = Math.max(0, this.umbrellaTiltWarning - dt * 2);
    }
  }
  
  updateDifficulty() {
    if (this.difficultyTimer > 10) {
      this.difficultyTimer = 0;
      this.currentSpeed = Math.min(this.currentSpeed + 0.5, 25);
    }
  }
  
  updateLanePosition(dt) {
    if (this.currentLane !== this.targetLane) {
      const dir = this.targetLane > this.currentLane ? 1 : -1;
      const changeSpeed = 8 * dt;
      this.laneChangeSpeed += changeSpeed * dir;
      this.laneChangeSpeed *= 0.92;
      
      const centerX = this.app.screen.width / 2;
      const targetX = centerX + (this.targetLane - 1) * this.laneWidth;
      const currentX = centerX + (this.currentLane - 1) * this.laneWidth;
      
      const playerX = this.player.container.x;
      const diff = targetX - playerX;
      
      if (Math.abs(diff) < 5) {
        this.player.container.x = targetX;
        this.currentLane = this.targetLane;
        this.laneChangeSpeed = 0;
        this.player.isTurning = false;
      } else {
        this.player.container.x += diff * 10 * dt;
        this.player.isTurning = true;
        this.player.turnDirection = dir;
      }
    }
  }
  
  checkCollisions() {
    const playerBounds = this.player.getBounds();
    
    const obstacles = this.obstacleManager.getObstacles();
    for (const obstacle of obstacles) {
      if (obstacle.active && this.intersects(playerBounds, obstacle.getBounds())) {
        this.handleObstacleCollision(obstacle);
      }
    }
    
    const collectibles = this.collectibleManager.getCollectibles();
    for (let i = collectibles.length - 1; i >= 0; i--) {
      const collectible = collectibles[i];
      if (collectible.active && this.intersects(playerBounds, collectible.getBounds())) {
        this.handleCollectible(collectible);
        this.collectibleManager.remove(i);
      }
    }
  }
  
  intersects(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }
  
  handleObstacleCollision(obstacle) {
    if (obstacle.type === 'eaves') {
      if (this.player.umbrellaOpen) {
        this.player.shelterTimer = 0.5;
      }
      return;
    }
    
    if (obstacle.type === 'puddle') {
      if (!obstacle.triggered) {
        obstacle.triggered = true;
        this.player.splashBoost = 2;
        this.player.splashBoostTimer = 1.5;
        this.particleSystem.createSplash(obstacle.x, this.groundY);
        this.addScore(50);
        
        if (this.player.umbrellaOpen) {
          this.player.durability -= 3;
        }
      }
      return;
    }
    
    if (obstacle.type === 'wind_chime' || obstacle.type === 'rain_curtain') {
      if (!obstacle.triggered) {
        obstacle.triggered = true;
        if (obstacle.type === 'rain_curtain') {
          if (this.onWarningUpdate) {
            this.onWarningUpdate({ type: 'rain', message: '暴雨来袭！', duration: 2 });
          }
          this.weatherSystem.currentWeather = 'storm';
          this.weatherSystem.updateRainIntensity();
          setTimeout(() => {
            if (this.weatherSystem) {
              this.weatherSystem.currentWeather = 'heavy';
              this.weatherSystem.updateRainIntensity();
            }
          }, 5000);
        } else {
          if (this.onWarningUpdate) {
            this.onWarningUpdate({ type: 'wind', message: '强风预警！', duration: 2 });
          }
        }
      }
      return;
    }
    
    if (obstacle.type === 'repair_stall') {
      if (!obstacle.triggered && !obstacle.used && !this.isRepairing) {
        if (this.onRepairAvailable) {
          this.onRepairAvailable({ available: true, canRepair: this.player.durability < 100, stall: obstacle });
        }
      }
      return;
    }
    
    if (obstacle.type === 'shortcut') {
      if (!obstacle.triggered) {
        obstacle.triggered = true;
        this.shortcutActive = true;
        this.shortcutTimer = obstacle.boostDuration || 3;
        this.player.durability -= obstacle.durabilityDamage || 5;
        this.addScore(30);
      }
      return;
    }
    
    if (obstacle.triggered) return;
    
    if (obstacle.type === 'wind') {
      obstacle.triggered = true;
      if (this.player.umbrellaOpen) {
        this.player.windPush = obstacle.strength;
        this.player.windPushTimer = 0.3;
        this.player.durability -= obstacle.durabilityDamage * 0.5;
      } else {
        this.player.durability -= obstacle.durabilityDamage * 0.2;
      }
      return;
    }
    
    if (obstacle.type === 'alley' || obstacle.type === 'bridge_wind' || obstacle.type === 'building_gap') {
      const windDir = obstacle.windDirection !== 0 ? obstacle.windDirection : (Math.random() > 0.5 ? 1 : -1);
      const pushStrength = obstacle.strength * (this.player.umbrellaOpen ? 1.5 : 0.8);
      
      this.player.windPush = windDir * pushStrength;
      this.player.windPushTimer = 0.5;
      
      let damage = obstacle.durabilityDamage;
      if (this.player.umbrellaOpen) {
        damage *= 0.6;
        this.addScore(10);
      } else {
        damage *= 1.2;
      }
      this.player.durability -= damage;
      
      if (this.onWarningUpdate) {
        this.onWarningUpdate({ type: 'wind', message: obstacle.type === 'alley' ? '巷口阵风！' : obstacle.type === 'bridge_wind' ? '桥面横风！' : '高楼夹缝气流！', duration: 1.5 });
      }
      return;
    }
    
    if (obstacle.type === 'lantern' || obstacle.type === 'narrow') {
      if (this.player.umbrellaOpen) {
        obstacle.triggered = true;
        this.player.durability -= obstacle.durabilityDamage;
        this.player.umbrellaOpen = false;
        this.player.umbrellaCooldown = 1;
        this.addScore(-30);
        this.consecutiveDeliveries = 0;
      }
      return;
    }
    
    if (obstacle.type === 'bridge' || obstacle.type === 'steps') {
      obstacle.triggered = true;
      this.player.durability -= obstacle.durabilityDamage;
      this.addScore(-20);
      this.player.knockback = 3;
      this.player.knockbackTimer = 0.5;
      this.consecutiveDeliveries = 0;
      return;
    }
    
    obstacle.triggered = true;
    this.player.durability -= obstacle.durabilityDamage || 10;
    this.addScore(-10);
    this.consecutiveDeliveries = 0;
  }
  
  handleCollectible(collectible) {
    if (collectible.type === 'paper') {
      this.player.durability = Math.min(100, this.player.durability + 15);
      this.addScore(100 + this.consecutiveDeliveries * 10);
    } else if (collectible.type === 'wax') {
      this.player.durability = Math.min(100, this.player.durability + 25);
      this.player.waxProtection = 5;
      this.addScore(150 + this.consecutiveDeliveries * 15);
    } else if (collectible.type === 'coin') {
      this.addScore(200 + this.consecutiveDeliveries * 20);
      this.consecutiveDeliveries++;
    }
  }
  
  addScore(amount) {
    this.score = Math.max(0, this.score + amount);
  }
  
  updateUI() {
    if (this.onScoreUpdate) {
      this.onScoreUpdate(Math.floor(this.score));
    }
    if (this.onDistanceUpdate) {
      this.onDistanceUpdate(Math.floor(this.distance));
    }
    if (this.onDurabilityUpdate) {
      this.onDurabilityUpdate(Math.max(0, this.player.durability));
    }
    if (this.onSpeedUpdate) {
      const effectiveMultiplier = this.speedMultiplier * (this.shortcutActive ? 1.8 : 1) * (this.isRepairing ? 0.3 : 1);
      const speedPercent = (this.currentSpeed * effectiveMultiplier / 15) * 100;
      this.onSpeedUpdate(Math.min(100, speedPercent));
    }
    if (this.onDeliveryTimeUpdate) {
      this.onDeliveryTimeUpdate({
        time: Math.floor(this.deliveryTime),
        bonus: this.deliveryBonus,
        consecutive: this.consecutiveDeliveries
      });
    }
    
    if (this.onUmbrellaTiltUpdate) {
      const tiltDir = this.globalWindDirection;
      const tiltIntensity = this.umbrellaTiltWarning * this.globalWindStrength;
      this.onUmbrellaTiltUpdate(tiltDir, tiltIntensity);
    }
  }
  
  tryStartRepair() {
    if (this.isRepairing) return;
    
    const playerBounds = this.player.getBounds();
    const obstacles = this.obstacleManager.getObstacles();
    
    for (const obstacle of obstacles) {
      if (obstacle.type === 'repair_stall' && !obstacle.used && obstacle.active) {
        const obstacleBounds = obstacle.getBounds();
        if (this.intersects(playerBounds, obstacleBounds)) {
          this.isRepairing = true;
          this.repairTimer = obstacle.repairDuration || 2;
          this.repairObstacle = obstacle;
          return true;
        }
      }
    }
    return false;
  }
  
  handleKeyDown(e) {
    switch(e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        if (!this.keys.left) {
          this.keys.left = true;
          this.moveLeft();
        }
        break;
      case 'ArrowRight':
      case 'KeyD':
        if (!this.keys.right) {
          this.keys.right = true;
          this.moveRight();
        }
        break;
      case 'ArrowUp':
      case 'KeyW':
        this.keys.up = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.down = true;
        break;
      case 'Space':
        e.preventDefault();
        if (!this.keys.space) {
          this.keys.space = true;
          this.toggleUmbrella();
        }
        break;
      case 'KeyR':
        if (!this.keys.r) {
          this.keys.r = true;
          this.player.repairUmbrella();
        }
        break;
      case 'KeyE':
        if (!this.keys.e) {
          this.keys.e = true;
          this.tryStartRepair();
        }
        break;
    }
  }
  
  handleKeyUp(e) {
    switch(e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'ArrowUp':
      case 'KeyW':
        this.keys.up = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.down = false;
        break;
      case 'Space':
        this.keys.space = false;
        break;
      case 'KeyR':
        this.keys.r = false;
        break;
      case 'KeyE':
        this.keys.e = false;
        break;
    }
  }
  
  moveLeft() {
    if (!this.isRunning || this.gameOver) return;
    if (this.targetLane > 0) {
      this.targetLane--;
    }
  }
  
  moveRight() {
    if (!this.isRunning || this.gameOver) return;
    if (this.targetLane < this.lanes - 1) {
      this.targetLane++;
    }
  }
  
  toggleUmbrella() {
    if (!this.isRunning || this.gameOver) return;
    this.player.toggleUmbrella();
  }
  
  resize() {
    if (this.app) {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.groundY = this.app.screen.height * 0.75;
      this.laneWidth = this.app.screen.width * 0.2;
      
      if (this.background) this.background.resize();
      if (this.player) this.player.resize();
      if (this.obstacleManager) this.obstacleManager.resize();
      if (this.collectibleManager) this.collectibleManager.resize();
    }
  }
  
  getLaneX(lane) {
    const centerX = this.app.screen.width / 2;
    return centerX + (lane - 1) * this.laneWidth;
  }
}

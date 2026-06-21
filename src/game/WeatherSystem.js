import * as PIXI from 'pixi.js';

export class WeatherSystem {
  constructor(game) {
    this.game = game;
    this.container = new PIXI.Container();
    
    this.currentWeather = 'light';
    this.weatherTimer = 0;
    this.weatherDuration = 30;
    
    this.raindrops = [];
    this.maxRaindrops = 200;
    
    this.weatherTypes = ['light', 'moderate', 'heavy', 'storm'];
    this.weatherNames = {
      light: '小雨',
      moderate: '中雨',
      heavy: '大雨',
      storm: '暴雨'
    };
    this.weatherIcons = {
      light: '🌦️',
      moderate: '🌧️',
      heavy: '⛈️',
      storm: '🌪️'
    };
    
    this.raindropPool = [];
  }
  
  init() {
    this.createRaindrops();
  }
  
  reset() {
    this.currentWeather = 'light';
    this.weatherTimer = 0;
    this.updateRainIntensity();
  }
  
  createRaindrops() {
    for (let i = 0; i < this.maxRaindrops; i++) {
      const drop = new PIXI.Graphics();
      drop.lineStyle(1.5, 0xa8d8ea, 0.6);
      drop.moveTo(0, 0);
      drop.lineTo(2, 15);
      drop.endFill();
      
      drop.x = Math.random() * this.game.app.screen.width;
      drop.y = Math.random() * this.game.app.screen.height;
      drop.speed = 300 + Math.random() * 200;
      drop.angle = 0.1 + Math.random() * 0.1;
      drop.length = 10 + Math.random() * 10;
      
      this.raindrops.push(drop);
      this.container.addChild(drop);
    }
    
    this.updateRainIntensity();
  }
  
  updateRainIntensity() {
    let visibleCount = 0;
    let speedMultiplier = 1;
    
    switch(this.currentWeather) {
      case 'light':
        visibleCount = 50;
        speedMultiplier = 0.8;
        break;
      case 'moderate':
        visibleCount = 120;
        speedMultiplier = 1;
        break;
      case 'heavy':
        visibleCount = 180;
        speedMultiplier = 1.3;
        break;
      case 'storm':
        visibleCount = 250;
        speedMultiplier = 1.8;
        break;
    }
    
    for (let i = 0; i < this.raindrops.length; i++) {
      const drop = this.raindrops[i];
      drop.visible = i < visibleCount;
      drop.baseSpeed = (300 + Math.random() * 200) * speedMultiplier;
    }
  }
  
  update(dt) {
    this.weatherTimer += dt;
    
    if (this.weatherTimer >= this.weatherDuration) {
      this.weatherTimer = 0;
      this.changeWeather();
    }
    
    const windOffset = this.game.player.windPush * 2;
    
    for (const drop of this.raindrops) {
      if (!drop.visible) continue;
      
      drop.y += drop.baseSpeed * dt;
      drop.x += windOffset + drop.angle * drop.baseSpeed * 0.3 * dt;
      
      if (drop.y > this.game.app.screen.height + 20) {
        drop.y = -20;
        drop.x = Math.random() * this.game.app.screen.width;
      }
      
      if (drop.x > this.game.app.screen.width + 20) {
        drop.x = -20;
      }
      if (drop.x < -20) {
        drop.x = this.game.app.screen.width + 20;
      }
    }
    
    if (this.game.onWeatherUpdate) {
      this.game.onWeatherUpdate({
        type: this.currentWeather,
        name: this.weatherNames[this.currentWeather],
        icon: this.weatherIcons[this.currentWeather]
      });
    }
  }
  
  changeWeather() {
    const currentIndex = this.weatherTypes.indexOf(this.currentWeather);
    
    let nextIndex;
    const rand = Math.random();
    
    if (rand < 0.3) {
      nextIndex = Math.max(0, currentIndex - 1);
    } else if (rand < 0.6) {
      nextIndex = Math.min(this.weatherTypes.length - 1, currentIndex + 1);
    } else {
      nextIndex = currentIndex;
    }
    
    this.currentWeather = this.weatherTypes[nextIndex];
    this.updateRainIntensity();
    this.weatherDuration = 20 + Math.random() * 30;
  }
  
  resize() {
    
  }
}

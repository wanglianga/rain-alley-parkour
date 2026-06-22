export class UIManager {
  constructor(game) {
    this.game = game;
    
    this.startScreen = document.getElementById('start-screen');
    this.gameHud = document.getElementById('game-hud');
    this.endScreen = document.getElementById('end-screen');
    
    this.distanceEl = document.getElementById('distance');
    this.scoreEl = document.getElementById('score');
    this.durabilityFill = document.getElementById('durability-fill');
    this.durabilityText = document.getElementById('durability-text');
    this.speedFill = document.getElementById('speed-fill');
    this.weatherIcon = document.getElementById('weather-icon');
    this.weatherText = document.getElementById('weather-text');
    
    this.deliveryTimeEl = document.getElementById('delivery-time');
    this.deliveryBonusEl = document.getElementById('delivery-bonus');
    this.consecutiveEl = document.getElementById('consecutive');
    
    this.warningContainer = document.getElementById('warning-container');
    this.warningMessage = document.getElementById('warning-message');
    
    this.repairPrompt = document.getElementById('repair-prompt');
    this.repairProgressFill = document.getElementById('repair-progress-fill');
    
    this.umbrellaTiltIndicator = document.getElementById('umbrella-tilt-indicator');
    this.tiltArrowLeft = document.getElementById('tilt-arrow-left');
    this.tiltArrowRight = document.getElementById('tilt-arrow-right');
    
    this.finalDistance = document.getElementById('final-distance');
    this.finalScore = document.getElementById('final-score');
    this.finalSpeed = document.getElementById('final-speed');
    this.finalDeliveryBonus = document.getElementById('final-delivery-bonus');
    
    this.warningTimer = null;
  }
  
  init() {
    this.game.onScoreUpdate = (score) => {
      this.scoreEl.textContent = score;
    };
    
    this.game.onDistanceUpdate = (distance) => {
      this.distanceEl.textContent = distance;
    };
    
    this.game.onDurabilityUpdate = (durability) => {
      this.updateDurability(durability);
    };
    
    this.game.onSpeedUpdate = (speedPercent) => {
      this.speedFill.style.width = speedPercent + '%';
    };
    
    this.game.onWeatherUpdate = (weather) => {
      this.weatherIcon.textContent = weather.icon;
      this.weatherText.textContent = weather.name;
    };
    
    this.game.onWarningUpdate = (warning) => {
      this.showWarning(warning);
    };
    
    this.game.onDeliveryTimeUpdate = (data) => {
      this.updateDeliveryInfo(data);
    };
    
    this.game.onRepairAvailable = (data) => {
      this.updateRepairPrompt(data);
    };
    
    this.game.onGameOver = (stats) => {
      this.showEnd(stats);
    };
    
    this.game.onUmbrellaTiltUpdate = (direction, intensity) => {
      this.updateUmbrellaTilt(direction, intensity);
    };
  }
  
  updateDurability(durability) {
    const percent = Math.max(0, Math.min(100, durability));
    this.durabilityFill.style.width = percent + '%';
    this.durabilityText.textContent = Math.floor(percent) + '%';
    
    this.durabilityFill.classList.remove('warning', 'danger', 'critical');
    if (percent <= 20) {
      this.durabilityFill.classList.add('critical');
    } else if (percent <= 40) {
      this.durabilityFill.classList.add('danger');
    } else if (percent <= 60) {
      this.durabilityFill.classList.add('warning');
    }
    
    if (percent <= 40) {
      this.durabilityText.style.animation = 'shake 0.3s infinite';
    } else {
      this.durabilityText.style.animation = '';
    }
  }
  
  showWarning(warning) {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
    }
    
    this.warningContainer.className = 'warning-container';
    this.warningContainer.classList.add('active', warning.type || 'danger');
    this.warningMessage.textContent = warning.message || '';
    
    this.warningTimer = setTimeout(() => {
      this.warningContainer.classList.remove('active');
    }, (warning.duration || 2) * 1000);
  }
  
  updateDeliveryInfo(data) {
    const minutes = Math.floor(data.time / 60);
    const seconds = data.time % 60;
    this.deliveryTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    this.deliveryBonusEl.textContent = '+' + data.bonus;
    this.consecutiveEl.textContent = data.consecutive;
  }
  
  updateRepairPrompt(data) {
    if (data.available && data.canRepair && !this.game.isRepairing) {
      this.repairPrompt.classList.add('active');
      this.repairProgressFill.style.width = '0%';
    } else if (this.game.isRepairing) {
      this.repairPrompt.classList.add('active');
      this.repairProgressFill.style.width = (data.progress * 100) + '%';
    } else {
      this.repairPrompt.classList.remove('active');
      this.repairProgressFill.style.width = '0%';
    }
  }
  
  updateUmbrellaTilt(direction, intensity) {
    if (intensity > 0.1) {
      this.umbrellaTiltIndicator.classList.add('active');
      if (direction < 0) {
        this.tiltArrowLeft.style.opacity = intensity;
        this.tiltArrowRight.style.opacity = 0;
      } else {
        this.tiltArrowLeft.style.opacity = 0;
        this.tiltArrowRight.style.opacity = intensity;
      }
    } else {
      this.umbrellaTiltIndicator.classList.remove('active');
      this.tiltArrowLeft.style.opacity = 0;
      this.tiltArrowRight.style.opacity = 0;
    }
  }
  
  showStart() {
    this.startScreen.classList.add('active');
    this.gameHud.classList.remove('active');
    this.endScreen.classList.remove('active');
    this.warningContainer.classList.remove('active');
    this.repairPrompt.classList.remove('active');
  }
  
  showGame() {
    this.startScreen.classList.remove('active');
    this.gameHud.classList.add('active');
    this.endScreen.classList.remove('active');
  }
  
  showEnd(stats) {
    this.startScreen.classList.remove('active');
    this.gameHud.classList.remove('active');
    this.endScreen.classList.add('active');
    this.warningContainer.classList.remove('active');
    this.repairPrompt.classList.remove('active');
    
    this.finalDistance.textContent = stats.distance + ' 米';
    this.finalScore.textContent = stats.score;
    this.finalSpeed.textContent = stats.maxSpeed + ' m/s';
    this.finalDeliveryBonus.textContent = stats.deliveryBonus || 0;
  }
}

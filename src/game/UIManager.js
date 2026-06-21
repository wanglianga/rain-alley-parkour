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
    
    this.finalDistance = document.getElementById('final-distance');
    this.finalScore = document.getElementById('final-score');
    this.finalSpeed = document.getElementById('final-speed');
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
    
    this.game.onGameOver = (stats) => {
      this.showEnd(stats);
    };
  }
  
  updateDurability(durability) {
    const percent = Math.max(0, Math.min(100, durability));
    this.durabilityFill.style.width = percent + '%';
    this.durabilityText.textContent = Math.floor(percent) + '%';
    
    this.durabilityFill.classList.remove('warning', 'danger');
    if (percent <= 30) {
      this.durabilityFill.classList.add('danger');
    } else if (percent <= 60) {
      this.durabilityFill.classList.add('warning');
    }
  }
  
  showStart() {
    this.startScreen.classList.add('active');
    this.gameHud.classList.remove('active');
    this.endScreen.classList.remove('active');
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
    
    this.finalDistance.textContent = stats.distance + ' 米';
    this.finalScore.textContent = stats.score;
    this.finalSpeed.textContent = stats.maxSpeed + ' m/s';
  }
}

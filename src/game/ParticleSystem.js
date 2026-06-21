import * as PIXI from 'pixi.js';

export class ParticleSystem {
  constructor(game) {
    this.game = game;
    this.container = new PIXI.Container();
    this.particles = [];
    this.splashes = [];
  }
  
  init() {
    
  }
  
  update(dt, speed) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
      p.life -= dt;
      p.alpha = p.life / p.maxLife;
      
      p.graphics.x = p.x;
      p.graphics.y = p.y;
      p.graphics.alpha = p.alpha;
      
      if (p.life <= 0) {
        this.container.removeChild(p.graphics);
        this.particles.splice(i, 1);
      }
    }
    
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const splash = this.splashes[i];
      splash.life -= dt;
      splash.scale += dt * 3;
      
      splash.graphics.scale.set(splash.scale);
      splash.graphics.alpha = splash.life / splash.maxLife * 0.6;
      
      if (splash.life <= 0) {
        this.container.removeChild(splash.graphics);
        this.splashes.splice(i, 1);
      }
    }
  }
  
  createSplash(x, y) {
    const splashG = new PIXI.Graphics();
    splashG.beginFill(0x7ab8e8);
    splashG.drawCircle(0, 0, 20);
    splashG.endFill();
    
    splashG.x = x;
    splashG.y = y;
    
    this.container.addChild(splashG);
    this.splashes.push({
      graphics: splashG,
      x: x,
      y: y,
      life: 0.5,
      maxLife: 0.5,
      scale: 0.5
    });
    
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI / 6) + (Math.random() * Math.PI * 2 / 3);
      const speed = 100 + Math.random() * 100;
      
      const g = new PIXI.Graphics();
      g.beginFill(0xa8d8ea);
      g.drawCircle(0, 0, 3 + Math.random() * 3);
      g.endFill();
      
      g.x = x;
      g.y = y;
      
      this.container.addChild(g);
      this.particles.push({
        graphics: g,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.sin(angle) * speed,
        gravity: 300,
        life: 0.8,
        maxLife: 0.8,
        alpha: 1
      });
    }
  }
  
  createRainSplash(x, y) {
    const g = new PIXI.Graphics();
    g.beginFill(0xa8d8ea, 0.5);
    g.drawCircle(0, 0, 2);
    g.endFill();
    
    g.x = x;
    g.y = y;
    
    this.container.addChild(g);
    this.particles.push({
      graphics: g,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 20,
      vy: -20 - Math.random() * 30,
      gravity: 100,
      life: 0.3,
      maxLife: 0.3,
      alpha: 0.5
    });
  }
}

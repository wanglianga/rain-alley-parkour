import * as PIXI from 'pixi.js';

export class Background {
  constructor(game) {
    this.game = game;
    this.container = new PIXI.Container();
    
    this.layers = [];
    this.buildings = [];
    this.ground = null;
    
    this.scrollSpeed = 0;
  }
  
  init() {
    this.createSky();
    this.createDistantBuildings();
    this.createNearBuildings();
    this.createGround();
    this.createStreetLamps();
  }
  
  createSky() {
    const sky = new PIXI.Graphics();
    
    const gradient = new PIXI.Graphics();
    gradient.beginFill(0x2c3e50);
    gradient.drawRect(0, 0, this.game.app.screen.width, this.game.app.screen.height);
    gradient.endFill();
    
    sky.beginFill(0x1a1a2e);
    sky.drawRect(0, 0, this.game.app.screen.width, this.game.app.screen.height * 0.6);
    sky.endFill();
    
    sky.beginFill(0x16213e);
    sky.drawRect(0, this.game.app.screen.height * 0.4, this.game.app.screen.width, this.game.app.screen.height * 0.2);
    sky.endFill();
    
    this.container.addChild(sky);
    this.sky = sky;
  }
  
  createDistantBuildings() {
    const buildings = new PIXI.Container();
    const buildingColors = [0x1a1a2e, 0x16213e, 0x0f3460];
    
    let x = 0;
    while (x < this.game.app.screen.width * 2) {
      const width = 60 + Math.random() * 100;
      const height = 100 + Math.random() * 150;
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      
      const building = new PIXI.Graphics();
      building.beginFill(color);
      building.drawRect(x, this.game.groundY - height, width, height);
      building.endFill();
      
      const windowRows = Math.floor(height / 30);
      const windowCols = Math.floor(width / 25);
      building.beginFill(0xf5d76e);
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          if (Math.random() > 0.4) {
            building.drawRect(
              x + 10 + col * 25,
              this.game.groundY - height + 15 + row * 30,
              12, 18
            );
          }
        }
      }
      building.endFill();
      
      building.alpha = 0.6;
      buildings.addChild(building);
      
      x += width + 10 + Math.random() * 30;
    }
    
    this.distantBuildings = buildings;
    this.container.addChild(buildings);
  }
  
  createNearBuildings() {
    const buildings = new PIXI.Container();
    
    const leftBuildings = this.createBuildingRow('left');
    const rightBuildings = this.createBuildingRow('right');
    
    buildings.addChild(leftBuildings);
    buildings.addChild(rightBuildings);
    
    this.nearBuildings = buildings;
    this.container.addChild(buildings);
  }
  
  createBuildingRow(side) {
    const row = new PIXI.Container();
    const buildingColors = [0x3d2914, 0x5c3d2e, 0x4a3728, 0x6b4423];
    
    let y = 0;
    const totalHeight = this.game.app.screen.height * 2;
    
    while (y < totalHeight) {
      const height = 80 + Math.random() * 120;
      const width = side === 'left' 
        ? this.game.app.screen.width * 0.25 + Math.random() * 50
        : this.game.app.screen.width * 0.25 + Math.random() * 50;
      
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      
      const building = new PIXI.Graphics();
      building.beginFill(color);
      
      if (side === 'left') {
        building.drawRect(0, y, width, height);
      } else {
        building.drawRect(this.game.app.screen.width - width, y, width, height);
      }
      building.endFill();
      
      const roofColor = 0x2c1810;
      building.beginFill(roofColor);
      if (side === 'left') {
        building.moveTo(0, y);
        building.lineTo(width + 20, y);
        building.lineTo(width, y - 15);
        building.lineTo(0, y - 15);
      } else {
        building.moveTo(this.game.app.screen.width, y);
        building.lineTo(this.game.app.screen.width - width - 20, y);
        building.lineTo(this.game.app.screen.width - width, y - 15);
        building.lineTo(this.game.app.screen.width, y - 15);
      }
      building.closePath();
      building.endFill();
      
      const windowCount = Math.floor(height / 40);
      building.beginFill(0xf5d76e);
      for (let i = 0; i < windowCount; i++) {
        const wy = y + 20 + i * 40;
        if (side === 'left') {
          if (Math.random() > 0.3) {
            building.drawRect(width - 30, wy, 18, 25);
          }
        } else {
          if (Math.random() > 0.3) {
            building.drawRect(this.game.app.screen.width - width + 12, wy, 18, 25);
          }
        }
      }
      building.endFill();
      
      row.addChild(building);
      y += height + 5;
    }
    
    return row;
  }
  
  createGround() {
    const ground = new PIXI.Graphics();
    
    ground.beginFill(0x2c2c2c);
    ground.drawRect(0, this.game.groundY, this.game.app.screen.width, this.game.app.screen.height - this.game.groundY);
    ground.endFill();
    
    ground.beginFill(0x3d3d3d);
    ground.drawRect(0, this.game.groundY, this.game.app.screen.width, 10);
    ground.endFill();
    
    const centerX = this.game.app.screen.width / 2;
    ground.lineStyle(2, 0x4a4a4a, 0.5);
    for (let i = 0; i < 50; i++) {
      const y = this.game.groundY + 20 + i * 40;
      ground.moveTo(centerX - 5, y);
      ground.lineTo(centerX + 5, y + 20);
    }
    ground.endFill();
    
    this.ground = ground;
    this.container.addChild(ground);
  }
  
  createStreetLamps() {
    const lamps = new PIXI.Container();
    
    for (let i = 0; i < 6; i++) {
      const y = -100 + i * 200;
      
      const leftLamp = this.createStreetLamp();
      leftLamp.x = this.game.app.screen.width * 0.2;
      leftLamp.y = y;
      lamps.addChild(leftLamp);
      
      const rightLamp = this.createStreetLamp();
      rightLamp.x = this.game.app.screen.width * 0.8;
      rightLamp.y = y;
      lamps.addChild(rightLamp);
    }
    
    this.streetLamps = lamps;
    this.container.addChild(lamps);
  }
  
  createStreetLamp() {
    const lamp = new PIXI.Container();
    
    const pole = new PIXI.Graphics();
    pole.beginFill(0x1a1a1a);
    pole.drawRect(-3, -80, 6, 100);
    pole.endFill();
    
    pole.beginFill(0x2a2a2a);
    pole.drawRect(-10, -85, 20, 8);
    pole.endFill();
    
    const light = new PIXI.Graphics();
    light.beginFill(0xf5d76e, 0.6);
    light.moveTo(-20, -85);
    light.lineTo(-30, -120);
    light.lineTo(30, -120);
    light.lineTo(20, -85);
    light.closePath();
    light.endFill();
    
    light.beginFill(0xf5d76e, 0.8);
    light.drawRoundedRect(-15, -90, 30, 20, 3);
    light.endFill();
    
    lamp.addChild(pole);
    lamp.addChild(light);
    
    return lamp;
  }
  
  update(dt, speed) {
    const scrollAmount = speed * dt * 60;
    
    if (this.nearBuildings) {
      this.nearBuildings.y += scrollAmount * 1.2;
      
      if (this.nearBuildings.children[0]) {
        const leftBuildings = this.nearBuildings.children[0];
        if (leftBuildings.y > this.game.app.screen.height) {
          leftBuildings.y -= this.game.app.screen.height;
        }
      }
      if (this.nearBuildings.children[1]) {
        const rightBuildings = this.nearBuildings.children[1];
        if (rightBuildings.y > this.game.app.screen.height) {
          rightBuildings.y -= this.game.app.screen.height;
        }
      }
    }
    
    if (this.streetLamps) {
      this.streetLamps.y += scrollAmount;
      if (this.streetLamps.y > 200) {
        this.streetLamps.y -= 200;
      }
    }
    
    if (this.distantBuildings) {
      this.distantBuildings.y += scrollAmount * 0.3;
      if (this.distantBuildings.y > 100) {
        this.distantBuildings.y -= 100;
      }
    }
  }
  
  resize() {
    if (this.sky) {
      this.sky.clear();
      this.sky.beginFill(0x1a1a2e);
      this.sky.drawRect(0, 0, this.game.app.screen.width, this.game.app.screen.height * 0.6);
      this.sky.endFill();
      
      this.sky.beginFill(0x16213e);
      this.sky.drawRect(0, this.game.app.screen.height * 0.4, this.game.app.screen.width, this.game.app.screen.height * 0.2);
      this.sky.endFill();
    }
    
    if (this.ground) {
      this.ground.clear();
      this.ground.beginFill(0x2c2c2c);
      this.ground.drawRect(0, this.game.groundY, this.game.app.screen.width, this.game.app.screen.height - this.game.groundY);
      this.ground.endFill();
      
      this.ground.beginFill(0x3d3d3d);
      this.ground.drawRect(0, this.game.groundY, this.game.app.screen.width, 10);
      this.ground.endFill();
    }
  }
}

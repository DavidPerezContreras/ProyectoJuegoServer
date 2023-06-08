class Player {
  username;
  hearts = 3;

  // keyboard
  pressedKeys = {};


  // movement
  x;
  y;
  xVel = 0;
  movingLeft = false;
  movingRight = false;
  acceleration = 250;
  deceleration = 250;

  constructor(username) {
    this.username = username;
    this.x = 300 / 2 - (16 / 2);
    this.y = 150 - 16;
    this.hearts = 3;
  }


  updatePlayerData(delta) {
    console.log("xVel   " + this.xVel)
    console.log("x   " + this.x)
    // Handle key presses
    if (this.pressedKeys["a"] && !this.pressedKeys["d"]) {
      this.movingLeft = true;
      this.movingRight = false;
    } else if (this.pressedKeys["d"] && !this.pressedKeys["a"]) {
      this.movingLeft = false;
      this.movingRight = true;
    } else {
      this.movingLeft = false;
      this.movingRight = false;
    }

    // Apply acceleration and deceleration
    if (this.movingLeft) {
      this.xVel = Math.max(this.xVel - this.acceleration * delta, -100);
    } else if (this.movingRight) {
      this.xVel = Math.min(this.xVel + this.acceleration * delta, 100);
    } else if (this.xVel > 0) {
      this.xVel = Math.max(this.xVel - this.deceleration * delta, 0);
    } else if (this.xVel < 0) {
      this.xVel = Math.min(this.xVel + this.deceleration * delta, 0);
    }

    // Update position based on velocity if delta is valid

    this.x += this.xVel * delta;

    if (this.x < 0) {
      this.x = 0;
      this.xVel = 0;
    } else if (this.x > 284) {
      this.x = 284;
      this.xVel = 0;
    }

  }




}

class Bullet {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

//bullets = bullets.filter(obj => obj.x >= 0);


//La idea es:
//Mirar si hay salas con hueco.

//Sino. Creamos la sala y luego llamamos addPlayer(player)

class Room {
  id;
  socket;
  bullets;

  constructor(id) {
    this.id = id;
    this.player1 = null;
    this.player2 = null;
    this.socket = null;
    this.bullets = []; // Array to store bullets
  }

  addPlayer(player) {
    if (!this.player1) {
      this.player1 = player;
      player.n = 1;
      return true;
    } else if (!this.player2) {
      this.player2 = player;
      player.n = 2;
      return true;
    } else {
      return false; // Room is already full
    }

    // Assign the room object to the player
    //player.socket = this.socket; // Share the same socket among players
  }
}

module.exports = {
  Player,
  Bullet,
  Room
};
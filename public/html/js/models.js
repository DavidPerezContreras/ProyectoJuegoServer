class Player {
  username;
  hearts;
  socket;

  // movement
  x;
  y;
  xVel;
  movingLeft = false;
  movingRight = false;
  acceleration = 1000;
  decceleration = 1000;

  // keyboard
  pressedKeys = {};

  constructor(username) {
    this.username = username;
    this.x = 300 / 2 - (16 / 2);
    this.y = 150 - 16;
    this.hearts = 3;
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
  player1; //player username or player object
  player2; //player username or player object 
  socket;
  bullets;

  constructor() {
    this.player1 = null;
    this.player2 = null;
    this.socket = null;
    this.bullets = []; // Array to store bullets
  }

  addPlayer(player) {
    if (!this.player1) {
      this.player1 = player;
      player.n=1;
      player.room = this;
      return true;
    } else if (!this.player2) {
      this.player2 = player;
      player.n=2;
      player.room = this;
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
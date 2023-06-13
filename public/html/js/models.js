class Player {
  username;
  score=0;
  
  // keyboard
  pressedKeys = {};


  // movement
  x;
  y;
  xVel = 0;
  movingLeft = false;
  movingRight = false;
  acceleration = 500;
  deceleration = 500;

 

  constructor(username) {
    this.username = username;
    this.x = 300 / 2 - (16 / 2);
    this.y = 150 - 16;
    this.hearts = 3;
  }


  updatePlayerData(delta) {
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
  bullets;
  player1;
  player2;

  constructor(id) {
    this.id = id;
    this.player1 = null;
    this.player2 = null;
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

  }


  // Function to spawn a new bullet at the player's position
  spawnBullet(player) {
    var bullet;
  
    // const
    const SKIN_HEIGHT = 16;
    const SKIN_WIDTH = 16;
  
    if (player.username === this.player1.username) {
      bullet = {
        username: player.username, // Use the username property
        x: player.x + SKIN_WIDTH / 2 - 1,
        y: 150 - SKIN_HEIGHT,
        velocity: {
          x: 0,
          y: -150 // Set the velocity to move upwards
        }
      };
    }
  
    if (player.username === this.player2.username) {
      bullet = {
        username: player.username, // Use the username property
        x: player.x + SKIN_WIDTH / 2 - 1,
        y: 0 + SKIN_HEIGHT,
        velocity: {
          x: 0,
          y: 150 // Set the velocity to move upwards
        }
      };
    }
  
    this.bullets.push(bullet);
  }

// Function to update the position of all bullets
updateRoomBullets(delta) {
  let i = 0;
  while (i < this.bullets.length) {
    const bullet = this.bullets[i];
    bullet.x += bullet.velocity.x;
    bullet.y += bullet.velocity.y * delta;

    if (bullet.y > 310 || bullet.y < -10) {
      // Swap the current bullet with the last bullet in the array
      const lastBullet = this.bullets[this.bullets.length - 1];
      this.bullets[i] = lastBullet;

      // Remove the last bullet from the array
      this.bullets.pop();
    } else {
      // Move to the next bullet
      i++;
    }
  }
}




checkBulletHits() {
  this.checkPlayer1BulletHits();
  this.checkPlayer2BulletHits();
}

checkPlayer1BulletHits() {
  const SKIN_HEIGHT = 16;
  const SKIN_WIDTH = 16;
  const BULLET_RADIUS = 4;

  for (let i = 0; i < this.bullets.length; i++) {
    const bullet = this.bullets[i];

    if (
      this.player2 &&
      bullet.username !== this.player2.username && // Exclude own shooter
      bullet.x + (BULLET_RADIUS / 2) >= this.player2.x &&
      bullet.x - (BULLET_RADIUS / 2) <= this.player2.x + SKIN_WIDTH &&
      bullet.y < SKIN_HEIGHT &&
      bullet.y > 0
    ) {
      console.log("shooter: " + bullet.username + " hit: " + this.player2.username);
      this.bullets.splice(i, 1); // Remove the bullet from the array
      i--; // Adjust the loop counter since the array length has changed
      this.player1.score++;
      console.log("player 1 score:  "+ this.player1.score)
    }
  }
}


checkPlayer2BulletHits() {
  const SKIN_HEIGHT = 16;
  const SKIN_WIDTH = 16;
  const BULLET_RADIUS = 4;

  for (let i = 0; i < this.bullets.length; i++) {
    const bullet = this.bullets[i];

    if (
      this.player1 &&
      bullet.username !== this.player1.username && // Exclude own shooter
      bullet.y + BULLET_RADIUS >= this.player1.y &&
      bullet.y - BULLET_RADIUS <= this.player1.y + SKIN_HEIGHT &&
      bullet.x + (BULLET_RADIUS/2) >= this.player1.x &&
      bullet.x - (BULLET_RADIUS/2) <= this.player1.x + SKIN_WIDTH
    ) {
      console.log("shooter: " + bullet.username + " hit: " + this.player1.username);
      this.bullets.splice(i, 1); // Remove the bullet from the array
      i--; // Adjust the loop counter since the array length has changed
      this.player2.score++;
      console.log("player 2 score:  "+ this.player2.score)
    }
  }
}

}







module.exports = {
  Player,
  Bullet,
  Room
};
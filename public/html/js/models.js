class Player {
    player;
    username;
    hearts;

    //movement
    x;
    y;
    xVel;
    movingLeft = false;
    movingRight = false;
    acceleration = 1000;
    decceleration = 1000;

    //keyboard
    pressedKeys = {};

    constructor(player, username) {
        this.player = player;
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
        this, y = y
    }
}

//bullets = bullets.filter(obj => obj.x >= 0);


//La idea es:
//Mirar si hay salas con hueco.

//Sino. Creamos la sala y luego llamamos addPlayer(player)
class Room {
    player1;
    player2;
    socket;
    bullets;

    constructor() {
        this.player1 = null;
        this.player2 = null;
        this.socket = null;
        bullets = [];
    }

    addPlayer(player) {
        if (!this.player1) {
            this.player1 = player;
            return true;
        } else if (!this.player2) {
            this.player2 = player;
            return true;
        } else {
            return false;
        }

        player.room = this; // Assign the room object to the player
        player.socket = this.socket; // Share the same socket among players
    }
}

module.exports = {
    Player,
    Bullet,
    Room
}
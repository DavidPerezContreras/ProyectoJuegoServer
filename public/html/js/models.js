class Player{
    player;
    username;
    hearts;

    //movement
    x;
    y;
    xVel;
    movingLeft=false;
    movingRight=false;
    acceleration=1000;
    decceleration=1000;

    //keyboard
    pressedKeys={};

    constructor(player, username){
        this.player=player;
        this.username=username;
        this.x=300/2-(16/2);
        this.y=150-16;
        this.hearts=3;
    }
}

class Bullet{
    x;
    y;

    constructor(x,y){
        this.x=x;
        this,y=y
    }
}

class Room{
    player1;
    player2;

    bullets=[];

    constructor(player1, player2){
        this.player1=player1;
        this.player2=player2;
    }
}


module.exports = {
    Player,
    Bullet,
    Room
}
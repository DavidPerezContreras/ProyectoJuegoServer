class Player{
    player;
    username;
    x;
    y;
    hearts;

    constructor(player, username, x, y){
        this.player=player;
        this.username=username;
        this.x=x;
        this.y=y;
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

    constructor(player1, player2){
        this.player1=player1;
        this.player2=player2;
    }
}

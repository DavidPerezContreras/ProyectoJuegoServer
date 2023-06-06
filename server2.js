const { express, session, sessionStore, sharedSession, sessionMiddleware, app, httpServer, socket, path, cors } = require("./js/config");

const { mysql, MySQLStore } = require("./js/mysql");
const { Player, Bullet, Room } = require("./public/html/js/models");



httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const SKIN_WIDTH = 16;
const SKIN_HEIGHT = 16;
const BULLET_RADIUS = 4;

var pressedKeys = {};


//The client before connecting to a room needs to know his username based
//on his sessionId. Then, it connects to a socket room which unique identifier can be:
// 1- A socket for that specific player
// 2- Instead of returning the player username we could have a /room endpoint
// That looks for a room with only 1 player and returns the roomID(thats the socket room identifier)
//Or it creates a new room and returns the identifier in such a way that when another player
//Calls /room it will receive the roomID of the room that was created before with only 1 player
//

//Once there are 2 players in the room , we could say: roomsocket(start the game!)
//Or tell each of the player sockets to start separately.

//This way we can show "Waiting fow players...." and nothing else until the game has started
//Other way is to show the first player and letting him move around, When a new player joins it will show up too.
function initializeKeyboard() {
  socket.on("connection", (socket) => {
    const sess = socket.request.session;
    console.log(sess);

    socket.on("onkeypress", (data) => {
      if (!pressedKeys[data.key]) {
        console.log("onkeypress " + data.key);
        pressedKeys[data.key] = true;
      }
    });

    socket.on("onkeyup", (data) => {
      console.log("onkeyup " + data.key);
      pressedKeys[data.key] = false;
    });
  });
}

initializeKeyboard();














//var rooms=[];

//TODO: Si encuentra alguna partida que haya hueco, mete el jugador en esa partida



//var player1=new Player(1,"david",3 );
//rooms[0].player1=player1;





  









// Initialize position variables
let x = 0;

// Initialize velocity variables
let xVel = 0;
const acceleration = 1000; // adjust as needed
const deceleration = 1000; // adjust as needed

let movingLeft = false;
let movingRight = false;






const hrtimeMs = function () {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 20;
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE
//let tick; //tick count unused?
let tickrate;

let delta;




//bullet
/////////////////////////////////////////////////////////////////////

let bullets = []; // Array to store all bullets
let bulletId = 0; // Unique ID for each bullet

// Function to spawn a new bullet at the player's position
function spawnBullet() {
  const bullet = {
    id: bulletId++,
    x: x+SKIN_WIDTH/2-1,
    y:150-SKIN_HEIGHT,
    velocity: {
      x: 0,
      y: -66// Set the velocity to move upwards
    }
  };
  bullets.push(bullet);
};

// Function to update the position of all bullets
function updateRoomBullets() {
  bullets.forEach((bullet) => {
    bullet.x += bullet.velocity.x;
    bullet.y += bullet.velocity.y*delta ;
  });
};

// Emit the current position of all bullets to all clients
async function emitBullets() {
  socket.emit('bulletsUpdated', bullets);
};

async function emitX() {
    socket.emit("message", { x: x });
}


function updatePlayerData(){
        // Handle key presses
        if (pressedKeys["a"] && !pressedKeys["d"]) {
            movingLeft = true;
            movingRight = false;
        } else if (pressedKeys["d"] && !pressedKeys["a"]) {
            movingLeft = false;
            movingRight = true;
        } else {
            movingLeft = false;
            movingRight = false;
        }
    
        // Apply acceleration and deceleration
        if (movingLeft) {
            xVel = Math.max(xVel - acceleration * delta, -100);
        } else if (movingRight) {
            xVel = Math.min(xVel + acceleration * delta, 100);
        } else if (xVel > 0) {
            xVel = Math.max(xVel - deceleration * delta, 0);
        } else if (xVel < 0) {
            xVel = Math.min(xVel + deceleration * delta, 0);
        }
    
    
        // Update position based on velocity
    
        x += xVel * delta;
    
        if (x < 0) {
            x = 0;
            xVel = 0;
        } else {
            if (x > 284) {
                x = 284;
                xVel = 0;
            }
        }


        if(pressedKeys[" "]){
            spawnBullet();
            pressedKeys[" "]=false;
        }
}


//For each active Room, 
    //Calculate player 1 and player 2 state
    //Calculate Room bullets positions

    //Emit Room objects every tick










const loop = () => {
    setTimeout(loop, tickLengthMs)
    let now = hrtimeMs()
    delta = (now - previous) / 1000

    tickrate = 1 / delta;
    //console.log("tickrate= " + tickrate);
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////



    //Estos metodos se pasan a métodos del objeto no? 
    updatePlayerData();

    updateRoomBullets();


    emitBullets();
    emitX();

    
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    previous = now;
    //tick++;
}


loop() // starts the loop


//Initialize Configuration
const { express, session, app, httpServer, socket, path } = require("./js/config");
const routes = require("./js/routes");

app.use(express.static(path.join(__dirname, "public")));
app.use("/", routes);

httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
  });



  const {initializeKeyboard, pressedKeys} = require("./js/keyboard");


initializeKeyboard();




const {Player, Bullet, Room} = require("./public/html/js/models");
var rooms=[];

//TODO: Si encuentra alguna partida que haya hueco, mete el jugador en esa partida







var player1=new Player(1,"david",3 );

  









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
const spawnBullet = () => {
  const bullet = {
    id: bulletId++,
    x: x,
    y:150,
    velocity: {
      x: 0,
      y: -66// Set the velocity to move upwards
    }
  };
  bullets.push(bullet);
};

// Function to update the position of all bullets
const updateBullets = () => {
  bullets.forEach((bullet) => {
    bullet.x += bullet.velocity.x;
    bullet.y += bullet.velocity.y*delta ;
  });
};

// Emit the current position of all bullets to all clients
const emitBullets = async () => {
  socket.emit('bulletsUpdated', bullets);
};











const loop = () => {
    setTimeout(loop, tickLengthMs)
    let now = hrtimeMs()
    delta = (now - previous) / 1000

    tickrate = 1 / delta;
    console.log("tickrate= " + tickrate);
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////


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


    console.log("emit X = " + x);

    var emit = async ()=> {
        socket.emit("message", { x: x });
    }
    emit.call();





    if(pressedKeys[" "]){
        spawnBullet();
        pressedKeys[" "]=false;
    }



    updateBullets();
    emitBullets();


    
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    previous = now;
    //tick++;
}


loop() // starts the loop

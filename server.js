
/*Imports + initialize*/
const express = require("express");
var cors = require('cors')

const { createServer } = require("http");
const { Server } = require("socket.io");


const app = express();
app.use(cors()) // Use this after the variable declaration

//Initialize server variables
const httpServer = createServer(app);
const socket = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
    }
});



//Initialize path to serve files
const path = require('path');

app.use(express.static(path.join(__dirname, 'client')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+"client", 'index.html'));
});






var pressedKeys = {};


socket.on("connection", (socket) => {
    console.log("player connected");

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


httpServer.listen(3000);









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

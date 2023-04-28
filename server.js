
/*Imports + initialize*/
const express = require("express");
var cors = require('cors')

const { createServer } = require("http");
const { Server } = require("socket.io");


const app = express();
app.use(cors()) // Use this after the variable declaration


const httpServer = createServer(app);
const socket = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
    }
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
const acceleration = 200; // adjust as needed
const deceleration = 400; // adjust as needed

let movingLeft = false;
let movingRight = false;






const hrtimeMs = function () {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 30;
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE
let tick; //tick count unused?
let tickrate;


const loop = () => {
    setTimeout(loop, tickLengthMs)
    let now = hrtimeMs()
    let delta = (now - previous) / 1000

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

    console.log("emit X = " + x);
    socket.emit("message", { x: x });
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    previous = now
    tick++;
}


loop() // starts the loop

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
var x=0;
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


















const hrtimeMs = function () {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 30;
let tick = 0
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE

let tickrate;


const loop = () => {
    setTimeout(loop, tickLengthMs)
    let now = hrtimeMs()
    let delta = (now - previous) / 1000

    tickrate = 1 / delta;
    console.log("tickrate= "+tickrate);

    //console.log('delta ', delta, "           tickrate ",tickrate)
    ///////////////////////////////////////////////////////////////////////////////////////////////////////7

    // game.update(delta, tick) // game logic would go here
    if (pressedKeys["a"]) {
        console.log(pressedKeys)
        x -= 1/tickrate*10;
        console.log("emit X = "+x);
    
    }

    if (pressedKeys["d"]) {
        console.log(pressedKeys)
        x += 1/tickrate*10;
        console.log("emit X = "+x);
        
    }


    socket.emit("message", { x: x });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////7
    previous = now
    tick++
}

loop() // starts the loop
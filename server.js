
/*Imports + initialize*/
const express = require("express");
var cors = require('cors')

const { createServer } = require("http");
const { Server } = require("socket.io");


const app = express();
app.use(cors()) // Use this after the variable declaration


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: "http://127.0.0.1",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", (socket) => {
    console.log("player connected");
});






httpServer.listen(3000);








var pressedKeys = {};
/*
io.on("onkeypress", (data) => {

        if (!pressedKeys[data.key]) {
        console.log("onkeypress");
        pressedKeys[data.key] = true;
    }
});


io.on("onkeyup", (data) => {


    console.log("onkeypress");
    pressedKeys[data.key] = false;

});
*/

io.on("onkeypress", () => {
    console.log("onkeypress");
});


io.on("onkeyup", () => {
console.log("onkeypress");
});










const hrtimeMs = function() {
    let time = process.hrtime()
    return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 2000;
let tick = 0
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE

let fps;


const loop = () => {
    setTimeout(loop, tickLengthMs)
    let now = hrtimeMs()
    let delta = (now - previous) / 1000

    fps = 1 / delta;


    //console.log('delta ', delta, "           fps ",fps)
///////////////////////////////////////////////////////////////////////////////////////////////////////7

    // game.update(delta, tick) // game logic would go here


///////////////////////////////////////////////////////////////////////////////////////////////////////7
    previous = now
    tick++
}

loop() // starts the loop
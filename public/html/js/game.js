"use strict";

var myUsername;
(async function () {
    myUsername = await fetchUsername();
    // Use the retrieved username here
})();

console.log("my username is: " + myUsername);


//var socket = io('http://208.85.18.169:3000');
var socket = io('http://127.0.0.1:3000');


socket.on('connect', () => {
    console.log('connected to server');
    socket.emit('connection', {});


    socket.on("roomJoined", (data) => {
        //console.log(("Room "+data.room+" joined"));
        console.log(("Room " + data.room + " joined"));
    });

    socket.emit("joinRoom", { username: myUsername });


});


let canvas;
let context;
let contextText;


let secondsPassed;
let oldTimeStamp;
let fps;


let bulletContext;

//X E Y SERÁN ACTUALIZADOS mediante eventos enviados desde el servidor
//cuando deba cambiar de posición.
//Ship x y
let x = 0;
let y = 0;

let ship = new Image();
ship.src = "/html/assets/img/nave.png";
//let scaled = scaleIt(ship,0.25);





//De esta forma el cliente y el servidor conocen en cada momento que teclas están pulsadas y cuales no
var pressedKeys = {};

//Sends key events to server
window.onkeypress = function (e) {
    //Si la tecla no ha sido levantada, no mandamos eventos todo el rato
    //al servidor, ya se sabe que está pulsada.
    if (!pressedKeys[e.key]) {
        console.log(e.key + " - press");
        pressedKeys[e.key] = true;
        socket.emit('onkeypress', { key: e.key });
    }
}

window.onkeyup = function (e) {
    console.log(e.key + " - up");
    pressedKeys[e.key] = false;
    socket.emit('onkeyup', { key: e.key });
}








var serverX = 0;
socket.on("message", (data) => {
    serverX = data.x;
    //console.log("Received event with data:", data);
});


var bulletsArray = [];
socket.on('bulletsUpdated', (bullets) => {
    //    console.log('Received updated bullet positions:', bullets);
    bulletsArray = bullets;
});



window.onload = init;

function init() {




    // Get a reference to the canvas
    canvas = document.getElementById('canvas');

    //Init images context
    context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true; //So images are not blurry

    console.log("canvas width = " + canvas.width);
    console.log("canvas height = " + canvas.height);

    //Init text context
    contextText = canvas.getContext('2d');
    contextText.font = "normal small-caps bold 16px monospace";
    contextText.fillStyle = 'white';


    //Init bullets context
    bulletContext = canvas.getContext('2d');
    bulletContext.lineWidth = 2;




    y = canvas.height - 16;
    //Para el jugador 2 y será cero


    //siempre al final
    window.requestAnimationFrame(gameLoop);
}


function gameLoop(timeStamp) {


    drawCube();
    drawBullets();

    window.requestAnimationFrame(gameLoop);

}


function drawCube() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(ship, serverX, y, 16, 16);

}

function drawBullets() {
    if (bulletsArray.length > 0) {
        bulletsArray.forEach((value) => {
            bulletContext.strokeRect(value.x, value.y, 2, 2);
        });
    }


}

function drawText() {
    //contextText.fillText(fps + " fps", 0, 10);} how to draw text
}
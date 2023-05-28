"use strict";


//var socket = io('http://208.85.18.169:3000');
var socket = io('http://127.0.0.1:3000');


socket.on('connect', () => {
    console.log('connected to server');
    socket.emit('connection', {});
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
ship.src = "/html/img/nave.png";
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


//IMPORTANTE: DEBEMOS ASUMIR QUE ELCENTRO DE LA PANTALLA ES LA COORDENADA CERO.
//POR Lo tanto, si el servidor dice que estamos en la coordenada cero nos ponemos en el centro,
//Y así de forma relativa
function init() {




    // Get a reference to the canvas
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    context.imageSmoothingEnabled = true; //So images are not blurry
    contextText = canvas.getContext('2d');
    contextText.font = "normal small-caps bold 16px monospace";
    contextText.fillStyle = 'white';
    //contextText.textRendering = "geometricPrecision";

    bulletContext = canvas.getContext('2d');

    // Set the line width to 2 pixels
    bulletContext.lineWidth = 2;




    //SHIP X TO MIDDLE SCREEN
    x = canvas.width / 2;
    y = canvas.height - 16; //Y dependerá de si somos jugador 1 o 2 en esta ROOM

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);







}


function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = 1 / secondsPassed;
    //console.log(fps);


  //  console.log(serverX);
  //  console.log(x);
    drawCube();
    drawBullets();

    // Keep requesting new frames
    window.requestAnimationFrame(gameLoop);

}

//Draw screen using state

function drawCube() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    //if (pressedKeys[arrowLeft])

    context.drawImage(ship, serverX, y, 16, 16);
    contextText.fillText(fps + " fps", 0, 10);
}


function drawBullets() {
    if (bulletsArray.length > 0) {
        bulletsArray.forEach((value)=>{

                bulletContext.strokeRect(value.x, value.y, 2, 2);

        });
    }


}


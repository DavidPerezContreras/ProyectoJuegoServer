"use strict";

//SCREEN CONTROLS
const buttonA = document.getElementById('buttonA');
const buttonD = document.getElementById('buttonD');
fetchUsername()
    .then((myUsername) => {

        if(myUsername==="No user authenticated"){
            window.location.href="/";

        }

        var room;

        var sio = io('http://127.0.0.1:3000');
        console.log("my username is: " + myUsername);


        //var io = io('http://208.85.18.169:3000');





        sio.on('connect', (socket) => {
            console.log('connected to server');

            sio.on("disconnect", () => {
                // Handle disconnection for this specific socket connection
                console.log("Disconnected from the server");
            });

            sio.on("roomState", (data) => {
                //console.log("roomState received");
                room = data;
            });

            sio.on("roomJoined", (data) => {

                room = data;
                console.log(data);

                let canvas;
                let player1Context;
                let player2Context;
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
                ship.src = "/html/assets/img/player1.png";

                let ship2 = new Image();
                ship2.src = "/html/assets/img/player2.png";
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
                        sio.emit('onkeypress', { roomId: room.id, username: myUsername, key: e.key });
                    }
                }

                window.onkeyup = function (e) {
                    console.log(e.key + " - up");
                    pressedKeys[e.key] = false;
                    sio.emit('onkeyup', { roomId: room.id, username: myUsername, key: e.key });
                }



                function aDown(){
                    if (!pressedKeys["a"]) {
                        console.log("a" + " - press");
                        pressedKeys["a"] = true;
                        sio.emit('onkeypress', { roomId: room.id, username: myUsername, key: "a" });
                    }
                }
                
                function aUp(){
                    console.log("a" + " - up");
                    pressedKeys["a"] = false;
                    sio.emit('onkeyup', { roomId: room.id, username: myUsername, key: "a" });
                }

              buttonA.onmousedown=aDown;
              buttonA.onmouseup=aUp;
              buttonA.ontouchstart=aDown;
              buttonA.ontouchend=aUp;




                var serverX = 0;
                sio.on("message", (data) => {
                    serverX = data.x;
                    //console.log("Received event with data:", data);
                });


                var bulletsArray = [];
                sio.on('bulletsUpdated', (bullets) => {
                    //    console.log('Received updated bullet positions:', bullets);
                    bulletsArray = bullets;
                });





                function init() {
                    if (room.player1.username === myUsername) {
                        console.log("YOU ARE PLAYER 1")
                    } else {
                        console.log("YOU ARE PLAYER 2")
                    }



                    // Get a reference to the canvas
                    canvas = document.getElementById('canvas');

                    //Init images context
                    player1Context = canvas.getContext('2d');
                    player1Context.imageSmoothingEnabled = true; //So images are not blurry

                    //Init images context
                    player2Context = canvas.getContext('2d');
                    player2Context.imageSmoothingEnabled = true; //So images are not blurry

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
                    //drawText();

                    drawPlayer1();
                    drawPlayer2();
                    drawBullets();



                    window.requestAnimationFrame(gameLoop);

                }


                var prevX1=0;
                function drawPlayer1() {
                    // Clear the previous player position
                    player1Context.clearRect(prevX1, y, 16, 16);
                
                    // Draw the updated player position
                    player1Context.drawImage(ship, room.player1.x, y, 16, 16);
                
                    prevX1 = room.player1.x;
                }
                


                var prevX2=0;
                function drawPlayer2() {
                    // Clear the previous player position
                    player2Context.clearRect(prevX2, 0, 16, 16);
                
                    if (room.player2) {
                        // Draw the updated player position
                        player2Context.drawImage(ship2, room.player2.x, 0, 16, 16);
                        prevX2 = room.player2.x;
                    }
                }

                function drawBullets() {
                    if (bulletsArray.length > 0) {
                        bulletsArray.forEach((value) => {
                            bulletContext.strokeRect(value.x, value.y, 2, 2);
                        });
                    }


                }

                function drawText() {
                    if (room.player1.username === myUsername) {
                        contextText.fillText("player 1 - " + room.player1.username, 0, 10);
                    } else {
                        contextText.fillText("player 2 - " + room.player2.username, 0, 10);
                    }

                }


                init();

            });



            sio.emit("joinRoom", { username: myUsername });
        });




    });



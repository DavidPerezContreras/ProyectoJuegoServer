const { express, session, sessionStore, sharedSession, sessionMiddleware, dbConfig, app, httpServer, io, path, cors } = require("./js/config");

const { mysql, MySQLStore } = require("./js/mysql");
const { Player, Bullet, Room } = require("./public/html/js/models");



httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});











const SKIN_WIDTH = 16;
const SKIN_HEIGHT = 16;
const BULLET_RADIUS = 4;

var pressedKeys = {};



var rooms = [];

io.on('connection', (socket) => {
  socket.on("joinRoom", (data) => {


    var player = new Player(data.username);
    console.log(player.username + " requested to join a Room.");
    
    if (rooms.length === 0) {
      var room = new Room(rooms.length);
      room.player1 = player;
      rooms[room.id] = room;
      socket.emit("roomJoined", rooms[room.id]);
      console.log(player.username + " joining room " + room.id);
      socket.join(room.id);
      console.log(`Client joined channel: ${room.id}`);
      io.to(room.id).emit('roomState', rooms[room.id]);
    } else {
      var roomFound = false;
    
      for (var i = 0; i < rooms.length; i++) {
        if (!rooms[i].player1) {
          var room;
          if (rooms[i] === null || rooms[i] === undefined) {
            console.log("+room created");
            room = new Room(rooms.length);
            rooms[i] = room; // Assign the newly created room to the array
          } else {
            room = rooms[i];
          }
    
          room.player1 = player; // Assign the player to player1 slot
          socket.emit("roomJoined", room);
          console.log(player.username + " joining room " + room.id);
          socket.join(room.id);
          console.log(`Client joined channel: ${room.id}`);
          io.to(room.id).emit('roomState', room);
    
          roomFound = true;
          break;
        } else if (!rooms[i].player2) {
          room = rooms[i];
          room.player2 = player; // Assign the player to player2 slot
          socket.emit("roomJoined", room);
          console.log(player.username + " joining room " + room.id);
          socket.join(room.id);
          console.log(`Client joined channel: ${room.id}`);
          io.to(room.id).emit('roomState', room);
    
          roomFound = true;
          break;
        }
      }
    
      if (!roomFound) {
        var room = new Room(rooms.length);
        room.player1 = player;
        rooms.push(room);
        socket.emit("roomJoined", room);
        console.log(player.username + " joining room " + room.id);
        socket.join(room.id);
        console.log(`Client joined channel: ${room.id}`);
        io.to(room.id).emit('roomState', room);
      }
    }



    console.log(rooms);




  });


  socket.on("onkeypress", (data) => {
    if (!pressedKeys[data.key]) {
      console.log("onkeypress    " + data.key + "    by  " + data.username + " to Room " + data.roomId);

      var room = rooms[data.roomId];
      var player;

      if (room.player1.username === data.username) {
        player = room.player1;
      } else if (room.player2.username === data.username) {
        player = room.player2;

      }


      player.pressedKeys[data.key] = true;
      console.log(player.pressedKeys);
    }
  });

  socket.on("onkeyup", (data) => {
    if (!pressedKeys[data.key]) {
      console.log("onkeyup    " + data.key + "    by  " + data.username + " to Room " + data.roomId);

      var room = rooms[data.roomId];
      var player;

      if (room.player1.username === data.username) {
        player = room.player1;

      } else if (room.player2.username === data.username) {
        player = room.player2;

      }



      player.pressedKeys[data.key] = false;
      console.log(player.pressedKeys);

    }
  });

});



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
    x: x + SKIN_WIDTH / 2 - 1,
    y: 150 - SKIN_HEIGHT,
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
    bullet.y += bullet.velocity.y * delta;
  });
};

// Emit the current position of all bullets to all clients
async function emitBullets() {
  //io.emit('bulletsUpdated', bullets);
};

async function emitX() {
  //io.emit("message", { x: x });
}


function updatePlayerData() {
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


  if (pressedKeys[" "]) {
    spawnBullet();
    pressedKeys[" "] = false;
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

  

  rooms.forEach((room,index,array)=>{
    console.log("updating room "+room.id);
    console.log(room.player1.x)
    room.player1.updatePlayerData(delta)
    console.log(room.player1.x)
  });

  //Estos metodos se pasan a métodos del objeto no? 
  //updatePlayerData();

  //updateRoomBullets();


  //emitBullets();
  //emitX();


  ///////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////













  rooms.forEach((value, index, array) => {
    io.to(index).emit('roomState', value);
  })







  /////////////////////////////////////////////////////////////////////////////





  previous = now;
  //tick++;
}


loop() // starts the loop

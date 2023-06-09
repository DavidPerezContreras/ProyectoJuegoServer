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

    function createNewRoom(player) {
      var room = new Room(rooms.length);
      room.player1 = player;
      rooms.push(room);
      socket.emit("roomJoined", room);
      console.log(player.username + " joining room " + room.id);
      socket.join(room.id);
      console.log(`Client joined channel: ${room.id}`);
      io.to(room.id).emit('roomState', room);
    }

    function joinExistingRoom(player, room) {
      socket.emit("roomJoined", room);
      console.log(player.username + " joining room " + room.id);
      socket.join(room.id);
      console.log(`Client joined channel: ${room.id}`);
      io.to(room.id).emit('roomState', room);
    }

    function freeSlot(player) {
      // Iterate through rooms to find and free the player's slot
      for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];

        if (room.player1 && room.player1.username === player.username) {
          room.player1 = null; // Free player1 slot
          console.log(player.username + "'s slot in room " + room.id + " is now free.");
        }

        if (room.player2 && room.player2.username === player.username) {
          room.player2 = null; // Free player2 slot
          console.log(player.username + "'s slot in room " + room.id + " is now free.");
        }
      }
    }

    // Check if there are any rooms
    if (rooms.length === 0) {
      createNewRoom(player); // Create a new room for the player
    } else {
      var roomFound = false;

      // Iterate through existing rooms
      for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];

        // Check if any player in the room has the same username
        if (room.player1 && room.player1.username === player.username) {
          continue; // Skip this room, as player1 has the same username
        }

        if (room.player2 && room.player2.username === player.username) {
          continue; // Skip this room, as player2 has the same username
        }

        // If there is an available slot, join the room
        if (!room.player1) {
          room.player1 = player;
        } else if (!room.player2) {
          room.player2 = player;
        }

        // If a slot was assigned, join the room
        if (room.player1 || room.player2) {
          joinExistingRoom(player, room);
          roomFound = true;
          break;
        }
      }

      // If no room was found, create a new room
      if (!roomFound) {
        createNewRoom(player);
      }
    }

    console.log(rooms);

    // When the socket disconnects, free up the player's slot
    socket.on("disconnect", () => {
      freeSlot(player);
      console.log(player.username + " has disconnected.");
      console.log(rooms);
    });
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


  });

});



const hrtimeMs = function () {
  let time = process.hrtime()
  return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 128;
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



//For each active Room, 
//Calculate player 1 and player 2 state
//Calculate Room bullets positions

//Emit Room objects every tick










const loop = () => {
  setTimeout(loop, tickLengthMs);
  let now = hrtimeMs();
  delta = (now - previous) / 1000;

  tickrate = 1 / delta;
  //console.log("tickrate= " + tickrate);
  ///////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////



  for (let i = 0; i < rooms.length; i++) {
    let room = rooms[i];
    if (room.player1) {
      room.player1.updatePlayerData(delta)
    }

    if (room.player2) {
      room.player2.updatePlayerData(delta)
    }
  }

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
}


loop() // starts the loop

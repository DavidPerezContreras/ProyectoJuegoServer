
const { socket } = require("./config");

var pressedKeys = {};

function initializeKeyboard(){
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
}



module.exports = {
    initializeKeyboard,
    pressedKeys
}
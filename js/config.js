const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const httpServer = createServer(app);
const socket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }
});

const path = require("path");

module.exports = {
  express,
  session,
  app,
  httpServer,
  socket,
  path
};
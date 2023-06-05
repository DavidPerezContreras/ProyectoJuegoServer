const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const MySQLStore = require("express-mysql-session")(session);


const dbConfig = {
    /* MySQL connection options */
    host: "localhost",
    user: "root",
    //password: "your-mysql-password",
    database: "proyectojuego",
    table: "sessions", // Optional. Default is "sessions".
  };

const sessionStore = new MySQLStore(dbConfig);
const app = express();


const httpServer = createServer(app);
const socket = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  }
});

const path = require("path");



app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);


module.exports = {
  express,
  dbConfig,
  session,
  sessionStore,
  app,
  httpServer,
  socket,
  path,
  cors
};
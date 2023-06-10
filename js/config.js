const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const MySQLStore = require("express-mysql-session")(session);
const path = require("path");
const router = express.Router();

const { bcrypt } = require("./encryption");
const { mysql } = require("./mysql");




const dbConfig = {
  /* MySQL connection options */
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "proyectojuego",
  table: "sessions", // Optional. Default is "sessions".
};

const sessionStore = new MySQLStore(dbConfig);
const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
  },
});





const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 365
        }
});


//app.use(skipAuth); // Add this middleware before session middleware
app.use("/",sessionMiddleware);



app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));




// Error handling middleware
//app.use((err, req, res, next) => {
  // Log the error for internal debugging
//  console.error('Error:', err);

  // Send a generic error response to the client
//  res.status(500).json({ error: 'Internal server error' });
//});


//app.use((req, res, next) => {
//  res.setHeader('Access-Control-Allow-Origin', 'http://208.85.18.169');
//  res.setHeader('Access-Control-Allow-Credentials', 'true');
//  next();
//});




router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", 'index.html'));
});

router.get('/game', (req, res) => {
  if (!req.session) {
     res.sendFile(path.join(__dirname, "../public/html", 'index.html'));
  }else{
    res.sendFile(path.join(__dirname, "../public/html", 'game.html'));
  }
  
  
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Connect to MySQL
  const connection = mysql.createConnection(dbConfig);
  connection.connect();

  // Find the user in the database
  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error fetching user from database:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (results.length === 0) {
      // User not found
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      // Verify the password
      const user = results[0];
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          console.error('Error comparing passwords:', error);
          res.status(500).json({ error: 'Internal server error' });
        } else if (result) {
          // Password matches, store the username in session data
          req.session.data = {
            username: username,
          };

          // Manually save the session
          req.session.save((error) => {
            if (error) {
              console.error('Error saving session:', error);
              res.status(500).json({ error: 'Internal server error' });
            } else {
              // Update the username column in the sessions table
const updateQuery = 'UPDATE sessions SET username = ?, expires = ? WHERE session_id = ?';
connection.query(updateQuery, [username, req.session.cookie.expires / 1000, req.sessionID], (error, updateResult) => {
                if (error) {
                  console.error('Error updating session:', error);
                }

                // Close the database connection
                connection.end();

                res.json({ message: 'Login successful' });
              });
            }
          });
        } else {
          // Invalid password
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    }
  });
});

// Register endpoint
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const connection = mysql.createConnection(dbConfig);
  connection.connect();

  const query = 'SELECT COUNT(*) AS count FROM users WHERE username = ? OR email = ?';
  connection.query(query, [username, email], (error, results) => {
    if (error) {
      console.error('Error checking user existence:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const { count } = results[0];

      if (count > 0) {
        res.status(400).json({ error: 'Username or email already exists' });
      } else {
        // Hash the password
        bcrypt.hash(password, 10, (error, hashedPassword) => {
          if (error) {
            console.error('Error hashing password:', error);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            // Create a new user in the database
            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            connection.query(insertQuery, [username, email, hashedPassword], (error) => {
              if (error) {
                console.error('Error creating user in database:', error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.json({ message: 'User registered successfully' });
              }

              // Close the database connection
              connection.end();
            });
          }
        });
      }
    }
  });
});


// Logout endpoint
app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((error) => {
    if (error) {
      console.error('Error destroying session:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});




app.post('/profile', (req, res) => {
console.log('Session ID:', req.sessionID);
console.log("data.username", req.session);
  if (req.session && req.session.data && req.session.data.username !== null && req.session.data.username !== undefined) {
    const username = req.session.data.username;
    console.log(`Username: ${username}`);
    res.send( username );
  } else {
    console.log('No user authenticated');
    res.send('No user authenticated');
  }
});




app.use("/",router);

module.exports = {
  express,
  session,
  sessionStore,
  sessionMiddleware,
  dbConfig,
  app,
  httpServer,
  io,
  path,
  cors
};

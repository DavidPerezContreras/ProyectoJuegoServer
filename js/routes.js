
const {  express,dbConfig,session,sessionStore,app,httpServer,socket,path,cors} = require("./config");
const router = express.Router();
const {bcrypt} = require("./encryption");
const {mysql} = require("./mysql");


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", 'index.html'));
});

router.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", 'game.html'));
});

// Login endpoint
router.post('/login', (req, res) => {
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
          // Password matches, reset the session object
          req.session.username = user.username;
          res.json({ message: 'Login successful', username: user.username });
        } else {
          // Invalid password
          res.status(401).json({ error: 'Invalid credentials' });
        }
      });
    }

    // Close the database connection
    connection.end();
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


app.post('/profile', (req, res) => {
  const username = req.session.username;

  if (username) {
    console.log(`Username: ${username}`);
    res.send(`Logged in as: ${username}`);
  } else {
    console.log('No user authenticated');
    res.send('No user authenticated');
  }
});




module.exports = router;
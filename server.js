const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the current directory
app.use(express.static('.')); 

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'esports',
  password: 'SteenEbonyPorn',
  port: 5432,
});

// Existing functionality to generate a snapshot
const generateSnapshot = async () => {
  console.log('Attempting to generate snapshot...');
  try {
    const result = await pool.query('SELECT * FROM players');
    let htmlContent = '<html><head><title>Snapshot</title></head><body><h1>Player Scores</h1><ul>';
    result.rows.forEach(player => {
      htmlContent += `<li>${player.name}: ${player.score}</li>`;
    });
    htmlContent += '</ul></body></html>';

    fs.writeFile('snapshot.html', htmlContent, (err) => {
      if (err) {
        console.error('Error writing snapshot:', err);
      } else {
        console.log('Snapshot generated successfully');
      }
    });
  } catch (err) {
    console.error('Error generating snapshot:', err);
  }
};

// Handle POST requests from the contact form
app.post('/submit-form', (req, res) => {
  const { name, email, message } = req.body;
  const insertQuery = 'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)';
  pool.query(insertQuery, [name, email, message], (err, results) => {
    if (err) {
      console.error('Error saving to database:', err);
      res.status(500).send('Error saving to database');
    } else {
      res.send('Message saved successfully!');
    }
  });
});

// Generate snapshot immediately and then every 2 minutes
generateSnapshot();
setInterval(generateSnapshot, 120000); // Every 2 minutes (120000 milliseconds)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


app.get('/get-contacts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts');
        res.json(result.rows); // Send the result back to the client as JSON
    } catch (err) {
        console.error('Failed to retrieve data:', err);
        res.status(500).send('Server error');
    }
});


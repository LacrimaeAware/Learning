const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.static('.')); // Serve static files from the current directory

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'esports',
  password: 'SteenEbonyPorn',
  port: 5432,
});

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

// Generate snapshot immediately and then every 2 minutes
generateSnapshot();
setInterval(generateSnapshot, 120000); // Every 2 minutes (120000 milliseconds)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

function connectWithRetry() {
  const db = mysql.createConnection({
    host: "db",          // service name from docker-compose
    user: "user",        // same as MYSQL_USER
    password: "pass123", // same as MYSQL_PASSWORD
    database: "mydatabase",
    port: 3306
  });

  db.connect(err => {
    if (err) {
      console.error("❌ DB connection failed, retrying in 5s...", err.message);
      setTimeout(connectWithRetry, 5000); // retry after 5s
    } else {
      console.log("✅ Connected to MySQL Database");

      // Routes
      app.get("/users", (req, res) => {
        db.query("SELECT * FROM users", (err, results) => {
          if (err) return res.status(500).send(err);
          res.json(results);
        });
      });
    }
  });
}

connectWithRetry();

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));

const mysql = require("mysql");
const express = require("express");
const path = require("path");
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test_sql-injection",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/Login.html"));
});

app.post("/login", function (req, res) {
  let { usr, pwd } = req.body;
  usr = usr.replace(/(?=[() ])/g, "\\");
  pwd = pwd.replace(/(?=[() ])/g, "\\");

  if (usr && pwd) {
    connection.query(
      "select User from account where Password = ?",
      [pwd],
      function (err, result) {
        if (err) res.json(err);
        else {
          if (result.length != 0) {
            res.json(result);
          } else res.send("Wrong pass or user is not existed");
        }
      }
    );
  } else {
    res.send("User or password is not existed");
    res.end();
  }
});

app.listen(3000);

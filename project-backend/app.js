const express = require("express");
const mysql = require("mysql2");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
// let cors = require("cors");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "madhava108",
  database: "projectDB",
});
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(bodyParser.json());
// app.use(cors());
db.connect((err) => {
  if (err) {
    console.log("error is here");
    throw err;
  }
  console.log("mysql connected .....");
});

//get all entries
app.get("/entries/?page=", (req, res) => {
  let sql = "SELECT * FROM entry";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//get full population details for homes location
app.get("/survey", (req, res) => {
  let sql = "SELECT * FROM survey";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

//get person detail by ID
app.get("/survey/:id", (req, res) => {
  let xyz = req.params.id;
  let sql = `SELECT * FROM survey WHERE PersonID= ${xyz}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});
//get everyone who came in contact with the subject
app.get("/trace/:id", (req, res) => {
  let xyz = req.params.id;
  let sql = `SELECT * FROM entry WHERE PersonID = ${xyz}`;
  let sql2 = `SELECT * FROM entry WHERE PersonID <> ${xyz}`;
  var listy = [];

  db.query(sql, (err, result) => {
    if (err) throw err;
    db.query(sql2, (err, result2) => {
      if (err) throw err;

      for (var map of result) {
        for (var crap of result2) {
          var sublisty = [];
          if (
            map["hr"] == crap["hr"] &&
            map["Entrydate"].toString() == crap["Entrydate"].toString()
          ) {
            const lat1 = map["latitude"];
            const long1 = map["longitude"];
            const lat2 = crap["latitude"];
            const long2 = crap["longitude"];

            let l = getDistanceFromLatLonInKm(lat1, long1, lat2, long2);
            l = l * 1000;
            console.log(l);
            if (l < 700) {
              sublisty.push(map);
              sublisty.push(crap);
              listy.push(sublisty);
            }
          }
        }
      }
      res.send(listy);
    });
  });
});

//get person travel histroy by ID
app.get("/entry/:id", (req, res) => {
  let xyz = req.params.id;
  let sql = `SELECT * FROM entry WHERE PersonID= ${xyz}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

app.listen("3000", () => {
  console.log("server started at 3000");
});

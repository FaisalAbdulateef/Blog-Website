/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Faisal A Mohammed Abdulateef Student ID: 163686215 Date: February 5, 2023
*
* Cyclic Web App URL: https://puce-dizzy-katydid.cyclic.app/
*
* GitHub Repository URL: https://github.com/FaisalAbdulateef/web322-app
*                        or https://github.com/FaisalAbdulateef/web322-app.git
*
********************************************************************************/ 

var express = require("express");
var blogService = require(__dirname + "/blog-service.js");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static("public"));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

app.get("/blog", function (req, res) {
  blogService
    .getPublishedPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/posts", function (req, res) {
  blogService
    .getAllPosts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/categories", function (req, res) {
  blogService
    .getCategories()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.use(function (req, res) {
  res.status(404).end("404 Page Not Found");
});

blogService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart());
  })
  .catch(() => {
    console.log("Error: files were not read correctly.");
  });

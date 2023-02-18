/*********************************************************************************
 * WEB322 – Assignment 03
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Faisal A Mohammed Abdulateef Student ID: 163686215 Date: February 17, 2023
 *
 * Cyclic Web App URL: https://puce-dizzy-katydid.cyclic.app/
 *
 * GitHub Repository URL: https://github.com/FaisalAbdulateef/web322-app
 *                        or https://github.com/FaisalAbdulateef/web322-app.git
 *
 ********************************************************************************/

var express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
var blogService = require(__dirname + "/blog-service.js");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: "dlqz8omkk",
  api_key: "678562672681918",
  api_secret: "pM0jfoCLZ5Bk-chrYtrbKdYj4vQ",
  secure: true,
});

const upload = multer();

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
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (minDate) {
    blogService
      .getPostsByMinDate(minDate)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else {
    blogService
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
});

app.get("/post/:value", function (req, res) {
  const id = req.params.value;

  blogService
    .getPostById(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/posts/add", function (req, res) {
  res.sendFile(path.join(__dirname, "views/addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), function (req, res) {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }
    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }
  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    const postData = req.body;

    blogService
      .addPost(postData)
      .then((newPost) => {
        res.redirect("/posts");
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error adding post");
      });
  }
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

/*********************************************************************************
* WEB322 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Faisal A Mohammed Abdulateef Student ID: 163686215 Date: March 19, 2023
*
* Cyclic Web App URL: https://puce-dizzy-katydid.cyclic.app/
* 
* GitHub Repository URL: https://github.com/FaisalAbdulateef/web322-app
 *                       or https://github.com/FaisalAbdulateef/web322-app.git
*
********************************************************************************/

var express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
var blogService = require(__dirname + "/blog-service.js");
var app = express();
var path = require("path");
const exphbs = require("express-handlebars");
const stripJs = require('strip-js');
var HTTP_PORT = process.env.PORT || 8080;

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
 });

cloudinary.config({
  cloud_name: "dlqz8omkk",
  api_key: "678562672681918",
  api_secret: "pM0jfoCLZ5Bk-chrYtrbKdYj4vQ",
  secure: true,
});

const upload = multer();

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' + url + '">' + options.fn(this) + "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
      safeHTML: function(context){
        return stripJs(context);
       },
    },
  })
);

app.set("view engine", ".hbs");

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on " + HTTP_PORT);
}

app.use(express.static("public"));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  res.redirect("blog");
});

app.get("/about", function (req, res) {
  res.render(path.join(__dirname, "views/about.hbs"));
});

app.get('/blog', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blogService.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blogService.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // get the latest post from the front of the list (element 0)
      let post = posts[0]; 

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;
      viewData.post = post;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blogService.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})

});

app.get('/blog/:id', async (req, res) => {

  // Declare an object to store properties for the view
  let viewData = {};

  try{

      // declare empty array to hold "post" objects
      let posts = [];

      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await blogService.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await blogService.getPublishedPosts();
      }

      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));

      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;

  }catch(err){
      viewData.message = "no results";
  }

  try{
      // Obtain the post by "id"
      viewData.post = await blogService.getPostById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }

  try{
      // Obtain the full list of "categories"
      let categories = await blogService.getCategories();

      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})
});

app.get("/posts", function (req, res) {
  const category = req.query.category;
  const minDate = req.query.minDate;

  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((data) => {
        res.render("posts", {posts: data});
      })
      .catch((err) => {
        res.render("posts", {message: "no results"});
      });
  } else if (minDate) {
    blogService
      .getPostsByMinDate(minDate)
      .then((data) => {
        res.render("posts", {posts: data});
      })
      .catch((err) => {
        res.render("posts", {message: "no results"});
      });
  } else {
    blogService
      .getAllPosts()
      .then((data) => {
        res.render("posts", {posts: data});
      })
      .catch((err) => {
        res.render("posts", {message: "no results"});
      });
  }
});

app.get("/post/:value", function (req, res) {
  const id = req.params.value;

  blogService
    .getPostById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.get("/posts/add", function (req, res) {
  res.render(path.join(__dirname, "views/addPost.hbs"));
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
      res.render("categories", {categories: data});
    })
    .catch((err) => {
      res.render("categories", {message: "no results"});
    });
});

app.use(function (req, res) {
  res.status(404).render("404");
});

blogService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart());
  })
  .catch(() => {
    console.log("Error: files were not read correctly.");
  });

var fileSys = require("fs");
var path = require("path");
var posts = [];
var categories = [];

module.exports.initialize = () => {
  return new Promise(function (resolve, reject) {
    fileSys.readFile(
      path.join(__dirname, "data/posts.json"),
      function (err, data) {
        if (err) {
          reject("unable to read file");
        } else {
          posts = JSON.parse(data);
        }
      }
    );

    fileSys.readFile(
      path.join(__dirname, "data/categories.json"),
      (err, data) => {
        if (err) {
          reject("unable to read file");
        } else {
          categories = JSON.parse(data);
        }
      }
    );
    resolve();
  });
};

module.exports.getAllPosts = () => {
  return new Promise(function (resolve, reject) {
    if (posts.length == 0) {
      reject("no results returned");
    } else {
      resolve(posts);
    }
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise(function (resolve, reject) {
    var Posts = posts.filter((POST) => POST.published === true);
    if (Posts.length == 0) {
      reject("no results returned");
    } else {
      resolve(Posts);
    }
  });
};

module.exports.getCategories = () => {
  return new Promise(function (resolve, reject) {
    if (categories.length == 0) {
      reject("no results returned");
    } else {
      resolve(categories);
    }
  });
};

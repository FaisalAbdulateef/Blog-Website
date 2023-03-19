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
    var Posts = posts.filter((POST) => POST.published == true);
    if (Posts.length == 0) {
      reject("no results returned");
    } else {
      resolve(Posts);
    }
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise(function (resolve, reject) {
    var Posts = posts.filter((POST) => POST.published == true && POST.category == category);
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

module.exports.addPost = (postData) => {
  return new Promise(function (resolve) {
    if (postData.published == undefined) {
      postData.published = false;
    } else {
      postData.published = true;
    }

    postData.postDate = new Date().toISOString().slice(0, 10);
    postData.id = posts.length + 1;
    posts.push(postData);
    resolve(postData);
  });
};

module.exports.getPostsByCategory = (category) => {
  return new Promise(function (resolve, reject) {
    const Posts = posts.filter((POST) => POST.category == category);

    if (Posts.length == 0) {
      reject("no results returned");
    } else {
      resolve(Posts);
    }
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise(function (resolve, reject) {
    const Posts = posts.filter(
      (POST) => new Date(POST.postDate) >= new Date(minDateStr)
    );

    if (Posts.length == 0) {
      reject("no results returned");
    } else {
      console.log("The postDate value is greater than minDateStr");
      resolve(Posts);
    }
  });
};

module.exports.getPostById = (id) => {
  return new Promise(function (resolve, reject) {
    const Posts = posts.filter((POST) => POST.id == id);

    if (Posts.length == 0) {
      reject("no result returned");
    } else {
      resolve(Posts[0]);
    }
  });
};

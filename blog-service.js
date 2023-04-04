const Sequelize = require("sequelize");

var sequelize = new Sequelize(
  "brfxnkxl",
  "brfxnkxl",
  "lLRwCuScdG3DFf0Se_hZ6T07fqSHYvn-",
  {
    host: "isilo.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define(
  "Post",
  {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
  },
  {
    createdAt: true, // disable createdAt
    updatedAt: true, // disable updatedAt
  }
);

var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        resolve("synced the database");
      })
      .catch(() => {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPosts = () => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category: category, published: true } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getCategories = () => {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.addCategory = (categoryArg) => {
  return new Promise((resolve, reject) => {
    if (categoryArg.category === "") {
      categoryArg.category = null;
    }

    Category.create(categoryArg)
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("unable to create category");
      });
  });
};

module.exports.deleteCategoryById = (id) => {
  return new Promise((resolve, reject) => {
    Category.destroy({ where: { id: id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.deletePostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.destroy({ where: { id: id } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addPost = (postData) => {
  return new Promise((resolve, reject) => {
    postData.published = postData.published ? true : false;

    for (let data in postData) {
      if (postData[data] === "") {
        postData[data] = null;
      }
    }
    postData.postDate = new Date();

    Post.create(postData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to create post");
      });
  });
};

module.exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category: category } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const { gte } = Sequelize.Op;

    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { id: id } })
      .then((data) => {
        resolve(data[0]);
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

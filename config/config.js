var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'hello-nodeblog'
    },
    port: process.env.PORT || 5000,
    db: 'mongodb://localhost/nodeBlog'
  },

  test: {
    root: rootPath,
    app: {
      name: 'hello-nodeblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/hello-nodeblog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'hello-nodeblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/hello-nodeblog-production'
  }
};

module.exports = config[env];

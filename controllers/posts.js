const Post = require('../models/post');
const User = require('../models/user');
const express = require('express');
const app = express();

module.exports = app => {

  // INDEX (also our root route)
  app.get('/', (req, res) => {
    var currentUser = req.user;
    Post.find({})
      .then(posts => {
        res.render('posts-index', { posts, currentUser });
      }).catch(err => {
        console.log(err.message);
      });
  });

  // NEW
  app.get('/posts/new', (req, res) => {
    res.render('posts-new', {});
  });

  // CREATE
  app.post('/posts/new', (req, res) => {
    if (req.user) {
      var post = new Post(req.body);
      post.save(function(err, post) {
        return res.redirect('/');
      });
    } else {
      return res.status(401); // unauthorized
    }
  });

  // SHOW
  app.get('/posts/:id', function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).populate('comments').then((post) => {
      res.render('posts-show', { post })
    }).catch(err => {
        console.log(err.message);
      });
  });

  // Subreddit
  app.get('/n/:subreddit', function(req, res) {
    Post.find({ subreddit: req.params.subreddit })
      .then(posts => {
        res.render('posts-index', { posts });
      }).catch(err => {
        console.log(err);
      });
  });

  // Sign up post
  app.post('/sign-up', (req, res) => {
    const user = new User(req.body);
    user
      .save()
      .then(user => {
        res.redirect('/');
      }).catch(err => {
        console.log(err.message);
      });
  });

};

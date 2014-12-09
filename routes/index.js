var express = require('express');
var router = express.Router();
var Post = require('../models/post');

function handleResponse(res, successStatus, errorStatus) {
  return function (err, result) {
    var json, status;

    if (err) {
      status = errorStatus || 400;
      json = { message: err.message, status: errorStatus || 400 };
    } else {
      status = successStatus || 200;
      json = result.length ? 
        result.map(function (post) { return post.toJSON(); }) : 
        result.toJSON();
    }

    res
      .status(status)
      .json(json);
  };
}

router.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    posts = [];
    res.render('index', { posts: posts });
  });
});

router.get('/posts', function (req, res) {
  Post.find({}, handleResponse(res));
});

router.post('/posts', function (req, res) {
  var post = new Post(req.body);
  post.set({ author: 'Gustavo Souza' });
  post.save(handleResponse(res, 201));
});

router.put('posts/:id', function (req, res) {
  Post.findByIdAndUpdate(req.params.id, req.body, handleResponse(res));
});

router.delete('posts/:id', function (req, res) {
  Post.findByIdAndRemove(req.params.id, handleResponse(res));
});


module.exports = router;

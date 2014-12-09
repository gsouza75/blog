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
      json = result.toJSON();
    }

    res
      .status(status)
      .json(json);
  };
}

router.get('/', function (req, res) {
  Post.find({}, function (err, posts) {
    if (req.accepts('html')) {
      res.render('index', { posts: posts });
    } else if (req.accepts('json')) {
      res.json(posts);
    }
  });
});

router.post('/', function (req, res) {
  var post = new Post(req.body);
  post.set({ author: 'Gustavo Souza' });
  post.save(handleResponse(res, 201));
});

router.put('/:id', function (req, res) {
  Post.findByIdAndUpdate(req.params.id, req.body, handleResponse(res));
});

router.delete('/:id', function (req, res) {
  Post.findByIdAndRemove(req.params.id, handleResponse(res));
});


module.exports = router;

var express = require('express');
var router = express.Router();
var Post = require('../models/post');

function handleResponse(res, successStatus, errorStatus) {
  return function (err, result) {
    var json, status;

    function processResult() {
      if (!result) return null;
      
      return result.length ? { 
        posts: result.map(function (post) { return post.toJSON(); }),
        count: result.length
      } : result.toJSON();
    } 

    if (err) {
      status = errorStatus || 400;
      json = { message: err.message, status: errorStatus || 400 };
    } else {
      status = successStatus || 200;
      json = processResult();
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
    var query = req.query;
    var limit = query && query.limit ? query.limit : 0;
    var skip = query && query.skip ? query.skip : 0;
    var dbQuery = { skip: skip, limit: limit, sort: { date: -1 } };

    Post.find({}, null, dbQuery, handleResponse(res));
});

router.post('/posts', function (req, res) {
  // return res.status(400).json({ message: 'Invalid something....' });
  var post = new Post(req.body);
  post.save(handleResponse(res, 201));
});

router.put('/posts/:id', function (req, res) {
  delete req.body._id;
  Post.findByIdAndUpdate(req.params.id, req.body, handleResponse(res));
});

router.delete('/posts/:id', function (req, res) {
  Post.findByIdAndRemove(req.params.id, handleResponse(res));
});


module.exports = router;

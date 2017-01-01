var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var postModel = mongoose.model('Post');

router.use(function(req, res, next) {
  if (req.method === "GET") {
    return next();
  }

  if (!req.isAuthenticated()) {
    res.redirect('/#login');
  }

  return next();
});

router.route('/posts')

  .get(function(req, res) {
    postModel.find(function(err, data){
      if (err) {
        return res.send(500, err);
      }

      return res.send(data);
    });

  })

  .post(function(req, res) {
    var post = new postModel();
    post.text = req.body.text;
    post.created_by = req.body.created_by;
    post.save(function(err, post){
      if (err) {
        console.log('error in saving post');
        return res.send(500, err);
      }

      return res.json(post);
    });
  });


router.route('/posts/:id')

  .get(function(req, res) {
    res.send({message: 'TODO return post with ID: ' + req.params.id});
  })

  .put(function(req, res) {
    res.send({message: 'TODO modify post with ID: ' + req.params.id});
  })

  .delete(function(req, res) {
    res.send({message: 'TODO delete post with ID: ' + req.params.id});
  });

module.exports = router;

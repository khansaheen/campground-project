var express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

//===============
//COMMENT ROUTES
//===============

//show comment form
router.get('/new', middleware.isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if(err){
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

//handle comment logic - create comment
router.post('/', middleware.isLoggedIn, (req, res) => {
  //lookup campground using id
  Campground.findById(req.params.id, (err, campground) => {
    if(err){
      console.log(err);
      redirect('./campgrounds');
    } else {
      //create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if(err){
          req.flash('error', 'Something went wrong');
          console.log(err);
        } else {
          //add id and username to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          //save comment
          comment.save();
          //connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          req.flash('success', 'Comment successfully added');
          //redirect to campground show page
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });
});

//Edit route for comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if(err){
      res.redirect('back');
    } else {
      res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//Update route for comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//Delete route for comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if(err){
      res.redirect('back');
    } else {
      req.flash('success', 'Comment deleted successfully');
      res.redirect('/campgrounds/' + req.params.id)
    }
  });
});

module.exports = router;
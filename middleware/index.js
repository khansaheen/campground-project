var Campground = require('../models/campground');
var Comment = require('../models/comment');

//all middleware goes here

var middlewareObj = {};

//Middleware to check user authentication and authorization for campground
middlewareObj.checkCampgroundOwnership = (req, res, next) => {
  //check if user is logged in
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err){
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else {
        //does user own the campground?
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You need permission to perform this action');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You must be logged in to perform that action');
    res.redirect('back');
  }
} 

//Middleware to check user authentication and authorization for comment
middlewareObj.checkCommentOwnership = (req, res, next) => {
  //check if user is logged in
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err){
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else {
        //does user own the comment?
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You need permission to perform this action');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You must be logged in to perform that action');
    res.redirect('back');
  }
}

//Middleware
middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You must be logged in to perform that action');
  res.redirect('/login');
}

module.exports = middlewareObj;

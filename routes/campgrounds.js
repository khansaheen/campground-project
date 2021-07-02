var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground'),
    middleware = require('../middleware');

//=================
//CAMPGROUND ROUTES
//=================

//INDEX ROUTE - show all campgrounds
router.get('/', (req, res) => {
  //Get all campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
    if(err){
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

//CREATE ROUTE- add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: desc, author: author};
  //Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if(err){
      console.log(err);
    } else {
      //Redirect back to campgrounds page
      res.redirect('/campgrounds');
    }
  });
});

//NEW ROUTE - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) =>{
  res.render('campgrounds/new');
});

//SHOW ROUTE - shows more info about one campground
router.get('/:id', (req, res) => {
  //find campground with provided id
  Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
    if(err){
      console.log(err);
    } else {
      //render show template with that campground
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

//EDIT ROUTE - show form to edit campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if(err){
        res.redirect('/campgrounds')
      } else {
        res.render('campgrounds/edit', {campground: foundCampground});
      }
    });
});

//UPDATE ROUTE - submit edit form here
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  //find and update the campground  
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if(err){
      res.redirect('/campgrounds');
    } else {
      //redirect somewhere(show page)
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//DELETE ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err, deletedCampground) => {
    if(err){
      res.redirect('/campgrounds');
    } else {
      req.flash('success', 'Campground deleted successfully');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
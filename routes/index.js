var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

//show landing page
router.get('/', (req, res) => {
  res.render('landing');
});

//===========
//Auth Routes
//===========

//show sign up form
router.get('/register', (req, res) => {
  res.render('register');
});

//handle user sign up
router.post('/register', (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      req.flash('error', err.message);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', 'Welcome to WeCamp ' + user.username);
      res.redirect('/campgrounds');
    });
  });
});

//show login form
router.get('/login', (req, res) => {
  res.render('login');
});

//handle user login
//app.post('login', middleware, callback)
/*router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req, res) => {
});*/
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/login");
    }
    if (!user) {
      req.flash("error", "Login failed");
      return res.redirect("/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/login");
      }
      //console.log(user.username + " just logged in to the website.");
      req.flash("success", "Login successful");
      return res.redirect("/campgrounds");
    });
  })(req, res, next);
});

//Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logout successful');
  res.redirect('/campgrounds');
});

module.exports = router;

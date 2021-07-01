var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require("./seeds"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    methodOverride = require('method-override');
    dotenv = require("dotenv");

require('dotenv').config({ path: '.env' });
//requiring routes
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//LOCAL- DEV
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";


//HEROKU- PROD
const db_url = process.env.DB_URL;
mongoose.connect(db_url);
//process.env.DATABASEURL = "mongodb://saheen:saheen12@ds153566.mlab.com:53566/yelpcamp"

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "I love web development",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
//It will append all routes in the campground routes file with /campgrounds
app.use('/campgrounds', campgroundRoutes); 
//It will append all routes in the comment routes file with /campgrounds/:id/comments
app.use('/campgrounds/:id/comments', commentRoutes);

const port = process.env.PORT || 8524;

app.listen(port, () => {
  console.log('YelpCamp app has started');
});
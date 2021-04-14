var oExpress = require("express");
var oApp = oExpress();
var oBodyParser = require("body-parser");
var oMongoose = require("mongoose");
var oSeedDB = require("./seeds")
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var commentRoutes = require("./routes/comment"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// http://photosforclass.com/search/camping

oSeedDB();
oMongoose.connect("mongodb://localhost/yelp_camp_v10");
oMongoose.Promise = global.Promise;

oApp.use(oBodyParser.urlencoded({extended: true}));
oApp.set("view engine", "ejs");
oApp.use(oExpress.static(__dirname + "/public"));
oApp.use(methodOverride("_method"));
oApp.use(flash());

// schema Setups
var campgroundModel = require("./models/campground");
var commentModel = require("./models/comment");
var user = require("./models/user");

// passport configuration
oApp.use(require("express-session")({
    secret: "Once again Rusty winds cutest dog!",
    resave: false,
    saveUninitialized: false
}));
oApp.use(passport.initialize());
oApp.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

oApp.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

oApp.use(indexRoutes);
oApp.use("/campgrounds", campgroundRoutes);
oApp.use("/campgrounds/:id/comments", commentRoutes);

// Listen
// var ip = process.env.IP;
// var port = process.env.PORT;

var ip = "127.0.0.1";
var port = "3000";

oApp.listen(port, ip, function(){
    console.log("YelpCamp server has started (http://" + ip + ":" + port + ")!!!");
});
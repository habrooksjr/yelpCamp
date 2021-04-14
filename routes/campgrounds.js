var express = require("express");
var router = express.Router();
var campgroundModel = require("../models/campground");
var middleware = require("../middleware");

// campground routes
// ---------------------------------------------------------------------
// index routes
router.get("/", function(req, res){
    campgroundModel.find({}, function(err, records){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index", {campgrounds: records});
        }
    });
});

// create routes
router.post("/", middleware.isLoggedIn, function(req, res){
   var sName = req.body.name;
   var sPrice = req.body.price;
   var sImage = req.body.image;
   var sDesc = req.body.description;
   var oAuthor = { id: req.user._id, username: req.user.username };
   var oNewCampground = {name: sName, price: sPrice, image: sImage, description: sDesc, author: oAuthor };
   
    campgroundModel.create(oNewCampground, function(err, record){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

// new routes
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
});

// show routes
router.get("/:id", function(req, res){
    var id = req.params.id;
    
    campgroundModel.findById(id).populate("comments").exec(function(err, record){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/show", {campground: record}); 
        }
    });
});

// edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    campgroundModel.findById(req.params.id, function(err, foundCampground){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// update route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campgroundModel.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
           res.redirect("/campgrounds/" + req.params.id);
        } 
    });
});

// destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campgroundModel.findByIdAndRemove(req.params.id, function(err){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds");
        } 
    });
});

module.exports = router;
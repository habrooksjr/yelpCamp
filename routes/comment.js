var express = require("express");
var router = express.Router({mergeParams: true});
var campgroundModel = require("../models/campground");
var commentModel = require("../models/comment");
var middleware = require("../middleware");

// comments routes
// ---------------------------------------------------------------------

// new routes
router.get("/new", middleware.isLoggedIn, function(req, res){
    campgroundModel.findById(req.params.id, function(err, campground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground: campground});
        }
    });
});

// create route
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    campgroundModel.findById(req.params.id, function(err, campground){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            // create new comment
            commentModel.create(req.body.comment, function(err, comment){
                if(err)
                {
                    res.redirect("/campgrounds");
                } 
                else
                {
                    // add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    // associate new comment
                    campground.comments.push(comment);
                    
                    // save the campground
                    campground.save();
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    commentModel.findById(req.params.comment_id, function(err, foundComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    commentModel.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    commentModel.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
        else
        {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        } 
    });
});

module.exports = router;
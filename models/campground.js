var oMongoose = require("mongoose");

var campgroundSchema = new oMongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author:
    {
        id: { type: oMongoose.Schema.Types.ObjectId, ref: "User"},
        username: String
    },
    comments: 
    [{
        type: oMongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = oMongoose.model("Campground", campgroundSchema);
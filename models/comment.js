var oMongoose = require("mongoose");

var commentSchema = new oMongoose.Schema({
    text: String,
    author:
    {
        id: { type: oMongoose.Schema.Types.ObjectId, ref: "User"},
        username: String
    }
});

module.exports = oMongoose.model("Comment", commentSchema);
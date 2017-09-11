/**
 * Created by kiRkaka on 08-09-2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feed = new Schema({
    id : { type: Number },
    url : { type: String },
    story_url : { type: String },
    story_title : { type: String },
    title : { type: String },
    author : { type: String },
    created_at : { type: Date },
    deleted_at : { type: Date }
});

module.exports = mongoose.model('feed', Feed);
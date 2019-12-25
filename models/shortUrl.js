//Structure of document for shortUrl

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlScheme = new Schema({
    originalUrl: String, 
    shorterUrl: String
});

const urlModel = mongoose.model('url', urlScheme);

module.exports = urlModel;
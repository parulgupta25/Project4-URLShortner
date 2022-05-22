const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode: { type: String, required: true, unique: true, trim: true }, 
    longUrl: { type: String, required: true, lowercase: true, trim: true },
    shortUrl: { type: String, required: true, unique: true, trim: true }
}, { timestamps: true });

// create a model from schema and export it
module.exports = mongoose.model('Url', urlSchema);
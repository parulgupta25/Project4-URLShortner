const express = require('express');
const bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://parul_gupta05:8tIPaevO6ZCErmDA@cluster0.jlp5k.mongodb.net/Parul-db?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

app.listen(process.env.PORT || 3000,
function(){
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
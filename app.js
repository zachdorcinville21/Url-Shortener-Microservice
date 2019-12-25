//get requirements and set their instances
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const shortUrl = require('./models/shortUrl.js');

app.use(bodyParser.json());
app.use(cors());
//enable node to find static content
app.use(express.static(__dirname + '/public'));

//connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urls', { useNewUrlParser: true, useUnifiedTopology: true });

//create database entry
app.get('/new/:urlToShorten(*)', (req, res) => {
    var urlToShorten = req.params.urlToShorten;

    var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi; 

    if (regex.test(urlToShorten) === true) {
        var short = Math.floor(Math.random() * 100000).toString();

        var newUrl = new shortUrl({
            originalUrl: urlToShorten, 
            shorterUrl: short
        });

        newUrl.save((err) => {
            if (err) {
                return res.send('Error saving to the database');
            }
        });

        return res.json(newUrl);
    }
    
    return res.json({urlToShorten: 'Invalid URL'});
});

//query database and redirect to original URL
app.get("/:urlToForward", (req, res, next) => {
    var sUrl = req.params.urlToForward;

    shortUrl.findOne({'shorterUrl': sUrl}, (err, data) => {
        if (err) return res.send('Error reading database');

        var re = new RegExp("^(http|https)://", "i");
        var strToCheck = data.originalUrl;
        if (re.test(strToCheck)) {
            res.redirect(301, data.originalUrl);
        } else {
            res.redirect(301, 'http://' + data.originalUrl);
        }
    });
});


//listen to check if everything is up and running
//process.env.PORT if on Heroku
app.listen(process.env.PORT || 3000, () => {
    console.log('Node.js listening...');
});

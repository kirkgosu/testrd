var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var mongoose = require('mongoose');
var async = require('async');
var feed = require('./models/feed');

var index = require('./routes/index');
var http = require('http');
var https = require('https');

var app = express();
mongoose.connect('mongodb://feeds:feed123@ds129374.mlab.com:29374/testrd');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

//schedule.scheduleJob('0 0 */1 * * *', function(){
schedule.scheduleJob('*/10 * * * * *', function(){
    console.log('URL API: '+process.env.API_URL);

    var url = process.env.API_URL;
    var url = "https://hn.algolia.com/api/v1/search_by_date?query=nodejs";
    https.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            var apiResponse = JSON.parse(body);
            insertaBD(apiResponse);
        });
    }).on('error', function(e){
        console.log("error: ", e);
    });

    function insertaBD(body){
      if(typeof body != 'object'){
        return false;
      }

        async.each(body.hits, function (item, callback) {

            console.log('procesando feed id: '+item.objectID);

            feed.findOne({ 'id': item.objectID }, function (err, fd) {
                if (err) return false;

                if(fd==null){

                    var reg = new feed();
                    reg.id = item.objectID;
                    reg.url = item.url;
                    reg.story_url = item.story_url;
                    reg.story_title = item.story_title;
                    reg.title = item.title;
                    reg.author = item.author;
                    reg.created_at = item.created_at;

                    reg.save();
                    console.log('insertado correctamente');
                    callback();
                }else{
                    console.log("id "+ item.objectID + " ya existe en la BD" );
                    callback();
                }

            });


        }, function (error) {
            if (error) console.log('Error al leer');
        });


    }


});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

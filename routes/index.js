var express = require('express');
var feed = require('../models/feed');
var router = express.Router();
var moment = require('moment');
/* GET home page. */
router.get('/', function(req, res, next) {


    feed.find({'deleted_at': null}).sort({created_at: -1}).exec(function(err, fd) {
        if (err) return false;

        if(fd==null){

            console.log("no existen registros" );
            res.render('index', { title: 'HN Feed', found:false  });

        }else{
            console.log(fd);
            res.render('index', { title: 'HN Feed', found:true, data:fd, moment: moment });
        }});

});
router.get('/eliminaRegistro/:id', function(req, res, next) {

    feed.findOneAndUpdate({id: req.params.id}, {$set:{deleted_at:Date.now() }}, {new: true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        console.log("eliminado con exito");
        res.redirect('/');

    });
});

module.exports = router;



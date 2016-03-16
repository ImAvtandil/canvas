//npm i express
//npm install body-parser
//sudo npm install node-uuid

var express = require('express');




var path = require('path'); // модуль для парсинга пути
var fs = require('fs');
var app = express();

var bodyParser = require('body-parser');

var uuid = require('node-uuid');

app.use(bodyParser());

app.get('/api', function (req, res) {
    res.send('API is running');
});



app.get('/api/articles', function (req, res) {
    res.send('This is not implemented now');
});

app.get('/api/articles/:id', function(req, res) {
    console.log(req.params.id);
    var data = fs.readFileSync('./documents/'+req.params.id);
    console.log("Synchronous read: " + data.toString());
    res.send({id:req.params.id,data:JSON.parse(data.toString())});
});

app.post('/api/articles', function (req, res) {
    var docName = uuid.v4();
    console.log('/documents/' + docName);
    fs.open('./documents/' + docName, 'w+', function (err, fd) {
        fs.writeFile('./documents/' + docName, JSON.stringify(req.body), function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("Data written successfully!");
        });
    });

    res.send({status:1,document_id:docName});
});


app.use(function (req, res, next) {
    res.status(404);
    res.send({error: 'Not found'});
    console.log('Not found');
    return;
});

app.get('/ErrorExample', function (req, res, next) {
    next(new Error('Random error!'));
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({error: err.message});
    return;
});

app.listen(1337, function () {
    console.log('Express server listening on port 1337');
});

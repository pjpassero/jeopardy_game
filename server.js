var express = require('express');
var app = express();
let port = 3000;
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});

//this is the incorrect server file *****

app.listen(port, function(){
    console.log(`Server is running on ${port}`);
});




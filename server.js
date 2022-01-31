/*

Server File for Jeopardy App
Run this file as you would a node file
Written by PJ Passero
Version 1.0.0

*/

var express = require('express');
var app = express();
const fs = require('fs');
var path = require('path');
var engines = require('consolidate');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var qrcode = require('qrcode');
const { error } = require('console');
let port = 3000;
var server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"], transports: ['websocket', 'polling'], credentials: true }, allowEIO3: true });
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(fileUpload({
    createParentPath: true
}));
/* App Vars */
var externalClickersUsed = false;
var gameCodes = {};
var gameCodesJoined = {};
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));


//Socket events below:

io.on("connection", function (socket) {
    var socky = socket.id;

    io.to(socky).emit('socky', { 'socketid': socky });
    socket.on('clickers', function (data) {
        externalClickersUsed = data.needed;
        console.log(data);
        var x = 1;
        while (x <= data.teamCount) {
            gameCodes[`team${x}`] = generateCode(6);
            console.log(gameCodes);
            x += 1;
        }
        socket.emit('thecodes', gameCodes);
    });
    socket.on('gen_host_code', function (data) {
        var hostCode = generateCode(6);
        var fileData = JSON.stringify(hostCode);
        fs.writeFile(__dirname + `/gameKeys/${hostCode}.json`, fileData, (err) => {
            if (err) throw err;
            console.log('Game Code Written');
        });
        //The qrcode package generates a qrcode by converting the link with the host code to a base64 url for the image
        //The qrcode url is then sent to the client to scan via a camera. 
        //On the host client, the hostCode parameter value is placed into the code box on the client side
        qrcode.toDataURL(`http://192.168.1.8:3000/host?hostCode=${hostCode}`, function(err,url){
            io.sockets.emit('generated_host', { 'code': hostCode, 'qrCode': url});
        });
    });
    socket.on('join_host', function (data) {
        console.log(data);
        var path = __dirname + `/gameKeys/${data.code}.json`;
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                console.error(err);
                io.sockets.emit('error', { 'host': false });

                return;
            }

            io.sockets.emit('host_connected', { 'host': true });
        });

    });
    socket.on('theQuestion', function (data) {
        var theValue = determineValue(data.questionValue);

        console.log(data);
        var question = data.question;
        var answer = data.answer;
        io.sockets.emit('emit_to_host', { 'question': question, 'answer': answer, 'questionValue':theValue});
    });
    socket.on('send_answer_to_client', function (data) {
        io.sockets.emit('sendAnswer', { 'answer': data.answer });
    });
    socket.on('emit_continue', function (data) {
        io.sockets.emit('continue', { 'continue': true });
    });
    socket.on('join_clicker', function (data) {
        console.log(data);
        theCode = data.code;
        for (var item in gameCodes) {
            if (gameCodes[item] == theCode) {
                io.sockets.emit('joined', { 'message': 'Code recieved and authenticated ' + theCode + ' ' + item, 'success': true, 'team': item });
                io.sockets.emit('update_clicker_client', { 'joined': true });
                gameCodesJoined[item] = 'joined';
            } else {
                io.sockets.emit('joined', { 'message': 'Code Invalid, check again and reenter code' + theCode, 'success': false });
                io.sockets.emit('update_clicker_client', { 'joined': false });
            }
        }
    });
    socket.on('points',function(data){
        console.log(data);
        if(data.correct == true) {
            io.sockets.emit('update_client', {'points':parseInt(data.pointvalue), 'team':data.team});
        } else {
            io.sockets.emit('update_client', {'points':parseInt(-data.pointvalue), 'team':data.team});

        }
    });
});
/*
Generate an ID for the current game using generateCode. Returns the generated code.
*/
function generateCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/*
Determine the question value based on the number passed through. Returns question value.
*/
function determineValue(questionValue) {
    var returnVal = 0;
    switch (questionValue) {
        case 0:
            returnVal = 200;
            break;
        case 1:
            returnVal = 400;
            break;
        case 2:
            returnVal = 600;
            break;
        case 3:
            returnVal = 800;
            break;
        case 4:
            returnVal = 1000;
            break;
    }

    return returnVal;
}


//Server Routes below:
app.get('/', function (req, res) {
    res.render('index');
});
app.post('/uploadFile', function (req, res) {
    var file = req.files.file;
    file.mv(path.join(__dirname, 'useruploads/' + file.name));
    let rawdata = fs.readFileSync(path.join(__dirname, 'useruploads/' + file.name));
    res.send({ 'theData': JSON.parse(rawdata), 'status': true });

});
app.get('/makegame', function (req, res) {
    res.render('game_board_generator');
});

app.get('/clicker', function (req, res) {
    res.render('clickerClient');
});
app.get('/host', function (req, res) {
    res.render('host');
});


server.listen(port, function () {
    console.log(`The Server is started. Visit: http://localhost:3000 to acccess the main jeopardy board.`);
});




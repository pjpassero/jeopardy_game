var socket;
var currentQuestion = "";
var currentAnswer = "";
var currentValue = 0;
var teamPointNums = [0, 0];

/* 
Below is the method of grabbing the url parameters for the game code
*/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
$('#joinCode').val(urlParams.get('hostCode'));


$.getScript('node_modules/socket.io-client/dist/socket.io.js', function (data, textStatus, jqxhr) {
    var currentUser = sessionStorage.getItem('username');
    var uniqueIDDEVP = sessionStorage.getItem('uniqueID');
    var userID;
    var selected;
    var typing = false;
    var timeout = undefined;
    socket = io('http://192.168.1.8:3000');

    socket.on('host_connected', function (data) {
        $('#connectionStatus').removeClass('not');
        $('#connectionStatus').addClass('conntected');
        $('#connectionStatus').html('Connection Succesful!');
        $('#enterCode').hide();
    });
    socket.on('emit_to_host', function (data) {
        $('#question').html(`<h2 class="text-center"><b>${data.question}</b></h2>`);
        $('#answer').html(`<h4>${data.answer}</h4>`);
        $('#questionValue').html(`<h6 class="text-center">$${data.questionValue}</h6>`);
        currentQuestion = data.question;
        currentAnswer = data.answer;
        currentValue = data.questionValue;
    });
});

function answerHost() {
    socket.emit('send_answer_to_client', {'answer':currentAnswer});
}
function continueHost() {
    socket.emit('emit_continue', {'continue':true});

}
function correct(team) {
    socket.emit('points', {'correct':true,'team':team, 'pointvalue':currentValue});
    switch(team) {
        case 1:
            teamPointNums[0] += parseInt(points);
            $('#team1value').html(`$${teamPointNums[0]}`);
            break;
        case 2:
            teamPointNums[1] += parseInt(points);
            $('#team2value').html(`$${teamPointNums[1]}`);
            break;
    }
}

function wrong(team) {
    socket.emit('points', {'correct':false,'team':team, 'pointvalue':currentValue});
    switch(team) {
        case 1:
            teamPointNums[0] += parseInt(-points);
            $('#team1value').html(`$${teamPointNums[0]}`);
            break;
        case 2:
            teamPointNums[1] += parseInt(-points);
            $('#team2value').html(`$${teamPointNums[1]}`);
            break;
    }
}
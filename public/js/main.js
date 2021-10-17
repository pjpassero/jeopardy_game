var socket;
var team;
var connected = false;
var teamPointNums = [0, 0];
var teamCount = 2;
var teamNames = [];
var currentX = 0;
var currentY = 0;

$.getScript('node_modules/socket.io-client/dist/socket.io.js', function (data, textStatus, jqxhr) {
    var currentUser = sessionStorage.getItem('username');
    var uniqueIDDEVP = sessionStorage.getItem('uniqueID');
    var userID;
    var selected;
    var typing = false;
    var timeout = undefined;
    socket = io('http://192.168.1.8:3000');
    socket.on('thecodes', function (data) {
        $('.teamClickerCont').removeClass('disabled');
        console.log(data);
        var x = 1;
        while (x <= teamCount) {
            var team = `team${x}`;
            $('#teamClickerCodes').append(`<p>Team ${x}: ${data[team]}</p> <p id="connectteam${x}"class="connected not">Not connected</p>`);
            x += 1;
        }
    });

    socket.on('update_clicker_client', function (data) {
        console.log(data);
        if (data.joined == true) {
            if (connected == true) {

            } else {
                connected = true;
                $('#connectionStatus').removeClass('not');
                $('#connectionStatus').addClass('conntected');
                $('#connectionStatus').html('Connection Succesful!');
                //$('#enterCode').hide();
            }

        } else {
            $('#connectionStatus').html('Code Invalid! Please try again!');

        }
    });
   
    socket.on('sendAnswer',function(data) {
        $('#questionAnswer').hide();
        $('#questionAnswer').html(`<h1><b>${data.answer}</b></h1> <br> <a id="continue">Continue</a>`);
        $('#questionAnswer').fadeIn();


    });
    socket.on('continue',function(data){
        if(data.continue == true) {
            $('#questionBox').hide();
            $('#questionAnswer').empty();
        }
    });
    socket.on('generated_host', function(data){
        $('#hostCode').html(data.code);
        $('#qrcodeHost').attr('src', data.qrCode);
        $('#initDash').show();

    });
    socket.on('host_connected',function(data){
        if(data.host == true) {
            $('#hostConnectionStatus').html('Host is now connected!');
            $('#hostConnectionStatus').css('color', 'green');
        } else {

        }
    });
    socket.on('update_client', function(data){
        console.log(data);
        switch(data.team) {
            case 1:
                teamPointNums[0] += data.points;
                $('#team_one_points').html(`$${teamPointNums[0]}`);
                break;
            case 2:
                teamPointNums[1] += data.points;
                $('#team_two_points').html(`$${teamPointNums[1]}`);
                break;
        }
        var coors = "" + currentX + currentY;
        $(`#${coors}`).css('background-color', 'blue');
    });
});

function init() {
    socket.emit('gen_host_code', {'gen_host_code':true});
}


function clickBox(x, y) {
    currentX = x;
    currentY = y;
    showBox(x, y);
}

function showBox(row, y) {
    var findQuestion = fileData[`${row}`][y];
    var findAnswer = fileData['ANSWER_MATRIX'][currentX][currentY];
    socket.emit('theQuestion', {'question': findQuestion, 'answer':findAnswer, 'questionValue':row});
    $('#currentQuestion').html(fileData[`${row}`][y]);
    $('#questionBox').show();

}

function clickerInit() {
    $('#enterCode').show();
}
function answer() {
    $('#questionAnswer').html(`<h1><b>${fileData['ANSWER_MATRIX'][currentX][currentY]}</b></h1> <br> <a id="continue">Continue</a>`);
}

$('#continue').click(function () {
    $('#questionBox').hide();

});
function join() {
    var codeVal = $('#joinCode').val();
    console.log(codeVal);
    socket.emit('join_clicker', { 'code': codeVal });
    /*
        $.ajax({
            type:'POST',
            url:'/join_clicker',
            data:{code:codeVal},
            success:function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        */
}

$('#addTeam').click(function () {
    if (teamCount == 4) {
        alert('Sorry, Team limit reached!');
    } else {
        teamCount += 1;
        var newElement = $(`<p id="team${teamCount}" class="theTeamName"  contenteditable="true">Team ${teamCount}</p>`);
        $('.teamCont').append(newElement);
    }

});

$('.theTeamName').on('input', function () {
    var id = $(this).attr('id');
    switch (id) {
        case 'team1':
            $('#head1').html($(`#${id}`).html());
            break;
        case 'team2':
            $('#head2').html($(`#${id}`).html());
            break;
    }
});

$('#clickers').on('change', function () {
    if ($(this).is(':checked')) {
        $('.teamClickerCont').removeClass('disabled');
        socket.emit('clickers', { 'needed': true, 'teamCount': teamCount });

    } else {
        $('.teamClickerCont').addClass('disabled');
        socket.emit('clickers', { 'needed': false });

    }
});

function joinHost() {
    var codeVal = $('#joinCode').val();
    console.log(codeVal);
    socket.emit('join_host', { 'code': codeVal });
}
/*

Gameboard:




*/


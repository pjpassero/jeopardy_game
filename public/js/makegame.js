var json = {
    "headers": [

    ],
    "0": [

    ],
    "1": [

    ],
    "2": [

    ],
    "3": [

    ],
    "4": [

    ],

    "ANSWER_MATRIX": [
        [],
        [],
        [],
        [],
        []
    ]
};

var currentX = 0;
var currentY = 0;
var currentHeader = 0;
var gameFileName = "";

function clickBox(x, y) {
    currentX = x;
    currentY = y;
}
function header(num) {
    currentHeader = num

}
function setName() {
    gameFileName = $('#fileNameGame').val();
    $('#enterGameFileName').hide();

}
function onloadTEST() {
    $('#enterGameFileName').show();
    for (var i = 0; i < 5; i++) {
        for (var k = 0; k < 6; k++) {
            var concat = "" + i + k;
            json[i][k] = $(`#${concat}`).children('.question').html();
            json['ANSWER_MATRIX'][i][k] = $(`#${concat}`).children('.answer').html();
        }
    }
  
}

$('.question').on('input', function () {
    json[currentX][currentY] = $(this).html();
});

$('.answer').on('input', function () {
    console.log($(this).parent().attr('id'));
    switch (currentX) {
        case 0:
            json['ANSWER_MATRIX'][currentX][currentY] = $(this).html();
            console.log(json);
            break;
        case 1:
            json['ANSWER_MATRIX'][currentX][currentY] = $(this).html();
            console.log(json);
            break;
        case 2:
            json['ANSWER_MATRIX'][currentX][currentY] = $(this).html();
            console.log(json);
            break;
        case 3:
            json['ANSWER_MATRIX'][currentX][currentY] = $(this).html();
            console.log(json);
            break;
        case 4:
            json['ANSWER_MATRIX'][currentX][currentY] = $(this).html();
            console.log(json);
            break;
        case 5:
            json['ANSWER_MATRIX'][currentX][currentY] = $(this).html();
            console.log(json);
            break;
    }
});

$('.headerCols').on('input', function () {
    switch (currentHeader) {
        case 0:
            json["headers"][currentHeader] = $(this).children('p').html();
            break;
        case 1:
            json["headers"][currentHeader] = $(this).children('p').html();
            break;
        case 2:
            json["headers"][currentHeader] = $(this).children('p').html();
            break;
        case 3:
            json["headers"][currentHeader] = $(this).children('p').html();
            break;
        case 4:
            json["headers"][currentHeader] = $(this).children('p').html();
            break;
        case 5:
            json["headers"][currentHeader] = $(this).children('p').html();
            break;

    }
});



function saveData() {
    $('#gameFileGen').empty();
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    $(`<a href="data:${data}" download="${gameFileName}.json">Download Link: ${gameFileName}</a>`).appendTo('#gameFileGen');
}


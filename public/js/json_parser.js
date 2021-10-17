var fileData;

/*
Submits the uploaded file to the server via the formdata object. 
*/
function submitFile() {
    var file = $('#theFile')[0].files[0];
    var formdata = new FormData();
    formdata.append('file', file);
    $.ajax({
        type: 'post',
        url: '/uploadFile',
        enctype: 'multipart/form-data',
        data: formdata,
        dataType:'json',
        processData: false,
        contentType: false,
        success: function (response) {
            fileData = response.theData;
            console.log(fileData);
            if(response.status == true) {
                $('#status').html('File Uploaded! Your gameboard is ready!');
                $('#status').css('color', 'darkgreen');
            } else {
                $('#status').html('There is an error in your file, try again!');
                $('#status').css('color', 'darkred');
            }
        },
        error: function (data) {
            console.log('Error:', data);
        }
    });
}


function loadBoard() {
    
    for (var i = 0; i < 6; i++) {
        $(`#header${i}`).html(`<h2>${ fileData['headers'][i]}</h2>`);
    }
    $('#initDash').hide();


}
/**
 * Created by john on 5/10/17.
 */

var translations = {};

var seconds = 0;

var select_state = false;

var selected_cell = {
    row: null,
    col: null
};

var words = [];
var words_len = 0;
var words_resolved = 0;

var selected_letter = null;
var selected_word = '';

function wordFound() {
    words_resolved += 1;
    words.splice(words.indexOf(selected_word), 1);
    refreshScore();
}

function checkSelected() {
    if(words.indexOf(selected_word) != -1){
        wordFound();
        return true;
    }
    return false;
}

function clearSelected() {
    $(".selected").removeClass('selected');
    select_state = false;
    selected_word = '';
    selected_letter = null;
    selected_cell = null;
}

function changeSelectedLetter(selector) {
    selected_letter = {
        row: selector.data('row'),
        col: selector.data('col'),
        letter: selector.html()
    };
}

function showWord() {
    html = '';
    for(var i=0; i<selected_word.length; i++){
        html += '<li>' + selected_word[i].toUpperCase() + '</li>';
    }
    $('.word>.items>.list').html(html);
}

function initGame() {

    $(".unresolved").mousedown(function () {
        $(this).addClass('selected');
        select_state = true;
        changeSelectedLetter($(this));
        selected_word += $(this).text();
        showWord();
    });

    $(".unresolved").mouseenter(function () {
        if(select_state){
            col_diff = Math.abs(selected_letter.col - $(this).data('col'));
            row_diff = Math.abs(selected_letter.row - $(this).data('row'));

            if(col_diff + row_diff == 1){
                $(this).addClass('selected');
                changeSelectedLetter($(this));
                selected_word += $(this).text();
                showWord();
            }
        }
    });

    $("body").mouseup(function () {
        if(checkSelected()){
            $(".selected").removeClass('unresolved');
            $(".selected").addClass('resolved');
        } else {
            $('.word>.items>.list').html('<li></li>');
        }
        clearSelected();
    });

    setInterval(refreshTime, 1000);
}

function generateMatrix(json) {
    var html = "";

    for(var i=0; i<json.data.length; i++){
        html += "<div class='row'>";
        for(var j=0;j<json.data[i].length;j++){
            html += '<div class="cell unresolved" data-col=' + j + ' data-row=' + i + '><span>' + json.data[i][j] + '</span></div>'
        }
        html += "</div>";
    }

    $('.matrix>.items').html(html);
}

function getWords(json) {
    for(var i=0; i<json.words.length; i++){
        words.push(json.words[i]);
    }

    words_len = words.length;
    translations = json.translations;
}


function refreshScore() {
    $('.score>span').html(words_resolved + '/' + words_len);
    if(words_resolved == 1){
        showResult();
    }
}


function refreshTime() {
    seconds += 1;
    $('.timer>span').html(seconds + ' сек');
}


function showResult() {
    // for(var keys in translates){
    //
    // }
    params = 'words=' + JSON.stringify(translations) + '&time=' + seconds;
    location.href = "file:///home/john/Desktop/temp/result.html?" + params;
}


$.getJSON(
    'http://62.109.10.175:8000/get_matrix/?h=5&w=5',
    function (json) {

        generateMatrix(json);
        getWords(json);
        refreshScore();
        initGame();
        console.log(json);
    }
);
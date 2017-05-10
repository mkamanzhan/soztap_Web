/**
 * Created by john on 5/11/17.
 */

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

html = '';
for(var i=0; i<10; i++){
    if(getURLParameter('word' + i) == null) break;
    html += '<li>' + getURLParameter('word' + i) + '</li>';
    // console.log(getURLParameter('trans' + i));
}
$('div.list>ul.list').html(html);

$('.resu>span').html(getURLParameter('time') + ' сек');


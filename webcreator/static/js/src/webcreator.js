/* Javascript for webCreatorXBlock. */
var App = angular.module('ui.webcreator', ['ui.bootstrap']);
function webCreatorXBlock(runtime, element) {

    function updateCount(result) {
        $('.count', element).text(result.count);
    }

    var handlerUrl = runtime.handlerUrl(element, 'increment_count');

    $('p', element).click(function(eventObject) {
        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify({"hello": "world"}),
            success: updateCount
        });
    });

    $(function ($) {
        /* Here's where you'd do things on page load. */

    });
}


var editor = ace.edit("jseditor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/javascript");
editor = ace.edit("csseditor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/css");
editor = ace.edit("htmleditor");
editor.setTheme("ace/theme/textmate");
editor.getSession().setMode("ace/mode/html");


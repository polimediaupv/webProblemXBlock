/* Javascript for webCreatorXBlock. */
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

    $(window).load(function (){


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

function showStuff(id,element) {

        console.log("patata");
        tabnames = $(".editor",element.parentNode.parentNode).map(function(){return $(this).context.id;}).get();

        tabnames.forEach(function(tab) {
             $("#"+tab,element.parentNode.parentNode).addClass("oculta");
        });

        $("#"+id,element.parentNode.parentNode).removeClass("oculta");
       return false;
   }
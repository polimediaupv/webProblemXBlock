/* Javascript for webCreatorXBlock. */
function webCreatorXBlock(runtime, element) {

    console.log("patatas");
    var editor = ace.edit("jseditor",element);
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setValue(atob($($("#jseditor",element)[0]).attr("value")));
    editor.resize();


    editor = ace.edit("csseditor",element);
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/css");
    editor.getSession().setValue(atob($($("#csseditor",element)[0]).attr("value")));
    editor.resize();

    editor = ace.edit("htmleditor",element);
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/html");
    editor.getSession().setValue(atob($($("#htmleditor",element)[0]).attr("value")));
    editor.resize();

    $(function ($) {
        /* Here's where you'd do things on page load. */
        console.log("patata");
    });

    $(window).load(function (){
        console.log("patata");
    });
}



function showStuff(id,element) {

        console.log("patata");
        tabnames = $(".editor",element.parentNode.parentNode).map(function(){return $(this).context.id;}).get();

        tabnames.forEach(function(tab) {
             $("#"+tab,element.parentNode.parentNode).addClass("oculta");
        });

        $("#"+id,element.parentNode.parentNode).removeClass("oculta");
       return false;
   }
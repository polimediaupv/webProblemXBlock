/* Javascript for webCreatorXBlock. */
function webCreatorXBlock(runtime, element) {

    console.log("patatas");
    var editor = ace.edit($("#jseditor",element)[0]);
    var content = atob($($("#jseditor",element)[0]).attr("value").replace(/\s/g, ''))
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setValue(content);
    editor.resize();
    $("#jseditor",element).addClass("oculta");


    editor = ace.edit($("#csseditor",element)[0]);
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/css");
    content = atob($($("#csseditor",element)[0]).attr("value").replace(/\s/g, ''))
    editor.getSession().setValue(content);
    editor.resize();
    //we add the hidden class after the resize of the editor
    $("#csseditor",element).addClass("oculta");

    editor = ace.edit($("#htmleditor",element)[0]);
    editor.setTheme("ace/theme/textmate");
    editor.getSession().setMode("ace/mode/html");
    content = atob($($("#htmleditor",element)[0]).attr("value").replace(/\s/g, ''))
    editor.getSession().setValue(content);
    editor.resize();

    var evaluated = $("#valor", element).val();
    console.log(evaluated);


    if (evaluated == 1) {
        editor = ace.edit($("#htmleditor",element)[0]);
        editor.setReadOnly(true);
        editor = ace.edit($("#csseditor",element)[0]);
        editor.setReadOnly(true);
        editor = ace.edit($("#jseditor",element)[0]);
        editor.setReadOnly(true);
        $("#guardar",element).attr('disabled', 'disabled');
        $("#resetear",element).attr('disabled', 'disabled');
        $("#eval",element).attr('disabled', 'disabled');
        $("#unlock",element).removeAttr('disabled');

    } else {
        editor = ace.edit($("#htmleditor",element)[0]);
        editor.setReadOnly(false);
        editor = ace.edit($("#csseditor",element)[0]);
        editor.setReadOnly(false);
        editor = ace.edit($("#jseditor",element)[0]);
        editor.setReadOnly(false);
        $("#guardar",element).removeAttr('disabled');
        $("#resetear",element).removeAttr('disabled');
        $("#eval",element).removeAttr('disabled');
        $("#unlock",element).attr('disabled', 'disabled');
    }
    ;

    $(element).find('.actions.save').bind('click', function() {
       var editor = ace.edit($("#htmleditor",element)[0]);
       var htmlCode = btoa(editor.getSession().getValue());
       editor = ace.edit($("#jseditor",element)[0]);
       var jsCode = btoa(editor.getSession().getValue());
       editor = ace.edit($("#csseditor",element)[0]);
       var cssCode = btoa(editor.getSession().getValue());

       var data = {
            'jsCode': jsCode,
            'htmlCode': htmlCode,
            'cssCode': cssCode,
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'save_answer');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });
   });

    $(element).find('.actions.reset').bind('click', function() {
       /*var editor = ace.edit($("#htmleditor",element)[0]);
       var htmlCode = btoa(editor.getSession().getValue());
       editor = ace.edit($("#jseditor",element)[0]);
       var jsCode = btoa(editor.getSession().getValue());
       editor = ace.edit($("#csseditor",element)[0]);
       var cssCode = btoa(editor.getSession().getValue());*/

       var data = {
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'reset_answer');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });
   });

    $(element).find('.actions.display').bind('click', function () {

        showResult(element);

    });

    $(element).find('.actions.eval').bind('click', function () {

        /*var editor = ace.edit($("#htmleditor",element)[0]);
        editor.setReadOnly(true);
        editor = ace.edit($("#csseditor",element)[0]);
        editor.setReadOnly(true);
        editor = ace.edit($("#jseditor",element)[0]);
        editor.setReadOnly(true);
        $("#guardar",element).attr('disabled', 'disabled');
        $("#resetear",element).attr('disabled', 'disabled');
        $("#eval",element).attr('disabled', 'disabled');
        $("#unlock",element).removeAttr('disabled');*/

        var evaluated = 1;

        var data = {
            'evaluated': evaluated
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'evaluate');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });


    });

    $(element).find('.actions.unlock').bind('click', function (){

        /*$("#guardar",element).removeAttr('disabled');
        $("#resetear",element).removeAttr('disabled');
        $("#eval",element).removeAttr('disabled');
        $("#unlock",element).attr('disabled', 'disabled');*/


        var evaluated = 0;

        var data = {
            'evaluated': evaluated
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'evaluate');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });


    });








    $(function ($) {
        /* Here's where you'd do things on page load. */
        console.log("patata");
    });

    $(window).load(function (){
        console.log("patata");
    });

    showResult(element);

}


function showResult(element) {

        var iframe = $("iframe", element)[0];
        var doc = iframe.contentDocument;
        var editor = ace.edit($("#htmleditor", element)[0]);

        text = editor.getSession().getValue();


        editor = ace.edit($("#csseditor", element)[0]);
        var cssCode= editor.getSession().getValue();
        var cssLink = "<style type='text/css'>" + cssCode + "</style>";
        //var head = $("iframe").contents().find("head")[0];
        //head.append(cssLink);
        text += cssLink;

        editor = ace.edit($("#jseditor", element)[0]);
        var jsCode =  editor.getSession().getValue();

        var jsLink = "<script type='text/javascript'>" + jsCode + "</" +"script>";

        text += jsLink;

        doc.open();
        doc.writeln(text);
        doc.close();
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
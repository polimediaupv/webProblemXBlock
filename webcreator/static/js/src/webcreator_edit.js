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

    $(element).find('.cancel-button').bind('click', function() {
        runtime.notify('cancel', {});
    });

   $(element).find('.save-button').bind('click', function() {
       var editor = ace.edit($("#htmleditor",element)[0]);
       var htmlCode = btoa(editor.getSession().getValue());
       editor = ace.edit($("#jseditor",element)[0]);
       var jsCode = btoa(editor.getSession().getValue());
       editor = ace.edit($("#csseditor",element)[0]);
       var cssCode = btoa(editor.getSession().getValue());

       var data = {
            'display_name': $(edit_display_name).context.value,
            'jsCode': jsCode,
            'htmlCode': htmlCode,
            'cssCode': cssCode,
        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'save_content');
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
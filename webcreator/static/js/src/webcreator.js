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
        //$("#unlock",element).removeAttr('disabled');

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
        //$("#unlock",element).attr('disabled', 'disabled');
    }

    $(element).find('.actions.save').bind('click', function() {
       //event.preventDefault();
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
        //$("#saving").show();

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'save_answer');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {

                 window.location.reload(false);
                /*$("#saving").hide();
                showResult(element);*/

            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });
   });

    $(element).find('.actions.reset').bind('click', function() {


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



        /*var evaluated = 1;

        var data = {
            'evaluated': evaluated
        };*/

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

        /*var evaluated = 0;

        var data = {
            'evaluated': evaluated
        };*/

        var data = {

        };

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        var handlerUrl = runtime.handlerUrl(element, 'unlock');
        $.post(handlerUrl, JSON.stringify(data)).done(function(response) {
            if (response.result === 'success') {
                window.location.reload(false);
            } else {
                $('.xblock-editor-error-message', element).html('Error: '+response.message);
                $('.xblock-editor-error-message', element).css('display', 'block');
            }
        });


    });



    $(element).find('#grade-submissions-button').leanModal().bind('click', function () { //.actions.correction

        $('.xblock-editor-error-message', element).html();
        $('.xblock-editor-error-message', element).css('display', 'none');
        console.log("entraste");
        $("#grade-area").empty();
        var handlerUrl = runtime.handlerUrl(element, 'get_staff_grading_data');
        $.get(handlerUrl).done(function(data, response) {

            var assignments = data.assignments;
            var max_score = data.max_score;

            $("#notas").empty();
            //$("<h2>Lista de alumnos que hansubido su ejercicio para evaluar</h2>").appendTo($('#notas'));

            $("<table class='grid' id='alumnos'>").appendTo($('#notas'));
            var header = "<tr><th>Numero modulo</th><th>Nombre alumno</th><th>Subido</th><th>Nota</th></tr>";
            $(header).appendTo($('#alumnos'));
            var items = [];
            $.each($(assignments), function(index, element){

                if(this.evaluated ===1){
                    console.log("Numero módulo: " + this.module_id);
                    console.log("Nombre Completo: " + this.fullname);
                    console.log("Nombre de usuario: " + this.username);
                    //$('#notas').html(element[index].fullname);
                    var score = this.score !=null ? this.score : "";
                    items.push("<tr><td><a href='#' id='"+ this.module_id + "' >"  + this.module_id + "</a></td><td>" + this.fullname + "</td>" +
                        "<td>" + this.timestamp + "</td><td>" + score + "/" + max_score + "</td></tr>");


                }

            });


            console.log(items.join(""));
            var filas = items.join("");
            $(filas).appendTo($('#alumnos'));



            console.log("asigna al div");



            $("#alumnos tbody tr td a").on('click', function(event){
                event.preventDefault();
                //$("#tablon").modal('toggle');

                console.log("clicked");
                var moduleId = parseInt($(this).attr('id'), 10);
                console.log(moduleId);

                var info = {

                    'moduleId' : moduleId
                }

                $('.xblock-editor-error-message', element).html();
                $('.xblock-editor-error-message', element).css('display', 'none');
                var handlerUrl = runtime.handlerUrl(element, 'get_codes_from_student');

                $.ajax({
                    type: 'POST',
                    url: handlerUrl,
                    data: {info: JSON.stringify(info)},
                    dataType:'json'

                }).done(function(data){

                    // Cargamos los datos de codigo del alumno en el area de visualizacion.

                    var username = data.username;
                    console.log(username);
                    var jsContent= data.jsCode;
                    console.log(jsContent);
                    $("#htmleditor",element).addClass("oculta");
                    $("#jseditor",element).removeClass("oculta");

                    var editor = ace.edit($("#jseditor", element)[0]);
                    editor.setTheme("ace/theme/textmate");
                    editor.getSession().setMode("ace/mode/javascript");
                    editor.getSession().setValue(atob(jsContent));
                    editor.resize();
                    $("#jseditor",element).addClass("oculta");

                    $("#csseditor",element).removeClass("oculta");
                    var cssContent= data.cssCode;
                    console.log(cssContent);
                    editor = ace.edit($("#csseditor",element)[0]);
                    editor.setTheme("ace/theme/textmate");
                    editor.getSession().setMode("ace/mode/css");
                    editor.getSession().setValue(atob(cssContent));
                    editor.resize();
                    $("#csseditor",element).addClass("oculta");


                    $("#htmleditor",element).removeClass("oculta");
                    var htmlContent= data.htmlCode;
                    console.log(atob(htmlContent));
                    editor = ace.edit($("#htmleditor",element)[0]);
                    editor.setTheme("ace/theme/textmate");
                    editor.getSession().setMode("ace/mode/html");
                    editor.getSession().setValue(atob(htmlContent));
                    editor.resize();

                    // Visualizamos el código del alumno

                    showResult(element);


                    // Creamos el área de puntuación del alumno.
                    var items=[];
                    items.length=0;

                    items.push("<form id='enter-grade-form'><input id='module_id-input' type='hidden' name='module_id'/>" +
                        "<div><h2>Estás evaluando el código y viendo la zona de notas del estudiante:  <span id='student-name'/></h2></div><div>Grade: <input id='grade-input' name='grade'/>" +
                        "<span class='error'></span></div>" +
                        "<div>Comment: <textarea id='comment-input' name='comment' rows='4'></textarea></div>" +
                        "<div><button type='submit'>Guardar datos alumno</button><button type='button' id='enter-grade-cancel'>Cancelar evaluación</button>" +
                        "<button type='button' id='remove-grade'>Borrar notas y desbloquear edición Alumno</button></div></form>");

                    var lineas_form = items.join("");
                    $(lineas_form).appendTo($('#grade-area'));

                    // Aquí hemos de asociar los eventos a los botones que controlan el form.

                    var form = $(element).find("#enter-grade-form");


                    form.off("submit").on("submit", function(event) {
                        //var max_score = row.parents("#grade-info").data("max_score");
                        var score = Number(form.find("#grade-input").val());
                        event.preventDefault();
                        if (isNaN(score)) {
                            form.find(".error").html("<br/>Grade must be a number.");
                        }
                        else if (score < 0) {
                            form.find(".error").html("<br/>Grade must be positive.");
                        } else if (score=""){
                            form.find(".error").html("<br/>Grade cannot be empty");
                        }
                        //else if (score > max_score) {
                        //    form.find(".error").html("<br/>Maximum score is " + max_score);
                        //}
                        else {
                            // No errors
                            var handlerUrl = runtime.handlerUrl(element, 'enter_grade');
                            $.post(handlerUrl, form.serialize())
                                .success(function(){


                                    console.log("Hola");
                                    $("#grade-area").empty();
                                    $("#grade-submissions-button").trigger("click");
                                }).error(function(){
                                    console.log("Error en la entrega de datos");
                                    //$("#grade-area").empty();
                                    alert("El valor de la no puede estar vacío");
                                    //$("#grade-submissions-button").trigger("click");

                                });
                        }
                    });

                    form.find("#enter-grade-cancel").on("click", function(){

                        $("#grade-area").empty();
                        $("#grade-submissions-button").trigger("click");

                    });

                    form.find("#remove-grade").on("click", function(){

                        var handlerUrl = runtime.handlerUrl(element, 'remove_grade');
                        $.ajax({
                            type: 'POST',
                            url: handlerUrl,
                            data: {info: JSON.stringify(info)},
                            dataType:'json'

                        }).done(function(){
                            $("#grade-area").empty();
                            $("#grade-submissions-button").trigger("click");
                        })

                    })




                    // Cargamos los comentarios y la nota en el area de puntuación del alumno.
                    var form = $(element).find("#enter-grade-form");
                    /*$(element).find("#student-name").text("");
                    form.find("#module_id-input").val("");
                    form.find("#grade-input").val("");
                    form.find("#comment-input").text("");*/
                    $(element).find("#student-name").text(data.username);
                    form.find("#module_id-input").val(moduleId);
                    form.find("#grade-input").val(data.score);
                    form.find("#comment-input").text(data.comments);

                    //

                    // Cerramos la modal

                    $("#lean_overlay").trigger("click");
                    console.log("cierra la modal?");





                });


            });
        });

    });



    $(function ($) {
        /* Here's where you'd do things on page load. */
        console.log("coles");
        $("#saving").hide();


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
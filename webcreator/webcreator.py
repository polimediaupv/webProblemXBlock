"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import base64

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String
from xblock.fragment import Fragment


class webCreatorXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    display_name = String(display_name="Display Name",
                          default="Web Creator",
                          scope=Scope.settings,
                          help="Name of the component in the edxplatform")

    cssCodeTeacher = String(display_name="cssCode",
                  default=".alerta {\n\tbackground-color: #f9301c;\n\tdisplay:inline-block;\n\tcolor: #ffffff;\n\tfont-family:Arial;\n\tfont-size:12px;\n\tfont-weight:bold;\n\tfont-style:normal;\n\ttext-align:center;\n}",
                  scope=Scope.content,
                  help="cssCode")
    htmlCodeTeacher = String(display_name="htmlCode",
                  default="<!DOCTYPE html>\n<html>\n\t<body>\n\t<h1 class='alerta'>hola mundo</h1>\n\t<button onclick='alerta();'>alerta</button>\n\t</body>\n</html>",
                  scope=Scope.content,
                  help="cssCode")
    jsCodeTeacher = String(display_name="jsCode",
                  default="function alerta(){\n\talert('alerta enviada desde el javascript');\n}",
                  scope=Scope.content,
                  help="cssCode")

    cssCode = String(display_name="cssCode",
                  default="",
                  scope=Scope.user_state,
                  help="cssCode")
    htmlCode = String(display_name="htmlCode",
                  default="",
                  scope=Scope.user_state,
                  help="cssCode")
    jsCode = String(display_name="jsCode",
                  default="",
                  scope=Scope.user_state,
                  help="cssCode")
    #evaluate = boolean

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the webCreatorXBlock, shown to students
        when viewing courses.
        """
        cssCode = self.cssCode if self.cssCode !="" else self.cssCodeTeacher
        htmlCode = self.htmlCode if self.htmlCode !="" else self.htmlCodeTeacher
        jsCode = self.jsCode if self.jsCode !="" else self.jsCodeTeacher

        html = self.resource_string("static/html/webcreator.html")
        frag = Fragment(html.format(self=self,cssCode=base64.encodestring(cssCode),htmlCode=base64.encodestring(htmlCode),jsCode=base64.encodestring(jsCode)))
        frag.add_css(self.resource_string("static/css/webcreator.css"))
        frag.add_javascript_url("//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js")
        frag.add_javascript(self.resource_string("static/js/src/webcreator.js"))
        frag.initialize_js('webCreatorXBlock')
        return frag

    def studio_view(self, context=None):   #studio_view
        cssCode = self.cssCodeTeacher
        htmlCode = self.htmlCodeTeacher
        jsCode = self.jsCodeTeacher

        html = self.resource_string("static/html/webcreator_edit.html")
        frag = Fragment(html.format(self=self,cssCode=base64.encodestring(cssCode),htmlCode=base64.encodestring(htmlCode),jsCode=base64.encodestring(jsCode)))
        frag.add_css(self.resource_string("static/css/webcreator.css"))
        frag.add_javascript_url("//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js")
        frag.add_javascript(self.resource_string("static/js/src/webcreator_edit.js"))
        frag.initialize_js('webCreatorXBlock')
        return frag

    @XBlock.json_handler
    def save_content(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        self.display_name = data['display_name']
        self.jsCodeTeacher = data['jsCode']
        self.cssCodeTeacher = data['cssCode']
        self.htmlCodeTeacher = data['htmlCode']

        return {
            'result' : 'success',
        }

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("webCreatorXBlock",
             """<vertical_demo>
                <webcreator/>
                </vertical_demo>
             """),
        ]
"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

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
                  default="codigocss",
                  scope=Scope.content,
                  help="cssCode")
    htmlCodeTeacher = String(display_name="htmlCode",
                  default="codigohtml",
                  scope=Scope.content,
                  help="cssCode")
    jsCodeTeacher = String(display_name="jsCode",
                  default="codigojs",
                  scope=Scope.content,
                  help="cssCode")

    cssCode = String(display_name="cssCode",
                  default="codigocss",
                  scope=Scope.user_state,
                  help="cssCode")
    htmlCode = String(display_name="htmlCode",
                  default="codigohtml",
                  scope=Scope.user_state,
                  help="cssCode")
    jsCode = String(display_name="jsCode",
                  default="codigojs",
                  scope=Scope.user_state,
                  help="cssCode")

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
        html = self.resource_string("static/html/webcreator.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/webcreator.css"))
        frag.add_javascript(self.resource_string("static/js/lib/ace.js"))
        frag.add_javascript(self.resource_string("static/js/lib/mode-html.js"))
        frag.add_javascript(self.resource_string("static/js/lib/mode-css.js"))
        frag.add_javascript(self.resource_string("static/js/lib/mode-javascript.js"))
        frag.add_javascript(self.resource_string("static/js/lib/worker-html.js"))
        frag.add_javascript(self.resource_string("static/js/lib/worker-css.js"))
        frag.add_javascript(self.resource_string("static/js/lib/worker-javascript.js"))
        frag.add_javascript(self.resource_string("static/js/lib/theme-textmate.js"))
        frag.add_javascript(self.resource_string("static/js/src/webcreator.js"))
        frag.initialize_js('webCreatorXBlock')
        return frag

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}

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
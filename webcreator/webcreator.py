"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
import base64
import json
import datetime
import pytz

from webob.response import Response

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String, Float, Boolean, DateTime
from xblock.fragment import Fragment
from django.template import  Context, Template
from courseware.models import StudentModule


class webCreatorXBlock(XBlock):
    """
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    has_score = True
    icon_class = 'problem'

    display_name = String(display_name="Display Name",
                          default="Web Creator",
                          scope=Scope.settings,
                          help="Name of the component in the edxplatform")

    weight = Float(
        display_name="Problem Weight",
        help=("Defines the number of points each problem is worth. "
              "If the value is not set, the problem is worth the sum of the "
              "option point values."),
        values={"min": 0, "step": .1},
        scope=Scope.settings
    )

    points = Float(
        display_name="Maximum score",
        help=("Maximum grade score given to assignment by staff."),
        values={"min": 0, "step": .1},
        default=100,
        scope=Scope.settings
    )

    score = Float(
        display_name="Grade score",
        default=None,
        help=("Grade score given to assignment by staff."),
        values={"min": 0, "step": .1},
        scope=Scope.user_state
    )

    score_published = Boolean(
        display_name="Whether score has been published.",
        help=("This is a terrible hack, an implementation detail."),
        default=True,
        scope=Scope.user_state
    )

    score_approved = Boolean(
        display_name="Whether the score has been approved by an instructor",
        help=("Course staff may submit grades but an instructor must approve "
              "grades before they become visible."),
        default=False,
        scope=Scope.user_state
    )


    cssCodeTeacher = String(display_name="cssCode",
                  default="LmFsZXJ0YSB7CgliYWNrZ3JvdW5kLWNvbG9yOiAjZjkzMDFjOwoJZGlzcGxheTppbmxpbmUtYmxvY2s7Cgljb2xvcjogI2ZmZmZmZjsKCWZvbnQtZmFtaWx5OkFyaWFsOwoJZm9udC1zaXplOjEycHg7Cglmb250LXdlaWdodDpib2xkOwoJZm9udC1zdHlsZTpub3JtYWw7Cgl0ZXh0LWFsaWduOmNlbnRlcjsKfQ==",
                  scope=Scope.content,
                  help="cssCode")
    htmlCodeTeacher = String(display_name="htmlCode",
                  default="PCFET0NUWVBFIGh0bWw+CjxodG1sPgogICAgPGJvZHk+CiAgICA8aDEgY2xhc3M9J2FsZXJ0YSc+aG9sYSBtdW5kbzwvaDE+CiAgICA8YnV0dG9uIG9uY2xpY2s9J2FsZXJ0YSgpOyc+YWxlcnRhPC9idXR0b24+CiAgICA8L2JvZHk+CjwvaHRtbD4K", #"PCFET0NUWVBFIGh0bWw+CjxodG1sPgoJPGJvZHk+Cgk8aDEgY2xhc3M9J2FsZXJ0YSc+aG9sYSBtdW5kbzwvaDE+Cgk8YnV0dG9uIG9uY2xpY2s9J2FsZXJ0YSgpOyc+YWxlcnRhPC9idXR0b24+Cgk8L2JvZHk+CjwvaHRtbD4=",
                  scope=Scope.content,
                  help="cssCode")
    jsCodeTeacher = String(display_name="jsCode",
                  default="ZnVuY3Rpb24gYWxlcnRhKCl7CglhbGVydCgnYWxlcnRhIGVudmlhZGEgZGVzZGUgZWwgamF2YXNjcmlwdCcpOwp9",
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
    evaluated = Integer(display_name="evaluated",
                        default=0,
                        scope=Scope.user_state,
                        help="evaluated")

    comment = String(
        display_name="Instructor comment",
        default='',
        scope=Scope.user_state,
        help="Feedback given to student by instructor."
    )

    evaluation_timestamp = DateTime(
        display_name="Timestamp",
        scope=Scope.user_state,
        default=None,
        help="When the user wants to be evaluated"
    )

    correction_timestamp = DateTime(
        display_name="Timestamp",
        scope=Scope.user_state,
        default=None,
        help="When the instructor corrects the exercise"
    )

    def max_score(self):
        return self.points

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def is_course_staff(self):
       return getattr(self.xmodule_runtime, 'user_is_staff', False)

    def is_instructor(self):
        return self.xmodule_runtime.get_user_role() == 'instructor'

    def show_staff_grading_interface(self):
        in_studio_preview = self.scope_ids.user_id is None
        return self.is_course_staff() and not in_studio_preview

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the webCreatorXBlock, shown to students
        when viewing courses.
        """

        if not self.score_published and self.score_approved:
            self.runtime.publish(self, 'grade', {
                'value': self.score,
                'max_value': self.max_score(),
            })
            self.score_published = True

        cssCode = self.cssCode if self.cssCode !="" else self.cssCodeTeacher
        htmlCode = self.htmlCode if self.htmlCode !="" else self.htmlCodeTeacher
        jsCode = self.jsCode if self.jsCode !="" else self.jsCodeTeacher
        evaluated = self.evaluated
        staff = self.show_staff_grading_interface()
        #staff = self.is_course_staff()
        instructor = self.is_instructor()
        if self.score is not None and self.score_approved:
            graded = {'score': self.score, 'comment': self.comment}
        else:
            graded = None



        context = {
            "cssCode" : cssCode,
            "htmlCode" : htmlCode,
            "jsCode" : jsCode,
            "evaluated" : evaluated,
            "staff" : staff,
            "instructor": instructor,
            "graded" : graded,

        }

        #html = self.resource_string("static/html/webcreator.html")
        frag = Fragment()
        frag.add_content(render_template('static/html/webcreator.html', context))

        #frag = Fragment(unicode(html).format(self=self,cssCode=cssCode,htmlCode=htmlCode,jsCode=jsCode, evaluated=evaluated, staff=staff))
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
        frag = Fragment(html.format(self=self,cssCode=cssCode,htmlCode=htmlCode,jsCode=jsCode))
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

    @XBlock.json_handler
    def save_answer(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        if not self.evaluated:

            self.jsCode = data['jsCode']
            self.cssCode = data['cssCode']
            self.htmlCode = data['htmlCode']

            return {
                'result' : 'success',
            }
        else:

            return {
                'message': 'Error saving data.'
            }



    @XBlock.json_handler
    def reset_answer(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        if not self.evaluated:

            self.jsCode = ""
            self.cssCode = ""
            self.htmlCode = ""


            return {
                'result' : 'success',
            }
        else:
            return {
                'message': 'Error saving data.'
            }

    @XBlock.json_handler
    def reset_answer_async(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """


        if not self.evaluated:

            self.jsCode = ""
            self.cssCode = ""
            self.htmlCode = ""

            return {
               'result' : 'success',
            }
        else:
            return {
                'message': 'Error saving data.'
            }


    @XBlock.json_handler
    def get_teacher_code(self, request, suffix='' ):

        if not self.evaluated:

            cssCode = self.cssCodeTeacher
            jsCode = self.jsCodeTeacher
            htmlCode = self.htmlCodeTeacher

            answer = {
            'cssCode' : cssCode,
            'jsCode' : jsCode,
            'htmlCode' : htmlCode,
            }
            return answer
        else:
            return {
                'message' : 'Error saving data.'
            }




    @XBlock.json_handler
    def evaluate(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        if not self.evaluated:

            self.jsCode = data['jsCode']
            self.cssCode = data['cssCode']
            self.htmlCode = data['htmlCode']
            self.evaluated = 1
            self.evaluation_timestamp = _now()

            return {
                'result' : 'success',
            }
        else:

            return {
                'message': 'Error saving data.'
            }


        #self.evaluated = 1
        #self.evaluated = data['evaluated']

        #return {
        #    'result' : 'success',
        #}

    @XBlock.json_handler
    def unlock(self, data, suffix=''):

        #self.evaluated = data['evaluated']
        self.evaluated = 0

        return {
            'result' : 'success',
        }


    @XBlock.handler
    def get_staff_grading_data(self, request, suffix=''):
        assert self.is_course_staff()
        return Response(json_body=self.staff_grading_data())

    def staff_grading_data(self):
        def get_student_data(module):
            state = json.loads(module.state)
            #instructor = self.is_instructor()
            score = state.get('score', '')

            #approved = state.get('score_approved')
            return {
                'module_id': module.id,
                'username': module.student.username,
                'fullname': module.student.profile.name,
                'evaluated': state.get('evaluated', 0),
                #'cssCode' : state.get("cssCode"),
                #'jsCode' : state.get("jsCode"),
                #'htmlCode' : state.get("htmlCode")
                #'filename': state.get("uploaded_filename"),
                #'timestamp': state.get("uploaded_timestamp"),
                #'published': state.get("score_published"),
                'score': score,
                'timestamp': state.get("evaluation_timestamp"),
                #'approved': approved,
                #'needs_approval': instructor and score is not None
                                  #and not approved,
                #'may_grade': instructor or not approved,
                #'annotated': state.get("annotated_filename"),
                #'comment': state.get("comment", ''),
            }

        query = StudentModule.objects.filter(
            course_id=self.xmodule_runtime.course_id,
            module_state_key=self.location
        )

        return {
            'assignments': [get_student_data(module) for module in query],
            'max_score': self.max_score(),
        }

    @XBlock.handler
    def get_codes_from_student(self, request, suffix='' ):
        assert self.is_course_staff()
        #json_data = request.read()
        print request

        print request.POST
        print request.POST.get('info')
        info = json.loads(request.POST.get('info'))
        print info['moduleId']

        module_id = info['moduleId']

        module = StudentModule.objects.get(pk=module_id) #pk=request.params['module_id']
        state = json.loads(module.state)
        cssCode = state['cssCode']
        htmlCode = state['htmlCode']
        jsCode = state['jsCode']
        #comment = state['comment']
        username = module.student.username

        answer = {
            'cssCode' : cssCode,
            'jsCode' : jsCode,
            'htmlCode' : htmlCode,
            'username': username,
            'comments' : state.get('comment',''),
            'score' : state.get('score', ''),
        }




        success_msg = {
            'result' : 'success',
        }
        return Response(json_body=answer)

    @XBlock.handler
    def enter_grade(self, request, suffix=''):
        assert self.is_course_staff()
        print "Hola"
        module = StudentModule.objects.get(pk=request.params['module_id'])
        print "Adios"
        state = json.loads(module.state)
        state['score'] = float(request.params['grade'])
        state['comment'] = request.params.get('comment', '')
        state['score_published'] = False    # see student_view
        state['score_approved'] = self.is_instructor()
        module.state = json.dumps(state)

        # This is how we'd like to do it.  See student_view
        # self.runtime.publish(self, 'grade', {
        #     'value': state['score'],
        #     'max_value': self.max_score(),
        #     'user_id': module.student.id
        # })

        module.save()

        success_msg = {
            'result' : 'success',
        }

        return Response(json_body=success_msg)

    @XBlock.handler
    def remove_grade(self, request, suffix=''):
        assert self.is_course_staff()
        info = json.loads(request.POST.get('info'))
        module_id = info['moduleId']
        module = StudentModule.objects.get(pk=module_id)
        state = json.loads(module.state)
        state['score'] = None
        state['comment'] = ''
        state['score_published'] = False    # see student_view
        state['score_approved'] = False
        #state['annotated_sha1'] = None
        #state['annotated_filename'] = None
        #state['annotated_mimetype'] = None
        #state['annotated_timestamp'] = None
        state['cssCode'] =''
        state['jsCode'] =''
        state['htmlCode'] =''
        state['evaluated'] = 0
        module.state = json.dumps(state)
        module.save()

        success_msg = {
            'result' : 'success',
        }

        return Response(json_body=success_msg)






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


def _now():
    return datetime.datetime.utcnow().replace(tzinfo=pytz.utc)

def load_resource(resource_path):
    """
    Gets the content of a resource
    """
    resource_content = pkg_resources.resource_string(__name__, resource_path)
    #return unicode(resource_content)
    return resource_content.decode("utf8")


def render_template(template_path, context={}):
    """
    Evaluate a template by resource path, applying the provided context
    """
    template_str = load_resource(template_path)
    template = Template(template_str)
    return template.render(Context(context))


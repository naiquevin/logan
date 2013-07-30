import json

from flask import Flask, render_template, jsonify, session, Response
from werkzeug.contrib.cache import FileSystemCache
import tasks


# configuration
BROKER_URL = 'amqp://logan:123456@localhost:5672/logan'
LOG_FILE_TO_ANALYZE = '/home/vineet/errorlogs2/kodecrm_prod/kodecrm_apache2/kodecrm-05Jul.json'
URL_PATTERNS_FILE = '/home/vineet/devutils/vineet_tools/.config/logan_dynamic_patterns.json'
SECRET_KEY = 'my-secret'


# app instance
app = Flask(__name__)
app.config.from_object(__name__)

# cache instance
cache = FileSystemCache('./cache')


# views 
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/url_hits')
def url_hits():
    urlhits = cache.get('url_hits')
    if urlhits is None:
        task_id = session.get('task-url_hits')
        if task_id is None:
            t = tasks.url_hits.delay()
            session['task-url_hits'] = t.task_id
        return jsonify({'ready': False})
    else:
        # task_id needs to be cleared from the session so that when
        # cache is timed out, url_hits function is again called and
        # it's results are cached
        task_id = session.pop('task-url_hits', None)
        return jsonify({'ready': True, 'url_hits': urlhits})


@app.route('/ready')
def check_if_ready():
    ready_tasks = [k for
                   k, v in session.iteritems() 
                   if k.startswith('task-') and tasks.is_ready(v)]
    for task in ready_tasks:
        session.pop(task)
    ready_tasks = [t.lstrip('task-') for t in ready_tasks]
    return Response(json.dumps(ready_tasks), mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=True)

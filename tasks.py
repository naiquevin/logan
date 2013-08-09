from celery import Celery
from celery.result import AsyncResult
from logutils import logan, log_uagents
from models import fetch_dynamic_patterns, fetch_logs
from app import app, cache

# initialize celery
celery = Celery('logan.tasks', 
                backend='amqp', 
                broker=app.config['BROKER_URL'])

@celery.task
def url_hits():
    patterns = fetch_dynamic_patterns(app.config['URL_PATTERNS_FILE'])
    logs = fetch_logs(app.config['LOG_FILE_TO_ANALYZE'])
    urlhits = sorted([(k[1], v) 
                      for k, v 
                      in logan.dynamic_urls(logs, patterns).iteritems()],
                     key=lambda x: x[1],
                     reverse=True)[:20]
    cache.set('url_hits', dict(urlhits), timeout=60*60)


@celery.task
def browsers():
    logs = fetch_logs(app.config['LOG_FILE_TO_ANALYZE'])
    browser_stats = sorted([(k, v)
                            for k, v
                            in log_uagents.browsers(logs).iteritems()],
                           key=lambda x: x[1],
                           reverse=True)
    cache.set('browsers', dict(browser_stats), timeout=60*60)


def is_ready(task_id):
    r = AsyncResult(task_id, backend=celery.backend)
    return r.ready()


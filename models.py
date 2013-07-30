import json


def fetch_logs(logfile):
    with open(logfile) as f:
        logs = json.load(f)
    return logs


def fetch_dynamic_patterns(urlfile):
    with open(urlfile) as f:
        patterns = json.load(f)
    return patterns

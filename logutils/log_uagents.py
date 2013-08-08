"""Analyse the user_agents in log files

Usage: log_uagents.py browsers ( -i | FILE ) [ -f ]
       log_uagents.py devices  ( -i | FILE )
       log_uagents.py oss      ( -i | FILE ) [ -f ]
       log_uagents.py ( -h | --help | --version )

Options:
  -h --help
  -i --stdin
  -f --fullname

"""

import json
from collections import Counter
from functools import partial

from user_agents import parse
from docopt import docopt

import cli


def user_agents(logs):
    return (parse(log['user_agent']) for log in logs)


def count_stats(logs, f):
    return Counter(f(ua) for ua in user_agents(logs))


def ua_str(attr):
    return '{family}-{version}'.format(family=attr.family,
                                       version=attr.version_string)


browsers = partial(count_stats, f=lambda ua: ua.browser.family)
browsers_version = partial(count_stats, f=lambda ua: ua_str(ua.browser))

devices = partial(count_stats, f=lambda ua: ua.device.family)

oss = partial(count_stats, f=lambda ua: ua.os.family)
oss_version = partial(count_stats, f=lambda ua: ua_str(ua.os))


def write(c):
    for k, v in c.iteritems():
        print '{k}:{v}'.format(k=k, v=v)


if __name__ == '__main__':
    args = docopt(__doc__)

    if not any(args[k] for k in ['browsers', 'devices', 'oss']):
        args['browser'] = True

    with cli.read_input(args['FILE'], args['--stdin']) as f:
        logs = json.load(f)
        if args['browsers']:
            write((browsers_version if args['--fullname'] else browsers)(logs))
            exit(0)

        if args['devices']:
            write(devices(logs))
            exit(0)

        if args['oss']:
            write((oss_version if args['--fullname'] else oss)(logs))
            exit(0)

# -*- coding: utf-8 -*-

import os.path

try:
    from local import *
except Exception as err:
    print err
    print "No local.py file located you should be using one"
    from settings import *

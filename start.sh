#!/bin/bash
path=`readlink -f "${BASH_SOURCE:-$0}"`
DIR_PATH=`dirname $path`
export WEB_ROOT="${DIR_PATH}/html/20230225"
export GS_SHEET_ID='1vZtlij3VXcRzB7gh4ZevSytIuUjEjJoRJWsFM0qZ71E'

python3 python/web.py

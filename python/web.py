import os
import time
import datetime
import json
import gspread
import threading
from oauth2client.service_account import ServiceAccountCredentials
from bottle import route, run, request, static_file

fileroot = os.environ['WEB_ROOT']
sheet_id = os.environ['GS_SHEET_ID']

def log(*args):
   print('[' + datetime.datetime.utcnow().replace(microsecond=0).isoformat() + ']', *args)

log("WEB_ROOT: ", fileroot)
log("GS_SHEET_ID: ", sheet_id)


def gsheet(name):
    scopes = ["https://spreadsheets.google.com/feeds"]
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        ".google-api-key.json", scopes)

    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(sheet_id)
    sheet = spreadsheet.worksheet(name)
    return sheet


cache_news = []

def fetch_news():
    log('Fetching news')
    sheet = gsheet('news')
    rows = sheet.get_all_records()
    cache_news.insert(0,{ 'time': time.time(), 'news': rows})
    del cache_news[1:]
    log('Fetching done,', len(rows), 'rows')
   

@route('/api/news', method='GET')
def news():
  data = None
  now = time.time()
  fetch = True
  if (len(cache_news) > 0):
    data = cache_news[0]    
    if (data['time'] > now - 3600):
       fetch = False

  if fetch:
    t = threading.Thread(target=fetch_news)
    t.start()
    if (data is None):
       t.join()
       return json.dumps(cache_news[0])
  return json.dumps(data)

@route('/api/save', method='POST')
def save():
    data = request.forms
    row = list(data.values())
    sheet = gsheet('contact_us_data')
    sheet.append_row(row)

    return {'status': 'ok'}


@route('/', method='GET')
def server_index():
    return static_file('index.html', root=fileroot)


@route('/<filepath:path>', method='GET')
def server_static(filepath):
    return static_file(filepath, root=fileroot)


run(host='localhost', port=8080)

import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from bottle import route, run, request, static_file

fileroot = os.environ['WEB_ROOT']
sheet_id = os.environ['GS_SHEET_ID']

print("WEB_ROOT: ", fileroot)
print("GS_SHEET_ID: ", sheet_id)


@route('/save', method='POST')
def save():
    data = request.forms
    row = list(data.values())
    scopes = ["https://spreadsheets.google.com/feeds"]
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        ".google-api-key.json", scopes)

    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(sheet_id)
    sheet = spreadsheet.worksheet('data')
    sheet.append_row(row)

    return {'status': 'ok'}


@route('/', method='GET')
def server_index():
    return static_file('index.html', root=fileroot)


@route('/<filepath:path>', method='GET')
def server_static(filepath):
    return static_file(filepath, root=fileroot)


run(host='localhost', port=8080)

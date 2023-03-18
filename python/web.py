from bottle import route, run, request, static_file
import gspread
from oauth2client.service_account import ServiceAccountCredentials

fileroot='../html/20230225'

@route('/save', method='POST')
def save():
  data = request.forms
  row = list(data.values())
  sheet_id = '1vZtlij3VXcRzB7gh4ZevSytIuUjEjJoRJWsFM0qZ71E';
  scopes = ["https://spreadsheets.google.com/feeds"]
  credentials = ServiceAccountCredentials.from_json_keyfile_name(
	    ".google-api-key.json", scopes)

  client = gspread.authorize(credentials)
  spreadsheet = client.open_by_key(sheet_id)
  sheet = spreadsheet.worksheet('data')
  sheet.append_row(row)

  return {'status':'ok'}

@route('/', method='GET')
def server_index():
    return static_file('index.html', root='../html/20230225')

@route('/<filepath:path>', method='GET')
def server_static(filepath):
    return static_file(filepath, root='../html/20230225')


run(host='localhost', port=8080)





#!/home/nikke/anaconda2/bin/python2.7

from readability.readability import Document
import json
import requests
import pdfkit
import sys

json_name = sys.argv[1]
path = '/tmp/work/'
page_arr = []

with open(json_name,'r') as jf:
    want_to_reads = json.load(jf)

for count,item in enumerate(want_to_reads):
    print 'collecting ' + str(count)
    html = requests.get(item['url']).text
    article = Document(html).summary().encode('utf-8')
    fname = path + 'tmp' + str(count) + '.html'
    
    page_arr.append(fname)
    with open(fname, 'w') as f:
        f.write(article)

options = {
    'page-size' : 'A6',
    'margin-left' : '2px',
    'margin-top' : '2px',
    'margin-right' : '2px',
    'margin-bottom' : '2px',
    'no-images' : None,
    'encoding' : 'utf-8'
}

print 'pdf write...'
# executed by wkhtmltopdf (ver0.12.0)

if ('-r' in sys.argv) or ('--reverse' in sys.argv):
    page_arr.reverse()
    
pdfkit.from_file(page_arr, sys.argv[2], options=options)

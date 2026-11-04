import datetime
import http.client
import json
import ssl
import uuid
from urllib.parse import urlsplit
from pathlib import Path

old = 'https://waddatdrinks.com/Waddat%20Beverage%20Trade%20Brochure%202.pdf'
new = 'https://waddatdrinks.com/Waddat%20Drinks%20Trade%20Brochure%202026.pdf'
unique = uuid.uuid4().hex

def get_response(url):
    parsed = urlsplit(url)
    connection = http.client.HTTPSConnection(parsed.hostname, timeout=20, context=ssl.create_default_context())
    path = parsed.path + ('?' + parsed.query if parsed.query else '')
    connection.request('GET', path, headers={'Cache-Control': 'no-cache', 'User-Agent': 'Waddat-brochure-redirect-check/1.0'})
    response = connection.getresponse()
    headers = dict((k.lower(), v) for k, v in response.getheaders())
    sample = response.read(5)
    result = {'url': url, 'status': response.status, 'location': headers.get('location'), 'content_type': headers.get('content-type'), 'content_length': headers.get('content-length'), 'pdf_signature': sample == b'%PDF-', 'cache_control': headers.get('cache-control'), 'date': headers.get('date'), 'server': headers.get('server')}
    connection.close()
    return result

tests = []
for url in [old, old + '?brochure_redirect_check=' + unique]:
    chain = [get_response(url)]
    for _ in range(3):
        location = chain[-1]['location']
        if not (chain[-1]['status'] in (301, 302, 303, 307, 308) and location):
            break
        if not location.startswith('https://waddatdrinks.com/'):
            raise RuntimeError('Unexpected redirect destination: ' + location)
        chain.append(get_response(location))
    expected = new + ('?brochure_redirect_check=' + unique if '?' in url else '')
    passed = len(chain) == 2 and chain[0]['status'] == 301 and chain[0]['location'] == expected and chain[-1]['status'] == 200 and chain[-1]['content_type'] == 'application/pdf' and chain[-1]['pdf_signature']
    tests.append({'passed': passed, 'responses': chain})

destination = get_response(new)
pages = [get_response('https://waddatdrinks.com' + path) for path in ['/product/ginger/', '/product/sorrel-drink/', '/product/Lemonade/', '/product/Pineapple-Sea-Moss/', '/product/Soursop-Sea-Moss/']]
result = {'checked_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'request_method': 'GET', 'unique_query': unique, 'live_redirect_verified': all(test['passed'] for test in tests), 'tests': tests, 'destination': destination, 'product_pages': pages}
Path('/tmp/waddat-live-brochure-check.json').write_text(json.dumps(result, indent=2))
print(json.dumps(result, indent=2))

raise SystemExit(0 if result['live_redirect_verified'] and destination['status'] == 200 and destination['content_type'] == 'application/pdf' and all(page['status'] == 200 for page in pages) else 1)

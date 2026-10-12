"""Check local targets/fragments on generated application pages, excluding captured source."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import argparse,json,re

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True); self.ids=set();self.links=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id'): self.ids.add(attrs['id'])
        if tag=='a' and attrs.get('name'):self.ids.add(attrs['name'])
        if tag=='a' and attrs.get('href'):self.links.append(attrs['href'])
        if tag in {'img','script','iframe','source'} and attrs.get('src'):self.links.append(attrs['src'])
        if tag=='link' and attrs.get('href'):self.links.append(attrs['href'])

def verify(build_log,dist):
    routes=re.findall(r'[├└]─ (/[^\n]*?\.html)',Path(build_log).read_text())
    if not routes: raise ValueError('No generated application routes in build log.')
    root=Path(dist).resolve();pages={};missing=[];fragments=[];references=0
    def page(path):
        if path not in pages:pages[path]=Page(path.read_text(errors='replace'))
        return pages[path]
    for route in routes:
        source=root/route.lstrip('/')
        if not source.is_file():missing.append({'source':route,'target':route});continue
        for raw in page(source).links:
            url=urlsplit(raw)
            if url.scheme or url.netloc:continue
            if not raw or raw.startswith('//'):continue
            references+=1
            location=unquote(url.path)
            target=(root/location.lstrip('/')) if location.startswith('/') else source.parent/location if location else source
            target=target.resolve()
            if not target.is_relative_to(root):missing.append({'source':route,'target':raw});continue
            if target.is_dir():target=target/'index.html'
            if not target.exists() and not target.suffix:target=target/'index.html'
            if not target.is_file():missing.append({'source':route,'target':raw});continue
            if url.fragment and target.suffix=='.html' and unquote(url.fragment) not in page(target).ids:
                fragments.append({'source':route,'target':raw})
    return {'pages':len(routes),'local_references':references,'missing_targets':missing,'missing_fragments':fragments,'passed':not missing and not fragments}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--build-log',required=True);parser.add_argument('--dist',default='dist');parser.add_argument('--output')
    args=parser.parse_args();result=verify(args.build_log,args.dist)
    text=json.dumps(result,indent=2)
    if args.output:Path(args.output).write_text(text+'\n')
    print(text);raise SystemExit(0 if result['passed'] else 1)

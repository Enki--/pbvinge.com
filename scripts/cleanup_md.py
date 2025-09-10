import re
from pathlib import Path

p = Path('src/content/documents/1943-us-strategic-bombing-survey.md')
text = p.read_text(encoding='utf-8')
lines = text.splitlines(True)
out = []
i = 0
in_toc = False

while i < len(lines):
    line = lines[i]

    # Normalize ad-hoc separator '- - -' to horizontal rule
    if re.match(r'^\s*- - -\s*$', line):
        out.append('---\n')
        i += 1
        continue

    # Replace the table-based TOC with a clean bullet list
    if not in_toc and re.match(r'^###\s+Table of Contents\s*$', line):
        out.append('## Table of Contents\n\n')
        out.extend([
            '- Preface\n',
            '- Chapter I: Summary and Conclusions\n',
            '- Chapter II: German Aircraft Industry\n',
            '- Chapter III: Government Controls and Programs\n',
            '- Chapter IV: Target Selection for Strategic Bombing\n',
            '- Chapter V: Attacks on the Aircraft Industry\n',
            '- Chapter VI: Effects of Bombing on Aircraft Production\n',
            '- Chapter VII: Aero-Engine Production\n',
            '- Chapter VIII: Materials and Aircraft Components\n',
            '- Chapter IX: Report on V-Weapon Production\n',
            '- Exhibits\n',
        ])
        in_toc = True
        i += 1
        continue

    if in_toc:
        if re.match(r'^###\s+Preface\s*$', line):
            out.append('\n### Preface\n')
            in_toc = False
            i += 1
            continue
        else:
            # Skip original TOC block content
            i += 1
            continue

    # Combine split chapter headings:
    # From:
    #   ### Chapter II  \n
    #   German Aircraft Industry
    # To:
    #   ## Chapter II: German Aircraft Industry
    # Accept variants like '### Chapter V' or '### **Chapter V'
    m = re.match(r'^\s*###\s+(?:\*\*)?Chapter\s+([IVXLCDM]+)\s*$', line)
    if m:
        roman = m.group(1)
        # find next non-empty line as title
        j = i + 1
        while j < len(lines) and lines[j].strip() == '':
            j += 1
        title = lines[j].strip() if j < len(lines) else ''
        # Remove stray Markdown emphasis markers and excess spaces
        title = title.strip('*').strip()
        title = re.sub(r'\s+', ' ', title)
        out.append(f'## Chapter {roman}: {title}\n\n')
        i = j + 1
        continue

    # Fix escaped ordered-list numbers at line start: "1\. " -> "1. "
    if re.match(r'^\s*\d+\\\.', line):
        line = re.sub(r'\\\.', '.', line, count=1)
        out.append(line)
        i += 1
        continue

    # Strip stray trailing emphasis markers from chapter headings, e.g.,
    # '## Chapter III: Title**' -> '## Chapter III: Title'
    if re.match(r'^\s*##\s+Chapter\s+[IVXLCDM]+: .*\*\*\s*$', line):
        out.append(re.sub(r'\*\*\s*$', '', line))
        i += 1
        continue

    out.append(line)
    i += 1

new = ''.join(out)
if new != text:
    p.write_text(new, encoding='utf-8')
    print('CLEANED')
else:
    print('NO_CHANGES')

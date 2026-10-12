interface DisplayCard {
  title: string;
  author: string;
  credit?: string;
  img: string;
  sourceHref: string;
  ideas: Array<{ text: string; section: string }>;
}

export function flashcardFeedback(card: DisplayCard, index: number, total: number): string {
  const ideas = card.ideas.map(idea => `- ${idea.text.replace(/\s+/g, ' ').trim()}\n  From: ${idea.section}`).join('\n');
  const credit = card.credit ?? (card.author ? `by ${card.author}` : '');
  return `Flashcard front:\n${card.title}${credit ? `\n${credit}` : ''}\n\nCurrent ideas:\n${ideas}\n\nSource note: ${card.sourceHref}\nCard index: ${index + 1} of ${total}`;
}

export function initFlashcards(): void {
  const dataEl = document.getElementById('flashcards-data');
  const front = document.getElementById('cardFront');
  const back = document.getElementById('cardBack');
  const title = document.getElementById('cardTitle');
  const author = document.getElementById('cardAuthor');
  const ideas = document.getElementById('cardIdeas');
  const progress = document.getElementById('progress');
  const eyebrow = document.getElementById('eyebrow');
  const toggle = document.getElementById('toggleBtn') as HTMLButtonElement | null;
  const previous = document.getElementById('prevBtn') as HTMLButtonElement | null;
  const next = document.getElementById('nextBtn') as HTMLButtonElement | null;
  const source = document.getElementById('sourceLink') as HTMLAnchorElement | null;
  const issue = document.getElementById('issueLink') as HTMLAnchorElement | null;
  if (!dataEl || !front || !back || !title || !author || !ideas || !toggle || !previous || !next || !source || !issue) return;
  let cards: DisplayCard[];
  try { cards = JSON.parse(dataEl.textContent || '[]'); } catch { return; }
  let index = 0;
  let revealed = false;

  function reveal(): void {
    front!.hidden = revealed;
    front!.inert = revealed;
    back!.hidden = !revealed;
    back!.inert = !revealed;
    toggle!.setAttribute('aria-expanded', String(revealed));
    toggle!.textContent = revealed ? 'Hide ideas' : 'Show ideas';
    if (eyebrow) eyebrow.textContent = revealed ? 'Ideas' : 'Recall';
  }

  function render(): void {
    [toggle, previous, next].forEach(button => { button!.disabled = !cards.length; });
    if (!cards.length) {
      title!.textContent = 'No published notes available';
      author!.textContent = '';
      ideas!.replaceChildren();
      if (progress) progress.textContent = '0 / 0';
      issue!.hidden = true;
      source!.href = '/books';
      revealed = false;
      reveal();
      return;
    }
    const card = cards[index];
    title!.textContent = card.title;
    author!.textContent = card.credit ?? (card.author ? `by ${card.author}` : '');
    let image = front!.querySelector('img');
    if (!image) { image = document.createElement('img'); image.id = 'cardImage'; image.loading = 'lazy'; front!.prepend(image); }
    if (card.img) { image.src = card.img; image.alt = `Cover of ${card.title}`; image.hidden = false; }
    else { image.hidden = true; image.removeAttribute('src'); image.alt = ''; }
    ideas!.replaceChildren(...card.ideas.map(idea => {
      const item = document.createElement('li');
      const text = document.createElement('p');
      text.textContent = idea.text;
      const section = document.createElement('small');
      section.textContent = `From: ${idea.section || 'Study notes'}`;
      item.append(text, section);
      return item;
    }));
    source!.href = card.sourceHref;
    const params = new URLSearchParams({
      title: `Flashcard feedback: ${card.title}`.slice(0, 256),
      body: flashcardFeedback(card, index, cards.length),
    });
    issue!.href = `https://github.com/Enki--/pbvinge.com/issues/new?${params.toString()}`;
    issue!.hidden = false;
    if (progress) progress.textContent = `${index + 1} / ${cards.length}`;
    reveal();
  }
  function move(delta: number): void {
    if (!cards.length) return;
    index = (index + delta + cards.length) % cards.length;
    revealed = false;
    render();
  }
  toggle.addEventListener('click', () => { revealed = !revealed; reveal(); });
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  [toggle, previous, next].forEach(button => button.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }));
  render();
}

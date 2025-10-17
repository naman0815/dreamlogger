
export const parseDreamHtml = (htmlContent: string, defaultDate: string): { title: string, date: string, description: string } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const body = doc.body;

  // 1. Find and extract title from <h1>, then remove the h1 element
  let title = 'Untitled Dream';
  const h1 = body.querySelector('h1');
  if (h1 && h1.textContent) {
    title = h1.textContent.trim();
    h1.remove(); 
  }

  // 2. Find and extract date, then remove its element
  let date = defaultDate;
  // Regex to find a date, possibly with a "Date:" prefix.
  const dateRegex = /(?:Date:)?\s*(\d{4}-\d{2}-\d{2})/;
  
  // Search in common metadata tags first, then paragraphs/divs.
  const possibleDateElements = body.querySelectorAll('h2, h3, h4, h5, h6, p, div');
  
  for (const el of possibleDateElements) {
    if (el.textContent) {
      const text = el.textContent.trim();
      const match = text.match(dateRegex);

      // Heuristic: We're looking for an element that primarily contains the date.
      // A short text content length is a good indicator.
      if (match && match[1] && text.length < 30) {
        date = match[1];
        el.remove(); // Remove the element from the DOM.
        break; // Found the date, stop searching to avoid removing other elements.
      }
    }
  }

  // 3. The rest of the body's innerText is the description.
  // innerText reflects the DOM *after* we've removed the title and date elements.
  const description = body.innerText.trim();

  return { title, date, description };
};

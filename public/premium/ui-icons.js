// A small original line-icon family. Words remain alongside every instructional icon.
const paths = {
  wheat: '<path d="M16 29V5M16 13C7 11 7 5 8 4c7 1 8 6 8 9ZM16 20c-8-1-9-6-8-8 6 1 8 5 8 8ZM16 13c9-2 9-8 8-9-7 1-8 6-8 9ZM16 20c8-1 9-6 8-8-6 1-8 5-8 8Z"/>',
  water: '<path d="M16 3C13 8 6 15 6 21a10 10 0 0 0 20 0C26 15 19 8 16 3Z"/><path d="M11 21a5 5 0 0 0 5 5"/>',
  amphora: '<path d="M12 3h8M13 3v7c-5 4-6 9-4 14 2 5 12 5 14 0 2-5 1-10-4-14V3M9 13C1 8 2 23 9 22M23 13c8-5 7 10 0 9M12 18h8M12 29h8"/>',
  anchor: '<path d="M16 9v20M10 14h12M4 21c2 6 6 8 12 8s10-2 12-8M4 21v5M28 21v5"/><circle cx="16" cy="6" r="3"/>',
  compass: '<circle cx="16" cy="16" r="12"/><path d="m20.5 11.5-3 6-6 3 3-6z"/>',
  gods: '<path d="M16 3c-5 4-7 8-7 12a7 7 0 0 0 14 0c0-4-2-8-7-12Z"/><path d="M16 10v12M11 25h10M8 29h16"/>',
  book: '<path d="M16 8c-4-3-8-3-12-2v20c4-1 8-1 12 2 4-3 8-3 12-2V6c-4-1-8-1-12 2Z"/><path d="M16 8v20"/>',
  map: '<path d="m3 8 8-3 10 3 8-3v19l-8 3-10-3-8 3zM11 5v19M21 8v19"/>',
  settings: '<path d="M5 8h22M5 16h22M5 24h22"/><circle cx="11" cy="8" r="3" fill="var(--deep,#0b252b)"/><circle cx="21" cy="16" r="3" fill="var(--deep,#0b252b)"/><circle cx="13" cy="24" r="3" fill="var(--deep,#0b252b)"/>',
  eye: '<path d="M3 16q13-15 26 0-13 15-26 0Z"/><circle cx="16" cy="16" r="4"/>',
  question: '<circle cx="16" cy="16" r="12"/><path d="M12.5 12a4 4 0 1 1 7 3c-2 2-3.5 2.5-3.5 5"/><path d="M16 24h.01"/>',
  check: '<circle cx="16" cy="16" r="12"/><path d="m10 16 4 4 8-9"/>',
  temple: '<path d="m3 10 13-6 13 6H3ZM5 27h22M7 24h18M9 12v12M15 12v12M23 12v12"/>',
  flame: '<path d="M16 3c0 7-7 9-7 17a7 7 0 0 0 14 0c0-5-3-8-7-17ZM16 18c-2 3-2 4-2 6a3 3 0 0 0 6 0c0-2-2-4-4-6Z"/>',
  olive: '<path d="M16 29V7M16 13C9 7 5 9 6 14c2 5 7 5 10-1ZM16 20c7-7 12-5 11 0-1 5-7 6-11 0ZM16 25c-5-5-9-4-9 0 1 4 6 5 9 0Z"/>',
  sail: '<path d="M17 4v22M17 5 6 24h11M20 8l7 15h-7M4 27q12 4 24 0"/>',
  gallery: '<path d="M16 5a7 7 0 0 0-7 7v6l-3 8h20l-3-8v-6a7 7 0 0 0-7-7ZM10 27h12M13 12h.01M19 12h.01"/>',
  clue: '<circle cx="14" cy="14" r="9"/><path d="m21 21 7 7M10 14h8M14 10v8"/>',
  city: '<path d="M3 27h26M6 27V14h8v13M17 27V9h9v18M9 18h2M20 13h3M20 18h3M20 23h3"/>',
  note: '<path d="M7 4h13l5 5v19H7zM20 4v6h5M11 15h10M11 20h10M11 25h7"/>'
};
export function uiIcon(name) {
  const shape = paths[name] || paths.compass;
  return `<svg class="ui-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shape}</svg>`;
}
export function decorateUiIcons(root = document) {
  root.querySelectorAll('[data-ui-icon]').forEach(element => {
    if (element.querySelector(':scope > .ui-icon')) return;
    element.insertAdjacentHTML('afterbegin', uiIcon(element.dataset.uiIcon));
  });
}

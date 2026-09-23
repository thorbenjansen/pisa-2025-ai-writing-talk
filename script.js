const slides = Array.from(document.querySelectorAll('.slide'));
const progressBar = document.getElementById('progressBar');
const slideBadge = document.getElementById('slideBadge');
let currentIndex = 0;

function showSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));
  history.replaceState(null, '', `#${slides[currentIndex].id}`);
  slides[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateControls();
}

function updateControls() {
  slideBadge.textContent = `Folie ${currentIndex + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
  document.getElementById('previousSlide').disabled = currentIndex === 0;
  document.getElementById('nextSlide').disabled = currentIndex === slides.length - 1;
}

document.getElementById('previousSlide').addEventListener('click', () => showSlide(currentIndex - 1));
document.getElementById('nextSlide').addEventListener('click', () => showSlide(currentIndex + 1));
const fullscreenButton = document.getElementById('fullscreen');
fullscreenButton.addEventListener('click', async () => {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else if (document.body.classList.contains('focus-mode')) {
    document.body.classList.remove('focus-mode');
    fullscreenButton.setAttribute('aria-label', 'Vollbild');
    fullscreenButton.title = '';
  } else {
    try {
      await document.documentElement.requestFullscreen();
      fullscreenButton.setAttribute('aria-label', 'Vollbild beenden');
    } catch {
      document.body.classList.add('focus-mode');
      fullscreenButton.setAttribute('aria-label', 'Fokusmodus beenden');
      fullscreenButton.title = 'Browser-Vollbild nicht verfügbar. Fokusmodus mit Escape beenden.';
      fullscreenButton.blur();
    }
  }
});
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) fullscreenButton.setAttribute('aria-label', 'Vollbild');
});

const offloadingOperations = {
  A: { file: 'A_microbursts', label: 'Mikro-Schreibaktionen' },
  B: { file: 'B_wordblocks_10words', label: 'Schreibblöcke von 10 Wörtern' },
  C: { file: 'C_writing_episodes_5s', label: 'Schreibepisoden von 5 Sekunden' },
  D: { file: 'D_sentence_units', label: 'satzbezogene Schreibaktionen' },
  E: { file: 'E_human_workflow', label: 'menscheninitiierte Workflow-Handlungen' }
};
const offloadingViews = {
  distribution: { file: '01_distribution', label: 'Verteilung', note: 'Ungestapelte Verteilung des Offloading-Scores.' },
  quality_change: { file: '02_quality_change', label: 'Textqualitätsänderung', note: 'Gestapelt nach taskadjustierter Textqualitätsänderung: KI minus Ohne-KI.' },
  prompt_purpose: { file: '03_prompt_purpose', label: 'dominanter Chat-Promptzweck', note: 'Gestapelt nach dem dominanten Zweck der KI-Anfragen pro Person; explorative, regelbasierte Zuordnung.' }
};
const offloadingOperation = document.getElementById('offloading-operation');
const offloadingView = document.getElementById('offloading-view');
function updateOffloadingFigure() {
  const operation = offloadingOperations[offloadingOperation.value];
  const view = offloadingViews[offloadingView.value];
  if (!operation || !view) return;
  const src = `assets/${operation.file}_${view.file}.png`;
  const link = document.getElementById('offloading-image-link');
  const image = document.getElementById('offloading-image');
  link.href = src;
  link.setAttribute('aria-label', `${view.label} für ${operation.label} in Originalgröße öffnen`);
  image.src = src;
  image.alt = `${view.label} des symmetrischen Offloading-Scores für ${operation.label}`;
  document.getElementById('offloading-caption').textContent = `1.069 Schüler:innen · Score −1 = Ausweitung eigener Arbeit, +1 = Offloading. ${view.note}`;
}
offloadingOperation.addEventListener('change', updateOffloadingFigure);
offloadingView.addEventListener('change', updateOffloadingFigure);
const galleryResults = {
  scoring: {
    title: 'Bewertung während des Schreibens',
    description: 'Die Modellgüte steigt mit der verfügbaren Schreibzeit. Das Fusionsmodell liegt besonders in frühen Zeitfenstern vorn.',
    images: [{ src: 'assets/automated_scoring_performance_over_time.png', alt: 'QWK-Modellgüte über Schreibzeit-Schwellen für Textmodell, Hybridmodell und Fusionsmodell' }]
  },
  keystrokes: {
    title: 'Schreibaktivität und Textqualität',
    description: 'Die beiden Diagramme zeigen beobachtete Zusammenhänge zwischen getippten Zeichen und Textqualität.',
    images: [
      { src: 'assets/keystrokes_quality_without_ai.png', alt: 'Textqualität nach getippten Zeichen ohne KI-Unterstützung', caption: 'Ohne KI-Unterstützung' },
      { src: 'assets/keystrokes_quality_with_ai.png', alt: 'Textqualität nach getippten Zeichen mit KI-Unterstützung', caption: 'Mit KI-Unterstützung' }
    ]
  },
  paste: {
    title: 'Paste Events und Textqualität',
    description: 'Die Zahl eingefügter KI-Textpassagen hängt mit der Qualität des fertigen Textes zusammen (ρ = .469, p < .001).',
    images: [{ src: 'assets/paste_events_quality_with_ai.png', alt: 'Textqualität nach Anzahl eingefügter KI-generierter Textpassagen' }]
  },
  arguments: {
    title: 'Argumenttypen mit und ohne KI-Unterstützung',
    description: 'Anteile der Texte, in denen ein Argumenttyp erkannt wurde.',
    images: [{ src: 'assets/argument_type_frequency_by_ai_condition.svg', alt: 'Anteile erkannter Argumenttypen in Texten mit und ohne KI-Unterstützung' }]
  }
};

const galleryDialog = document.getElementById('gallery-dialog');
document.querySelectorAll('[data-gallery]').forEach((button) => {
  button.addEventListener('click', () => {
    const result = galleryResults[button.dataset.gallery];
    if (!result) return;
    document.getElementById('gallery-title').textContent = result.title;
    document.getElementById('gallery-description').textContent = result.description;
    const images = document.getElementById('gallery-images');
    images.replaceChildren();
    result.images.forEach((image) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt;
      figure.appendChild(img);
      if (image.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = image.caption;
        figure.appendChild(caption);
      }
      images.appendChild(figure);
    });
    galleryDialog.showModal();
  });
});

document.querySelectorAll('[data-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.open);
    dialog?.showModal();
  });
});
document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});

function showSlideFromHash() {
  const hashId = decodeURIComponent(window.location.hash.slice(1));
  if (['bewertung-waehrend-des-schreibens', 'schreibaktivitaet', 'paste-events', 'argumente'].includes(hashId)) {
    showSlide(slides.findIndex((slide) => slide.id === 'textqualitaet'));
    return;
  }
  const target = document.getElementById(hashId);
  const index = slides.indexOf(target);
  if (index >= 0) showSlide(index);
}
window.addEventListener('hashchange', showSlideFromHash);
if (window.location.hash) requestAnimationFrame(showSlideFromHash);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('focus-mode')) {
    document.body.classList.remove('focus-mode');
    fullscreenButton.setAttribute('aria-label', 'Vollbild');
    fullscreenButton.title = '';
    return;
  }
  if (document.querySelector('dialog[open]')) return;
  if (event.target?.closest?.('select, input, textarea, [contenteditable="true"]')) return;
  // Keep Space available for focused controls, but allow arrow navigation after clicking them.
  if (event.key === ' ' && event.target?.closest?.('button, a')) return;
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    showSlide(currentIndex + 1);
  } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    showSlide(currentIndex - 1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    showSlide(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    showSlide(slides.length - 1);
  }
});

let scrollCheckPending = false;
window.addEventListener('scroll', () => {
  if (scrollCheckPending) return;
  scrollCheckPending = true;
  requestAnimationFrame(() => {
    scrollCheckPending = false;
    const midpoint = window.innerHeight / 2;
    const visibleIndex = slides.findIndex((slide) => {
      const rect = slide.getBoundingClientRect();
      return rect.top <= midpoint && rect.bottom > midpoint;
    });
    if (visibleIndex >= 0 && visibleIndex !== currentIndex) {
      currentIndex = visibleIndex;
      history.replaceState(null, '', `#${slides[currentIndex].id}`);
      updateControls();
    }
  });
}, { passive: true });
updateControls();

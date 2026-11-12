// Navigation stays synchronous on browsers without snapshot transitions.
export function createMenuMotion(document, reduced) {
  const root = document.documentElement;
  let revision = 0;
  let snapshot;
  const animations = new Map();

  function animate(element, frames, options) {
    if (!element?.animate || reduced()) return;
    animations.get(element)?.cancel();
    const animation = element.animate(frames, options);
    animations.set(element, animation);
    const clear = () => {
      if (animations.get(element) === animation) animations.delete(element);
    };
    animation.finished.then(clear, clear);
  }

  function stop() {
    snapshot?.skipTransition();
    for (const animation of animations.values()) animation.cancel();
    animations.clear();
  }

  function transition(kind, update, incoming) {
    const current = ++revision;
    stop();
    if (reduced() || document.hidden || !document.startViewTransition) {
      delete root.dataset.menuMotion;
      update();
      if (!document.hidden) animate(document.querySelector(incoming), [
        {opacity: .7, transform: 'translateY(8px)'},
        {opacity: 1, transform: 'translateY(0)'},
      ], {duration: 240, easing: 'cubic-bezier(.22, 1, .36, 1)'});
      return;
    }
    root.dataset.menuMotion = kind;
    snapshot = document.startViewTransition(() => {
      if (current === revision) update();
    });
    snapshot.ready.catch(() => {});
    const clean = () => {
      if (current === revision) delete root.dataset.menuMotion;
    };
    snapshot.finished.then(clean, clean);
  }

  function response(element, correct) {
    const from = correct ? 'translateY(6px)' : 'translateY(2px)';
    animate(element, [{opacity: .55, transform: from}, {opacity: 1, transform: 'none'}], {
      duration: correct ? 320 : 190,
      easing: 'cubic-bezier(.22, 1, .36, 1)',
    });
  }

  function sequence(elements) {
    elements.forEach(({element, delay = 0, duration = 250, distance = 9}) => {
      animate(element, [
        {opacity: .4, transform: `translateY(${distance}px)`},
        {opacity: 1, transform: 'none'},
      ], {delay, duration, fill: 'backwards', easing: 'cubic-bezier(.2,.82,.28,1)'});
    });
  }

  return {transition, response, sequence, stop};
}

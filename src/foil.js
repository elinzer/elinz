(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = window.matchMedia('(pointer: coarse)');
  if (reduce.matches || coarse.matches) return;

  var pending = null;
  var frame = null;
  var active = null;

  function paint() {
    frame = null;
    if (!pending) return;
    pending.card.style.setProperty('--px', pending.x.toFixed(3));
    pending.card.style.setProperty('--py', pending.y.toFixed(3));
  }

  function clear(card) {
    card.style.removeProperty('--px');
    card.style.removeProperty('--py');
    card.classList.remove('is-foil');
  }

  document.addEventListener('pointermove', function (event) {
    var card = event.target.closest ? event.target.closest('.card') : null;

    if (card !== active) {
      if (active) clear(active);
      active = card;
      if (card) card.classList.add('is-foil');
    }

    if (!card) {
      pending = null;
      return;
    }

    var box = card.getBoundingClientRect();
    pending = {
      card: card,
      x: (event.clientX - box.left) / box.width,
      y: (event.clientY - box.top) / box.height
    };

    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });

  document.addEventListener('pointerleave', function () {
    if (active) clear(active);
    active = null;
    pending = null;
  });
}());

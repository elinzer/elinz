(function (global) {
  var WUBRG = 'WUBRGC';
  var MOTIFS = ['rings', 'shards', 'grid', 'arcs'];
  var COLOR_NAMES = {
    W: 'white', U: 'blue', B: 'black',
    R: 'red', G: 'green', C: 'colorless'
  };

  function identityOf(card) {
    var source = (card.identity && card.identity.length) ? card.identity : card.cost;
    var seen = {};
    var out = [];
    (source || []).forEach(function (c) {
      var up = String(c).toUpperCase();
      if (WUBRG.indexOf(up) !== -1 && !seen[up]) {
        seen[up] = true;
        out.push(up);
      }
    });
    out.sort(function (a, b) { return WUBRG.indexOf(a) - WUBRG.indexOf(b); });
    return out.length ? out : ['C'];
  }

  function identityClass(identity) {
    if (identity.length > 2) return 'ci-gold';
    return 'ci-' + identity.join('').toLowerCase();
  }

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function motifOf(id) {
    return MOTIFS[hash(id) % MOTIFS.length];
  }

  function primaryLink(card) {
    var links = card.links || [];
    for (var i = 0; i < links.length; i++) {
      if (links[i].primary) return links[i];
    }
    return null;
  }

  function externalAnchor(link) {
    var a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.rel = 'noopener noreferrer';
    a.target = '_blank';
    return a;
  }

  function buildPips(card, listEl) {
    (card.cost || []).forEach(function (raw) {
      var letter = String(raw).toUpperCase();
      if (!COLOR_NAMES[letter]) return;
      var li = document.createElement('li');
      li.className = 'pip pip--' + letter.toLowerCase();
      var label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = COLOR_NAMES[letter];
      li.appendChild(label);
      listEl.appendChild(li);
    });
  }

  function buildCard(card) {
    var tpl = document.getElementById('card-template');
    var root = tpl.content.firstElementChild.cloneNode(true);
    var identity = identityOf(card);

    root.classList.add(identityClass(identity));
    root.classList.add('rarity-' + card.rarity);
    root.classList.add('motif-' + motifOf(card.id));
    root.dataset.cardId = card.id;
    root.style.setProperty('--motif-angle', (hash(card.id) % 360) + 'deg');

    var nameEl = root.querySelector('.card__name');
    var linkEl = root.querySelector('.card__link');
    var primary = primaryLink(card);
    if (primary) {
      linkEl.href = primary.href;
      linkEl.textContent = card.name;
      linkEl.rel = 'noopener noreferrer';
      linkEl.target = '_blank';
      root.classList.add('card--clickable');
    } else {
      nameEl.textContent = card.name;
    }

    root.querySelector('.card__type').textContent = card.type;
    buildPips(card, root.querySelector('.card__pips'));

    var rulesEl = root.querySelector('.card__rules');
    (card.rules || []).forEach(function (line) {
      var p = document.createElement('p');
      p.textContent = line;
      rulesEl.appendChild(p);
    });

    var flavorEl = root.querySelector('.card__flavor');
    if (card.flavor) {
      flavorEl.textContent = card.flavor;
    } else {
      flavorEl.remove();
    }

    var ptEl = root.querySelector('.card__pt');
    if (card.pt) {
      ptEl.textContent = card.pt;
    } else {
      ptEl.remove();
    }

    var linksEl = root.querySelector('.card__links');
    (card.links || []).forEach(function (link) {
      if (link.primary) return;
      var li = document.createElement('li');
      li.appendChild(externalAnchor(link));
      linksEl.appendChild(li);
    });

    return root;
  }

  function render() {
    var data = global.PORTFOLIO;
    if (!data || !data.cards) return;

    data.cards.forEach(function (card) {
      var grid = document.querySelector('[data-section="' + card.section + '"]');
      if (grid) grid.appendChild(buildCard(card));
    });
  }

  global.CardRender = {
    identityOf: identityOf,
    identityClass: identityClass,
    hash: hash,
    motifOf: motifOf,
    buildCard: buildCard
  };

  render();
})(window);

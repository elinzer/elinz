(function (global) {
  var WUBRG = 'WUBRGC';
  var MOTIFS = ['rings', 'mosaic', 'plasma', 'dither', 'truchet'];
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

  function buildCard(card, variant) {
    var tpl = document.getElementById('card-template');
    var root = tpl.content.firstElementChild.cloneNode(true);
    var identity = identityOf(card);

    root.classList.add(identityClass(identity));
    root.classList.add('rarity-' + card.rarity);
    root.classList.add('motif-' + MOTIFS[(variant || 0) % MOTIFS.length]);
    root.dataset.cardId = card.id;
    root.style.setProperty('--art-seed', ((hash(card.id) >>> 8) % 100) / 100);

    var nameEl = root.querySelector('.card__name');
    var linkEl = root.querySelector('.card__link');
    var primary = primaryLink(card);
    if (primary) {
      var isMailto = /^mailto:/i.test(primary.href);
      linkEl.href = primary.href;
      linkEl.textContent = card.name;
      if (!isMailto) {
        linkEl.rel = 'noopener noreferrer';
        linkEl.target = '_blank';
      }
      root.classList.add('card--clickable');
    } else {
      nameEl.textContent = card.name;
    }

    root.querySelector('.card__type').textContent = card.type;
    buildPips(card, root.querySelector('.card__pips'));

    var rulesEl = root.querySelector('.card__rules');
    var isSaga = /^Saga\b/.test(card.type || '');
    var isLand = /\bLand\b/.test(card.type || '');
    if (isSaga) root.classList.add('card--saga');
    if (isLand) root.classList.add('card--land');

    if (isSaga) {
      var chapters = document.createElement('ol');
      chapters.className = 'card__chapters';
      (card.rules || []).forEach(function (line) {
        var li = document.createElement('li');
        li.textContent = line;
        chapters.appendChild(li);
      });
      rulesEl.appendChild(chapters);
    } else {
      (card.rules || []).forEach(function (line) {
        var p = document.createElement('p');
        p.textContent = line;
        rulesEl.appendChild(p);
      });
    }

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

  function renderHero(hero, variant) {
    if (!hero) return;

    var slot = document.querySelector('[data-hero]');
    var card = buildCard(hero, variant);
    var heading = card.querySelector('.card__name');
    if (heading) {
      var name = document.createElement('p');
      name.className = 'card__name';
      name.textContent = heading.textContent;
      heading.parentNode.replaceChild(name, heading);
    }
    if (slot) slot.appendChild(card);

    var pitch = document.querySelector('.hero__pitch');
    if (pitch && hero.pitch) pitch.textContent = hero.pitch;

    var actions = document.querySelector('.hero__actions');
    if (!actions) return;

    if (hero.resume) {
      var resume = document.createElement('a');
      resume.className = 'button';
      resume.href = hero.resume;
      resume.textContent = 'Resume';
      actions.appendChild(resume);
    }

    if (hero.email) {
      var mail = document.createElement('a');
      mail.className = 'button';
      mail.href = 'mailto:' + hero.email;
      mail.textContent = 'Email';
      actions.appendChild(mail);
    }
  }

  function render() {
    var data = global.PORTFOLIO;
    if (!data) return;

    renderHero(data.hero, 0);

    (data.cards || []).forEach(function (card, i) {
      var grid = document.querySelector('[data-section="' + card.section + '"]');
      if (grid) grid.appendChild(buildCard(card, i + 1));
    });
  }

  global.CardRender = {
    identityOf: identityOf,
    identityClass: identityClass,
    hash: hash,
    buildCard: buildCard
  };

  render();
})(window);

window.PORTFOLIO = {
  hero: null,
  cards: [
    {
      id: 'ledger-service',
      name: 'Ledger Service',
      cost: ['U'],
      type: 'Artifact — Service',
      rarity: 'rare',
      rules: [
        'Go, Postgres, and a write-ahead queue.',
        'Reconciles 40k transactions a day with no manual intervention.'
      ],
      flavor: 'Every entry balances, or nothing does.',
      pt: '4/4',
      links: [
        { label: 'Repo', href: 'https://github.com/elinzer', primary: true },
        { label: 'Write-up', href: 'https://github.com/elinzer' }
      ],
      section: 'projects'
    },
    {
      id: 'bare-minimum',
      name: 'Bare Minimum',
      cost: [],
      type: 'Sorcery',
      rarity: 'common',
      rules: ['A card with no flavor text, no power, and one link.'],
      links: [
        { label: 'Repo', href: 'https://github.com/elinzer', primary: true }
      ],
      section: 'projects'
    },
    {
      id: 'coverage-two-color',
      name: 'Split Identity',
      cost: ['G', 'U'],
      type: 'Artifact — Pipeline',
      rarity: 'uncommon',
      rules: ['Exercises the two-color gradient.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-three-color',
      name: 'Gold Fallback',
      cost: ['W', 'U', 'B'],
      type: 'Enchantment',
      rarity: 'rare',
      rules: ['Three or more colors collapse to the gold treatment.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-colorless',
      name: 'Colorless Engine',
      cost: ['C'],
      type: 'Artifact',
      rarity: 'common',
      rules: ['Exercises the colorless palette.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-land-identity',
      name: 'Identity Without Cost',
      cost: [],
      identity: ['R'],
      type: 'Land',
      rarity: 'common',
      rules: ['No mana cost, but colored by identity.'],
      links: [{ label: 'Repo', href: 'https://github.com/elinzer', primary: true }],
      section: 'projects'
    },
    {
      id: 'coverage-saga',
      name: 'Coverage Corp',
      cost: ['W', 'U'],
      type: 'Saga — Coverage Corp',
      rarity: 'rare',
      rules: [
        'Joined as the third backend engineer.',
        'Led the migration off the monolith.',
        'Now owns the platform team roadmap.'
      ],
      flavor: 'Senior Engineer \u00b7 2022\u2013present',
      links: [{ label: 'Company', href: 'https://example.com', primary: true }],
      section: 'experience'
    },
    {
      id: 'coverage-linkedin',
      name: 'LinkedIn',
      cost: [],
      identity: ['U'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: add one professional connection.'],
      links: [{ label: 'Open', href: 'https://linkedin.com', primary: true }],
      section: 'contact'
    }
  ]
};

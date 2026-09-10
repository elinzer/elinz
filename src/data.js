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
    }
  ]
};

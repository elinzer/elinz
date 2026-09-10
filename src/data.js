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
    }
  ]
};

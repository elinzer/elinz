window.PORTFOLIO = {
  hero: {
    id: 'commander',
    name: 'El Linzer',
    cost: ['U', 'G'],
    type: 'Legendary Creature — Human Engineer',
    rarity: 'mythic',
    rules: [
      'Whenever a service enters the battlefield, draw a runbook.',
      'Backend systems, developer tooling, and the boring reliability work.'
    ],
    flavor: 'Ship it, then measure it.',
    pt: '4/5',
    links: [],
    section: 'hero',
    pitch: 'Software engineer building backend systems and the tooling that keeps them honest.',
    email: 'el.linzer@spothero.com'
  },
  cards: [
    {
      id: 'ledger-service',
      name: 'Ledger Service',
      cost: ['U'],
      type: 'Artifact — Service',
      rarity: 'mythic',
      rules: [
        'Go, Postgres, and a write-ahead queue.',
        'Reconciles 40k transactions a day with no manual intervention.'
      ],
      flavor: 'Every entry balances, or nothing does.',
      pt: '2k rps',
      links: [
        { label: 'Repo', href: '#', primary: true },
        { label: 'Write-up', href: '#' }
      ],
      section: 'projects'
    },
    {
      id: 'drift-detector',
      name: 'Drift Detector',
      cost: ['U', 'G'],
      type: 'Enchantment — Tooling',
      rarity: 'rare',
      rules: [
        'Diffs live infrastructure against Terraform state nightly.',
        'Opens a pull request describing what changed and who changed it.'
      ],
      flavor: 'Nothing drifts quietly for long.',
      pt: '18 repos',
      links: [{ label: 'Repo', href: '#', primary: true }],
      section: 'projects'
    },
    {
      id: 'cold-path',
      name: 'Cold Path',
      cost: ['B'],
      type: 'Sorcery — Migration',
      rarity: 'rare',
      rules: [
        'Moved eleven years of event history off a rented Oracle box.',
        'Cut the annual bill by 68% and the p99 read by half.'
      ],
      flavor: 'Exile target legacy system.',
      pt: '-$310k/yr',
      links: [{ label: 'Write-up', href: '#', primary: true }],
      section: 'projects'
    },
    {
      id: 'flightcheck',
      name: 'Flightcheck',
      cost: ['W'],
      type: 'Instant — Test Harness',
      rarity: 'uncommon',
      rules: [
        'Runs contract tests against every service before a deploy proceeds.',
        'Fails the pipeline in under ninety seconds.'
      ],
      flavor: 'Counter target regression.',
      pt: '90s',
      links: [
        { label: 'Repo', href: '#', primary: true },
        { label: 'Docs', href: '#' }
      ],
      section: 'projects'
    },
    {
      id: 'hot-lane',
      name: 'Hot Lane',
      cost: ['R'],
      type: 'Artifact — Cache',
      rarity: 'uncommon',
      rules: [
        'A read-through cache layer with per-tenant eviction budgets.',
        'Took the checkout path from 240ms to 38ms at p95.'
      ],
      flavor: 'Haste.',
      pt: '38ms',
      links: [{ label: 'Repo', href: '#', primary: true }],
      section: 'projects'
    },
    {
      id: 'paper-trail',
      name: 'Paper Trail',
      cost: ['C'],
      type: 'Artifact',
      rarity: 'common',
      rules: ['A small CLI that turns git history into a release changelog.'],
      links: [{ label: 'Repo', href: '#', primary: true }],
      section: 'projects'
    },

    {
      id: 'saga-current',
      name: 'Coverage Corp',
      cost: ['U', 'G'],
      type: 'Saga — Coverage Corp',
      rarity: 'mythic',
      rules: [
        'Joined as the third backend engineer on a team of nine.',
        'Led the migration off the monolith across four quarters.',
        'Built the deploy tooling the whole org now uses.',
        'Now owns the platform roadmap and mentors two engineers.'
      ],
      flavor: 'Senior Software Engineer · 2022–present',
      links: [{ label: 'Company', href: '#', primary: true }],
      section: 'experience'
    },
    {
      id: 'saga-previous',
      name: 'Midfield Systems',
      cost: ['U'],
      type: 'Saga — Midfield Systems',
      rarity: 'rare',
      rules: [
        'Owned the billing service end to end.',
        'Rewrote the invoicing pipeline with zero customer-visible downtime.',
        'Cut on-call pages for the team by two thirds.'
      ],
      flavor: 'Software Engineer · 2019–2022',
      links: [{ label: 'Company', href: '#', primary: true }],
      section: 'experience'
    },
    {
      id: 'saga-first',
      name: 'First Light',
      cost: ['W'],
      type: 'Saga — First Light',
      rarity: 'uncommon',
      rules: [
        'First engineering role, on a team of three.',
        'Shipped the customer portal that carried the company through Series A.'
      ],
      flavor: 'Junior Engineer · 2017–2019',
      links: [{ label: 'Company', href: '#', primary: true }],
      section: 'experience'
    },

    {
      id: 'land-linkedin',
      name: 'LinkedIn',
      cost: [],
      identity: ['U'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: add one professional connection.'],
      links: [{ label: 'Open', href: '#', primary: true }],
      section: 'contact'
    },
    {
      id: 'land-github',
      name: 'GitHub',
      cost: [],
      identity: ['B'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: reveal the top card of the commit history.'],
      links: [{ label: 'Open', href: '#', primary: true }],
      section: 'contact'
    },
    {
      id: 'land-email',
      name: 'Email',
      cost: [],
      identity: ['W'],
      type: 'Land',
      rarity: 'common',
      rules: ['Tap: begin a conversation.'],
      links: [{ label: 'Open', href: 'mailto:el.linzer@spothero.com', primary: true }],
      section: 'contact'
    }
  ]
};

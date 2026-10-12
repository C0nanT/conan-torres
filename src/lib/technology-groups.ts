export interface TechnologyGroup {
  id: string
  color: string
  labels: string[]
}

// One colour per group keeps the filter calm. Labels missing here land in the
// neutral `other` group.
const technologyGroups: TechnologyGroup[] = [
  {
    id: 'development',
    color: '#3b82f6',
    labels: [
      'PHP',
      'Laravel',
      'Python',
      'TypeScript',
      'React',
      'React Native',
      'HTML',
      'CSS',
      'Front-end',
      'Mobile',
    ],
  },
  {
    id: 'data',
    color: '#14b8a6',
    labels: ['Banco de dados', 'SQL', 'MySQL', 'PostgreSQL'],
  },
  {
    id: 'infra',
    color: '#f97316',
    labels: ['Docker', 'DevOps', 'AWS', 'Cloud', 'CI/CD', 'Git', 'GitHub'],
  },
  {
    id: 'architecture',
    color: '#8b5cf6',
    labels: ['Arquitetura', 'POO', 'SOLID', 'MVC', 'API REST'],
  },
  {
    id: 'security',
    color: '#ef4444',
    labels: ['Segurança', 'Autenticação', 'JWT'],
  },
  { id: 'ai', color: '#ec4899', labels: ['IA', 'Claude', 'Claude Code'] },
  {
    id: 'career',
    color: '#64748b',
    labels: [
      'Graduação',
      'Desenvolvimento de sistemas',
      'Inglês',
      'Palestra',
      'Setor público',
    ],
  },
]

const groupByLabel = new Map(
  technologyGroups.flatMap((group) =>
    group.labels.map((label) => [label, group] as const)
  )
)

export function getTechnologyGroup(label: string): TechnologyGroup | undefined {
  return groupByLabel.get(label)
}

// Splits the labels in use into their groups, in group order. Unknown labels
// go last in a colourless `other` group.
export function groupTechnologies(labels: string[]): TechnologyGroup[] {
  const known = technologyGroups
    .map((group) => ({
      ...group,
      labels: group.labels.filter((label) => labels.includes(label)),
    }))
    .filter((group) => group.labels.length > 0)

  const other = labels.filter((label) => !groupByLabel.has(label))

  return other.length > 0
    ? [...known, { id: 'other', color: '', labels: other }]
    : known
}

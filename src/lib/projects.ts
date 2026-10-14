import githubReposData from '../../data/github-repos.json'
import { site } from './site-data'

interface GithubRepo {
  name: string
  language: string | null
  url: string
  homepage: string | null
}

export interface Project {
  name: string
  description: string
  language: string | null
  repoUrl: string
  demoUrl: string | null
}

function buildProjects(): Project[] {
  const repos = githubReposData.repos as GithubRepo[]
  const reposByName = new Map(repos.map((repo) => [repo.name, repo]))

  return site.projects.featured.map(({ repo: name, description }) => {
    const repo = reposByName.get(name)

    if (!repo) {
      throw new Error(
        `[projects] "${name}" is listed in data/site.json (projects.featured) but not found in data/github-repos.json. Fix the repo name or update github-repos.json.`
      )
    }

    return {
      name: repo.name,
      description,
      language: repo.language,
      repoUrl: repo.url,
      demoUrl: repo.homepage || null,
    }
  })
}

export const projects = buildProjects()

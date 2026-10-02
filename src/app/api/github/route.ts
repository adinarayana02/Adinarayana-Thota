import { NextResponse } from 'next/server'
import { fallbackGitHub } from '@/lib/constants'

interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  html_url: string
  fork: boolean
  topics?: string[]
  updated_at: string
  pushed_at: string
  created_at: string
}

interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
}

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    // Use GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/adinarayana02', {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch('https://api.github.com/users/adinarayana02/repos?sort=pushed&per_page=30', {
        headers,
        next: { revalidate: 3600 },
      }),
    ])

    if (!userRes.ok || !reposRes.ok) {
      console.error('GitHub API error:', userRes.status, reposRes.status)
      return NextResponse.json(fallbackGitHub)
    }

    const user: GitHubUser = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()

    // Calculate language stats from repos
    const languageCounts: Record<string, number> = {}
    const nonForkRepos = repos.filter((repo) => !repo.fork)

    for (const repo of nonForkRepos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    }

    // Convert to percentages
    const totalWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languages: Record<string, number> = {}
    for (const [lang, count] of Object.entries(languageCounts)) {
      languages[lang] = Math.round((count / totalWithLanguage) * 100)
    }

    // Map top repos sorted by pushed_at or created_at (most recent changes/creation first)
    const topRepos = nonForkRepos
      .sort((a, b) => {
        const timeA = Math.max(new Date(a.pushed_at || a.updated_at).getTime(), new Date(a.created_at).getTime());
        const timeB = Math.max(new Date(b.pushed_at || b.updated_at).getTime(), new Date(b.created_at).getTime());
        return timeB - timeA;
      })
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        url: repo.html_url,
        topics: repo.topics || [],
        updatedAt: repo.pushed_at || repo.updated_at,
      }))

    return NextResponse.json({
      username: user.login,
      name: user.name || 'Adinarayana Thota',
      bio: user.bio || 'Developer (AI / ML, Generative AI & AI Agents)',
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      topRepos,
      languages,
    })
  } catch (error) {
    console.error('GitHub route error:', error)
    return NextResponse.json(fallbackGitHub)
  }
}

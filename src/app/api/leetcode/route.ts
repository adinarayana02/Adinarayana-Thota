import { NextResponse } from 'next/server'
import { fallbackLeetCode } from '@/lib/constants'

interface LeetCodeSubmission {
  difficulty: string
  count: number
}

interface LeetCodeResponse {
  data?: {
    matchedUser?: {
      submitStatsGlobal?: {
        acSubmissionNum?: LeetCodeSubmission[]
      }
      profile?: {
        ranking?: number
      }
    }
  }
}

export async function GET() {
  try {
    const query = `query {
      matchedUser(username: "adinarayana02") {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
      }
    }`

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: {} }),
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error('LeetCode API error:', res.status)
      return NextResponse.json(fallbackLeetCode)
    }

    const data: LeetCodeResponse = await res.json()
    const matchedUser = data?.data?.matchedUser

    if (!matchedUser) {
      console.error('LeetCode: no matched user data')
      return NextResponse.json(fallbackLeetCode)
    }

    const submissions = matchedUser.submitStatsGlobal?.acSubmissionNum || []
    const ranking = matchedUser.profile?.ranking || 0

    // Parse submission stats by difficulty
    const getCount = (difficulty: string): number =>
      submissions.find((s) => s.difficulty === difficulty)?.count || 0

    const totalSolved = getCount('All')
    const easySolved = getCount('Easy')
    const mediumSolved = getCount('Medium')
    const hardSolved = getCount('Hard')

    return NextResponse.json({
      username: 'adinarayana02',
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking,
      totalQuestions: fallbackLeetCode.totalQuestions,
    })
  } catch (error) {
    console.error('LeetCode route error:', error)
    return NextResponse.json(fallbackLeetCode)
  }
}

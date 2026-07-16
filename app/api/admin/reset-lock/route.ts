import { NextResponse } from 'next/server'
import { resetAllLocks } from '@/lib/admin-auth'

export async function POST() {
  try {
    resetAllLocks()
    return NextResponse.json(
      { success: true, message: 'Admin login lock reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Admin Reset Lock Error]', error)
    return NextResponse.json(
      { error: 'Failed to reset lock' },
      { status: 500 }
    )
  }
}

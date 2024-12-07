import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { walletAddress, labellingJobId, winnerId, loserId } = await req.json()

    const user = await prisma.user.findUnique({
      where: { walletAddress }
    })
    const userId = user?.id

    console.log(userId, labellingJobId, winnerId, loserId)

    if (!userId || !labellingJobId || !winnerId || !loserId) {
      return NextResponse.json({ error: 'User ID, labelling job ID, winner ID, and loser ID are required' }, { status: 400 })
    }

    const comparison = await prisma.comparison.upsert({
      where: {
        labellingJobId_winnerId_loserId_userId: {
          userId: userId,
          labellingJobId: labellingJobId,
          winnerId: winnerId,
          loserId: loserId
        }
      },
      create: {
        userId: userId,
        labellingJobId: labellingJobId,
        winnerId: winnerId,
        loserId: loserId
      },
      update: {}
    })

    const labellingJob = await prisma.labellingJob.findUnique({
      where: { id: labellingJobId },
      select: { reward: true }
    })

    if (!labellingJob) {
      return NextResponse.json({ error: 'Labelling job not found' }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        tasksCompleted: { increment: 1 },
        claimableRewards: { increment: labellingJob.reward }
      }
    })
    try {
      await prisma.viewedImage.createMany({
        data: [
          { userId, imageId: winnerId },
          { userId, imageId: loserId }
        ]
      })
    } catch (err) {
      console.log('Error creating viewed image:', err)
    }


    return NextResponse.json({ success: true, comparison })
  } catch (error) {
    console.error('Error submitting comparison:', error)
    return NextResponse.json({ error: 'Error submitting comparison' }, { status: 500 })
  }
}


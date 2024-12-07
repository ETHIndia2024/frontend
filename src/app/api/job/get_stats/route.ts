import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const creatorAddress = searchParams.get('address')

  if (!creatorAddress) {
    return NextResponse.json({ error: 'Creator address is required' }, { status: 400 })
  }

  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const creator = await prisma.user.findUnique({
    where: { walletAddress: creatorAddress },
    include: { labellingJobs: true },
  })

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
  }

  const totalDatasets = await prisma.labellingJob.count({
    where: { creatorId: creator.id },
  })

  const totalDatasetsLastWeek = await prisma.labellingJob.count({
    where: {
      creatorId: creator.id,
      createdAt: { lt: oneWeekAgo },
    },
  })

  const totalImages = await prisma.image.count({
    where: { labellingJob: { creatorId: creator.id } },
  })

  const labelledImages = await prisma.labelling.count({
    where: { labellingJob: { creatorId: creator.id } },
  })

  const labellingProgress = totalImages > 0 ? Math.round((labelledImages / totalImages) * 100) : 0

  const labellingProgressLastWeek = await prisma.labelling.count({
    where: {
      labellingJob: { creatorId: creator.id },
      createdAt: { lt: oneWeekAgo },
    },
  })

  const activeLabelersCount = await prisma.user.count({
    where: {
      labellings: {
        some: {
          labellingJob: { creatorId: creator.id },
        },
      },
    },
  })

  const activeLabelersCountLastWeek = await prisma.user.count({
    where: {
      labellings: {
        some: {
          labellingJob: { creatorId: creator.id },
          createdAt: { lt: oneWeekAgo },
        },
      },
    },
  })

  const recentUploads = await prisma.labellingJob.findMany({
    where: { creatorId: creator.id },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { images: true }
      }
    }
  })



  return NextResponse.json({
    totalDatasets,
    totalDatasetsChange: totalDatasets - totalDatasetsLastWeek,
    labellingProgress,
    labellingProgressChange: labellingProgress - (labellingProgressLastWeek / totalImages * 100),
    activeLabelersCount,
    activeLabelersChange: activeLabelersCount - activeLabelersCountLastWeek,
    recentUploads,
  })
}

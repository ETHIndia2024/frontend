import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' }, 
        { status: 400 }
      )
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { walletAddress }
    })

    const labellingJobs = await prisma.labellingJob.findMany({
      where: {
        images: {
          some: {
            NOT: {
              viewedBy: {
                some: {
                  userId: user.id
                }
              }
            }
          }
        }
      },
      include: {
        images: {
          where: {
            NOT: {
              viewedBy: {
                some: {
                  userId: user.id
                }
              }
            }
          }
        }
      }
    })

    if (labellingJobs.length === 0) {
      return NextResponse.json(
        { message: 'No more labelling jobs available with unviewed images' }, 
        { status: 404 }
      )
    }

    // Sort labelling jobs by the number of unviewed images
    labellingJobs.sort((a, b) => b.images.length - a.images.length)

    // Select the job with the most unviewed images
    const selectedJob = labellingJobs[0]

    // Take only the first two images
    selectedJob.images = selectedJob.images.slice(0, 2)

    if (selectedJob.images.length < 2) {
      return NextResponse.json(
        { message: 'No more labelling jobs available with at least two unviewed images' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(selectedJob)
  } catch (error) {
    console.error('Error fetching labelling job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


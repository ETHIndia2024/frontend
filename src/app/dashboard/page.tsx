'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Upload, BarChart, Users, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useWallet } from "@suiet/wallet-kit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DashboardStats {
  totalDatasets: number
  totalDatasetsChange: number
  labellingProgress: number
  labellingProgressChange: number
  activeLabelersCount: number
  activeLabelersChange: number
  recentUploads: {
    id: string
    title: string
    createdAt: string
    _count: { images: number }
  }[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const wallet = useWallet()

  useEffect(() => {
    async function fetchStats() {
      if (wallet.connected && wallet.account?.address) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/job/get_stats?address=${wallet.account.address}`)
          if (!response.ok) throw new Error('Failed to fetch stats')
          const data = await response.json()
          setStats(data)
        } catch (error) {
          console.error('Error fetching dashboard stats:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchStats()
  }, [wallet.connected, wallet.account?.address])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return <div className="py-8 text-center">Failed to load dashboard data. Please try again later.</div>
  }

  return (
    <div className="container mx-auto p-6 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/upload" className="flex items-center">
                <Upload className="mr-2 h-4 w-4" /> Upload New Dataset
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View All Datasets</DropdownMenuItem>
            <DropdownMenuItem>Manage Labelers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Datasets"
          value={stats.totalDatasets}
          change={stats.totalDatasetsChange}
          icon={<Upload className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Labelling Progress"
          value={`${stats.labellingProgress}%`}
          change={stats.labellingProgressChange}
          icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
          showProgress
          progressValue={stats.labellingProgress}
        />
        <StatCard
          title="Active Labelers"
          value={stats.activeLabelersCount}
          change={stats.activeLabelersChange}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="recent-uploads" className="w-full">
        <TabsList>
          <TabsTrigger value="recent-uploads">Recent Uploads</TabsTrigger>
          <TabsTrigger value="top-labelers">Top Labelers</TabsTrigger>
        </TabsList>
        <TabsContent value="recent-uploads">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentUploads.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{job._count.images}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="top-labelers">
          <Card>
            <CardHeader>
              <CardTitle>Top Labelers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  { name: "Alice Smith", completedTasks: 156, accuracy: 98 },
                  { name: "Bob Johnson", completedTasks: 143, accuracy: 97 },
                  { name: "Carol Williams", completedTasks: 137, accuracy: 99 },
                ].map((labeler, index) => (
                  <div key={index} className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://avatar.vercel.sh/${labeler.name.toLowerCase().replace(' ', '-')}.png`} alt={labeler.name} />
                      <AvatarFallback>{labeler.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{labeler.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {labeler.completedTasks} tasks • {labeler.accuracy}% accuracy
                      </p>
                    </div>
                    <div className="ml-auto font-medium">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// @ts-ignore
function StatCard({ title, value, change, icon, showProgress = false, progressValue = 0 }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {showProgress && (
          <Progress value={progressValue} className="mt-2" />
        )}
        <p className="text-xs text-muted-foreground mt-2 flex items-center">
          {change > 0 ? (
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span className={change > 0 ? "text-green-500" : "text-red-500"}>
            {Math.abs(change)}
          </span>
          {showProgress ? '%' : ''} {" from last week"}
        </p>
      </CardContent>
    </Card>
  )
}


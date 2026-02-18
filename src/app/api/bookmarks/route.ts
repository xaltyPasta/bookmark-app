import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 5)

  const skip = (page - 1) * limit

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.bookmark.count({
      where: { userId: user.id }
    })
  ])

  return NextResponse.json({
    data: bookmarks,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, url } = await req.json()

  if (!title || !url) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      title,
      url,
      userId: user.id
    }
  })

  return NextResponse.json(bookmark)
}

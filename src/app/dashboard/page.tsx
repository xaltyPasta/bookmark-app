import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import AuthButton from "@/components/AuthButton"
import Link from "next/link"
import { createBookmark } from "./actions"
import BookmarkRow from "@/components/BookmarkRow"
import BookmarkBroadcast from "@/components/BookmarkBroadcast"
import CreateBookmarkForm from "@/components/CreateBookmarkForm"

type Props = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function DashboardPage({ searchParams }: Props) {

  const params = await searchParams

  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <div className="p-5 text-center">Unauthorized</div>
  }

  const page = Number(params.page || 1)
  const limit = 5
  const skip = (page - 1) * limit

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return <div className="p-5 text-center">User not found</div>
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

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-vh-100 bg-dark text-white">

      {/* Navbar */}
      <nav className="navbar navbar-dark bg-black px-4">
        <span className="navbar-brand">My Bookmarks</span>
        <AuthButton />
      </nav>

      {/* 🔥 Realtime Listener */}
      <BookmarkBroadcast />

      <CreateBookmarkForm />


      <div className="container py-5">

        {/* Bookmark List */}
        <h3 className="mb-4">Your Bookmarks</h3>

        {bookmarks.length === 0 && (
          <p className="text-secondary">No bookmarks yet.</p>
        )}

        <div className="list-group mb-4">
          {bookmarks.map((bookmark) => (
            <BookmarkRow
              key={bookmark.id}
              id={bookmark.id}
              title={bookmark.title}
              url={bookmark.url}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            {page > 1 && (
              <Link
                href={`/dashboard?page=${page - 1}`}
                className="btn btn-outline-light btn-sm"
              >
                Previous
              </Link>
            )}
          </div>

          <div className="small">
            Page {page} of {totalPages || 1}
          </div>

          <div>
            {page < totalPages && (
              <Link
                href={`/dashboard?page=${page + 1}`}
                className="btn btn-outline-light btn-sm"
              >
                Next
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

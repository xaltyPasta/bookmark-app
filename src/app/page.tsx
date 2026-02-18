"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AuthButton from "@/components/AuthButton"
import BookmarkBroadcast from "@/components/BookmarkBroadcast"

export default function HomePage() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard")
    }
  }, [session, router])

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
      <div className="text-center">
        <h1 className="mb-4">Smart Bookmark App</h1>
        <p className="mb-4 text-secondary">
          Sign in to manage your private bookmarks
        </p>
        <AuthButton />
        {/* 🔥 REALTIME LISTENER */}
      </div>
    </div>
  )
}

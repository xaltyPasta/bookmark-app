"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function BookmarkBroadcast() {
  const router = useRouter()

  useEffect(() => {
    const channel = new BroadcastChannel("bookmark_channel")

    channel.onmessage = () => {
      router.refresh()
    }

    return () => {
      channel.close()
    }
  }, [router])

  return null
}

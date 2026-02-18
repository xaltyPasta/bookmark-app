export function broadcastBookmarkChange() {
  if (typeof window !== "undefined") {
    const channel = new BroadcastChannel("bookmark_channel")
    channel.postMessage("updated")
    channel.close()
  }
}

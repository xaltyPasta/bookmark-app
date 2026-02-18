"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBookmark(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  await prisma.bookmark.create({
    data: {
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      userId: user!.id
    }
  })

  revalidatePath("/dashboard")
}

export async function updateBookmark(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  await prisma.bookmark.updateMany({
    where: {
      id: formData.get("id") as string,
      userId: user!.id
    },
    data: {
      title: formData.get("title") as string,
      url: formData.get("url") as string
    }
  })

  revalidatePath("/dashboard")
}

export async function deleteBookmark(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  await prisma.bookmark.deleteMany({
    where: {
      id: formData.get("id") as string,
      userId: user!.id
    }
  })

  revalidatePath("/dashboard")
}

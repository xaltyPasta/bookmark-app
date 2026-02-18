"use client"

import { useState, useTransition } from "react"
import { updateBookmark, deleteBookmark } from "@/app/dashboard/actions"
import { broadcastBookmarkChange } from "@/lib/bookmark-broadcast"

type Props = {
    id: string
    title: string
    url: string
}

export default function BookmarkRow({ id, title, url }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [isPending, startTransition] = useTransition()

    return (
        <div className="list-group-item bg-secondary text-white border-0 mb-3 rounded p-3">

            {!isEditing ? (
                <div className="d-flex justify-content-between align-items-center">

                    <div>
                        <h6 className="mb-1">{title}</h6>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-light small"
                        >
                            {url}
                        </a>
                    </div>

                    <div className="d-flex gap-2">

                        <button
                            className="btn btn-light btn-sm"
                            onClick={() => setIsEditing(true)}
                            disabled={isPending}
                        >
                            Edit
                        </button>

                        <form
                            action={(formData) => {
                                startTransition(async () => {
                                    await deleteBookmark(formData)
                                    broadcastBookmarkChange()
                                })
                            }}
                        >
                            <input type="hidden" name="id" value={id} />
                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn btn-danger btn-sm"
                            >
                                {isPending ? "Deleting..." : "Delete"}
                            </button>
                        </form>

                    </div>
                </div>
            ) : (
                <form
                    action={(formData) => {
                        startTransition(async () => {
                            await updateBookmark(formData)
                            broadcastBookmarkChange()
                            setIsEditing(false)
                        })
                    }}
                >
                    <input type="hidden" name="id" value={id} />

                    <div className="row g-2 align-items-center">

                        <div className="col-md-5">
                            <input
                                name="title"
                                defaultValue={title}
                                className="form-control form-control-sm"
                                required
                            />
                        </div>

                        <div className="col-md-5">
                            <input
                                name="url"
                                defaultValue={url}
                                className="form-control form-control-sm"
                                required
                            />
                        </div>

                        <div className="col-md-2 d-flex gap-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn btn-success btn-sm w-100"
                            >
                                {isPending ? "Saving..." : "Save"}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-light btn-sm w-100"
                                onClick={() => setIsEditing(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </form>
            )}
        </div>
    )
}

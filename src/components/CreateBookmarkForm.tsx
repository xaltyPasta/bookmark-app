"use client"

import { useTransition } from "react"
import { createBookmark } from "@/app/dashboard/actions"
import { broadcastBookmarkChange } from "@/lib/bookmark-broadcast"

export default function CreateBookmarkForm() {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="card bg-dark border border-secondary mb-5 shadow-lg rounded-4">
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0 fw-semibold">
            Add Bookmark
          </h5>
          <span className="text-secondary small">
            Save links privately
          </span>
        </div>

        <form
          action={(formData) => {
            startTransition(async () => {
              await createBookmark(formData)
              broadcastBookmarkChange()
            })
          }}
        >
          <div className="row g-3 align-items-end">

            <div className="col-md-5">
              <label className="form-label small text-secondary">
                Title
              </label>
              <input
                name="title"
                placeholder="Example: Google"
                className="form-control bg-secondary text-white border-0 rounded-3"
                required
              />
            </div>

            <div className="col-md-5">
              <label className="form-label small text-secondary">
                URL
              </label>
              <input
                name="url"
                placeholder="https://example.com"
                className="form-control bg-secondary text-white border-0 rounded-3"
                required
              />
            </div>

            <div className="col-md-2">
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-light w-100 rounded-3 fw-semibold"
              >
                {isPending ? "Adding..." : "Add"}
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  )
}

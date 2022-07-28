import type { DataFunctionArgs } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import FeedbackForm from "~/components/FeedbackForm"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"

export let loader = async ({ params, request }: DataFunctionArgs) => {
  let review = await db.review.findUnique({
    where: { id: params.reviewId },
    include: { manager: true },
  })

  if (!review) throw new Response("Not Found", { status: 404 })

  let user = await auth.isAuthenticated(request)

  return { user, review }
}

export default function ViewReview() {
  let { user, review } = useLoaderData<Awaited<ReturnType<typeof loader>>>()
  let { id: reviewId, createdAt, managerId } = review
  return (
    <>
      <h3>View feedback</h3>
      <small>
        {new Date(createdAt).toLocaleDateString("en-us", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </small>
      <FeedbackForm initialValues={review} readOnly />
      {review.userId === user?.id && (
        <div className="flex flex-row justify-between content-center">
          <Link to={`/managers/${managerId}/feedback/${reviewId}/edit`}>
            Edit your feedback
          </Link>
          <Form
            method="post"
            action={`/managers/${managerId}/feedback/${reviewId}/delete`}
            onClick={(e) => {
              if (!window.confirm("Are you sure you wish to delete this?"))
                e.preventDefault()
            }}
          >
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg"
            >
              Delete
            </button>
          </Form>
        </div>
      )}
    </>
  )
}

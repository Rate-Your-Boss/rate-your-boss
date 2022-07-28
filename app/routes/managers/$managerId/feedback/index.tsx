import type { Review } from "@prisma/client"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import StarRating from "~/components/StarRating"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"

export let loader = async ({ params, request }: DataFunctionArgs) => {
  let user = await auth.isAuthenticated(request)
  let reviews = await db.review.findMany({
    where: { managerId: params.managerId },
    orderBy: { createdAt: "desc" },
  })

  return { reviews, userId: user?.id }
}

export default function ViewReviews() {
  let { reviews, userId } = useLoaderData<Awaited<ReturnType<typeof loader>>>()
  let { managerId } = useParams()

  if (!reviews.length) {
    return (
      <>
        <p>No feedback for this person yet.</p>
        <Link to={`/managers/${managerId}/feedback/new`}>
          Add your feedback
        </Link>
      </>
    )
  }

  let summary = calculateSummary(reviews)
  let _count = reviews.length
  let _avg = { rating: reviews.reduce((a, b) => a + b.rating, 0) / _count }
  let userReviewId = reviews.find((r) => r.userId === userId)?.id

  return (
    <>
      <p>
        {_avg.rating.toFixed(1)} <StarRating rating={_avg.rating} /> · {_count}{" "}
        feedback
      </p>
      <p>
        {userReviewId ? (
          <Link to={`/managers/${managerId}/feedback/${userReviewId}`}>
            View your feeedback
          </Link>
        ) : (
          <Link to={`/managers/${managerId}/feedback/new`}>
            Add your feedback
          </Link>
        )}
      </p>
      <h2>Summary</h2>
      <dl className="space-y-6">
        {summary.map(({ title, value }) => (
          <div key={title} className="flex items-center text-sm">
            <dt className="flex-1 flex items-center">
              <span className="w-3 font-medium text-gray-900">{title}</span>
              <div aria-hidden="true" className="ml-1 flex-1 flex items-center">
                <div className="ml-20 relative flex-1">
                  <div className="h-4 bg-gray-100 border border-gray-200 rounded-full" />
                  <div
                    className="absolute inset-y-0 bg-yellow-400 border border-yellow-400 rounded-full"
                    style={{
                      width: `calc(${value} / 5 * 100%)`,
                    }}
                  />
                </div>
              </div>
            </dt>
            <dd className="ml-3 w-10 text-right tabular-nums text-sm text-gray-900">
              {value.toFixed(1)}
            </dd>
          </div>
        ))}
      </dl>
      <p>
        <Link to={`/what-makes-a-great-boss`}>
          What do these categories mean?
        </Link>
      </p>
      <h2>All feedback</h2>
      <div className="space-y-2 divide-y">
        {reviews.map(
          ({ id: reviewId, managerId, rating, comment, createdAt }) => (
            <section key={reviewId}>
              <p>
                <StarRating rating={rating} /> ·{" "}
                <small>
                  <Link to={`/managers/${managerId}/feedback/${reviewId}`}>
                    {new Date(createdAt).toLocaleDateString("en-us", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Link>
                </small>
              </p>
              <p>{comment}</p>
            </section>
          )
        )}
      </div>
    </>
  )
}

function calculateSummary(qs: Review[]) {
  return [
    {
      title: "Caring",
      value: qs.reduce((a, b) => a + b.q4 + b.q5 + b.q10, 0) / (3 * qs.length),
    },
    {
      title: "Coaching",
      value: qs.reduce((a, b) => a + b.q1 + b.q3 + b.q8, 0) / (3 * qs.length),
    },
    {
      title: "Leadership",
      value: qs.reduce((a, b) => a + b.q2 + b.q7 + b.q12, 0) / (3 * qs.length),
    },
    {
      title: "Effectiveness",
      value: qs.reduce((a, b) => a + b.q6 + b.q9 + b.q11, 0) / (3 * qs.length),
    },
  ]
}

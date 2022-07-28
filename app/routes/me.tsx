import { Form, Link, useLoaderData } from "@remix-run/react"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import StarRating from "~/components/StarRating"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"

export let loader = async ({ request }: DataFunctionArgs) => {
  let redirectParams = new URLSearchParams({ redirectUrl: request.url })
  let user = await auth.isAuthenticated(request, {
    failureRedirect: `/auth/login?${redirectParams.toString()}`,
  })

  let reviews = await db.review.findMany({
    where: { userId: user.id },
    include: { manager: true },
    orderBy: { createdAt: "desc" },
  })
  return { reviews }
}

export default function Me() {
  let { reviews } = useLoaderData<Awaited<ReturnType<typeof loader>>>()
  return (
    <div>
      <Form action="/auth/logout" method="get" reloadDocument>
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg"
        >
          Logout
        </button>
      </Form>
      {reviews.length < 1 ? (
        <>
          <p>You haven't submitted any feedback yet</p>
          <Link to="/how-it-works" className="text-indigo-600">
            Get started now
          </Link>
        </>
      ) : (
        <>
          <h3>Your feedback</h3>
          <div className="space-y-2 divide-y">
            {reviews.map(
              ({
                id: reviewId,
                managerId,
                manager,
                rating,
                comment,
                createdAt,
              }) => (
                <section key={reviewId}>
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-20 w-20 rounded-full"
                      src={manager.picture}
                      alt=""
                    />
                    <p>
                      <Link to={`/managers/${managerId}/feedback`}>
                        <strong>{manager.fullName}</strong>
                      </Link>
                      <br />
                      <em>{manager.headline}</em>
                      <br />
                      <StarRating rating={rating} /> ·{" "}
                      <small>
                        <Link
                          to={`/managers/${managerId}/feedback/${reviewId}`}
                        >
                          {new Date(createdAt).toLocaleDateString("en-us", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Link>
                      </small>
                    </p>
                  </div>
                  <p>{comment}</p>
                </section>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}

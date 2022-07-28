import type { ActionFunction, DataFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import FeedbackForm, { FeedbackSchema } from "~/components/FeedbackForm"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"

export let loader = async ({ params, request }: DataFunctionArgs) => {
  let redirectParams = new URLSearchParams({ redirectUrl: request.url })
  let user = await auth.isAuthenticated(request, {
    failureRedirect: `/auth/login?${redirectParams.toString()}`,
  })

  let review = await db.review.findFirst({
    where: { id: params.reviewId, userId: user?.id },
    include: { manager: true },
  })

  if (!review) throw new Response("Not Found", { status: 404 })

  return { review }
}

export let action: ActionFunction = async ({ request, params }) => {
  let redirectParams = new URLSearchParams({ redirectUrl: request.url })
  let user = await auth.isAuthenticated(request, {
    failureRedirect: `/auth/login?${redirectParams.toString()}`,
  })

  let form = await request.formData()
  let data = FeedbackSchema.parse(Object.fromEntries(form.entries()))
  await db.review.updateMany({
    where: { id: params.reviewId, userId: user?.id },
    data,
  })

  return redirect(`/managers/${params.managerId}/feedback`)
}

export default function EditFeedback() {
  let { review } = useLoaderData<Awaited<ReturnType<typeof loader>>>()
  return (
    <>
      <h3>Edit your feedback</h3>
      <Form method="post">
        <FeedbackForm initialValues={review} />
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg"
        >
          Submit
        </button>
      </Form>
    </>
  )
}

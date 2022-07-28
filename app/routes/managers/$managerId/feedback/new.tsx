import type { ActionFunction, DataFunctionArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import FeedbackForm, { FeedbackSchema } from "~/components/FeedbackForm"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"

export let loader = async ({ request }: DataFunctionArgs) => {
  let redirectParams = new URLSearchParams({ redirectUrl: request.url })
  return auth.isAuthenticated(request, {
    failureRedirect: `/auth/login?${redirectParams.toString()}`,
  })
}

export let action: ActionFunction = async ({ request, params }) => {
  let redirectParams = new URLSearchParams({ redirectUrl: request.url })
  let user = await auth.isAuthenticated(request, {
    failureRedirect: `/auth/login?${redirectParams.toString()}`,
  })

  let form = await request.formData()
  let data = FeedbackSchema.parse(Object.fromEntries(form.entries()))
  let review = await db.review.create({
    data: { ...data, managerId: params.managerId!, userId: user.id },
  })

  return redirect(`/managers/${review.managerId}/feedback`)
}

export default function NewFeedback() {
  return (
    <>
      <h3>New feedback</h3>
      <Form method="post">
        <FeedbackForm />
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

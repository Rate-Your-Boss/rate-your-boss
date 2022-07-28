import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { auth } from "~/services/auth.server"
import { db } from "~/services/db.server"

export let action: ActionFunction = async ({ request, params }) => {
  let user = await auth.isAuthenticated(request)
  let review = await db.review.findFirst({
    where: { id: params.reviewId, userId: user?.id },
  })

  if (!review) throw new Response("Not Found", { status: 404 })

  await db.review.delete({ where: { id: review.id } })

  return redirect(`/managers/${review.managerId}/feedback`)
}

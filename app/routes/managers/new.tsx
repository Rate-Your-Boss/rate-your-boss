import type { ActionFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { z } from "zod"
import { db } from "~/services/db.server"
import { upload } from "~/services/media.server"

let { EXTENSION_API_KEY } = process.env
if (!EXTENSION_API_KEY)
  throw new Error("Missing EXTENSION_API_KEY env variable.")

let EMPTY_PICTURE =
  "https://static-exp2.licdn.com/sc/h/244xhbkr7g40x6bsu4gi6q4ry"

let ManagerSchema = z.object({
  memberId: z.string(),
  fullName: z.string(),
  headline: z.string(),
  picture: z.string().optional().default(EMPTY_PICTURE),
  url: z.string(),
})

let cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
}

export let loader = () => new Response(null, { headers: cors })

export let action: ActionFunction = async ({ request }) => {
  let header = request.headers.get("Authorization")
  if (!header)
    throw new Response("Unauthorized", { status: 401, headers: cors })

  let token = header.replace("Bearer ", "")
  if (token !== EXTENSION_API_KEY)
    throw new Response("Forbidden", { status: 403, headers: cors })

  let form = await request.formData()
  let entries = Object.fromEntries(form.entries())
  console.log({ entries })
  let data = ManagerSchema.parse(entries)

  data.url = `https://linkedin.com${data.url}`

  if (!data.picture.startsWith("http")) {
    data.picture = EMPTY_PICTURE
  }
  if (data.picture !== EMPTY_PICTURE) {
    data.picture = await upload(data.picture, data.memberId)
  }

  let { id, reviews } = await db.manager.upsert({
    where: { memberId: data.memberId },
    update: { ...data },
    create: { ...data },
    select: { id: true, reviews: { select: { rating: true } } },
  })

  let rating =
    reviews.map(({ rating }) => rating).reduce((a, b) => a + b, 0) /
    reviews.length

  return json({ id, rating }, { headers: cors })
}

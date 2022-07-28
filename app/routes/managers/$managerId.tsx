import type { MetaFunction } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { db } from "~/services/db.server"

export let loader = async ({ params }: DataFunctionArgs) => {
  let manager = await db.manager.findUnique({
    where: { id: params.managerId },
  })
  if (!manager) throw new Response("Not Found", { status: 404 })
  return { manager }
}

export let meta: MetaFunction = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>>
}) => ({
  title: `${data.manager.fullName} | Rate Your Boss`,
  "og:title": `${data.manager.fullName} | Rate Your Boss`,
  "og:description": `Feedback for ${data.manager.fullName}`,
  "og:image": data.manager.picture,
  "twitter:title": `${data.manager.fullName} | Rate Your Boss`,
  "twitter:description": `Feedback for ${data.manager.fullName}`,
  "twitter:image": data.manager.picture,
  "twitter:card": "summary",
})

export default function ViewManager() {
  let { manager } = useLoaderData<Awaited<ReturnType<typeof loader>>>()
  let { fullName, headline, picture, url } = manager
  return (
    <>
      <img
        className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
        src={picture}
        alt=""
      />
      <p className="lead">
        <Link to={`/managers/${manager.id}/feedback`}>
          <strong>{fullName}</strong>
        </Link>
        <br />
        <em>{headline}</em>
      </p>
      <a href={url} target="_blank" rel="noreferrer noopener">
        <small>View on Linkedin ↗</small>
      </a>
      <Outlet />
    </>
  )
}

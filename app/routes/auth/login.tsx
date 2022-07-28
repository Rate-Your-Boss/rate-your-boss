import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { auth, LINKEDIN_STRATEGY } from "~/services/auth.server"
import { commitSession, getSession } from "~/services/session.server"

export let loader: LoaderFunction = async ({ request }) => {
  let { searchParams } = new URL(request.url)
  let redirectUrl = searchParams.get("redirectUrl")
  if (!redirectUrl) {
    return auth.authenticate(LINKEDIN_STRATEGY, request)
  }
  let session = await getSession(request.headers.get("cookie"))
  session.set("redirectUrl", redirectUrl)
  let headers = new Headers({ "Set-Cookie": await commitSession(session) })
  return redirect("/auth/login", { headers })
}

import type { LoaderFunction } from "@remix-run/node"
import { auth, LINKEDIN_STRATEGY } from "~/services/auth.server"
import { getSession } from "~/services/session.server"

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("cookie"))
  let successRedirect = session.get("redirectUrl") || "/"
  return auth.authenticate(LINKEDIN_STRATEGY, request, { successRedirect })
}

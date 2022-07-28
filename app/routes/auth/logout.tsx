import type { LoaderFunction } from "@remix-run/node"
import { auth } from "~/services/auth.server"

export let loader: LoaderFunction = async ({ request }) => {
  return auth.logout(request, { redirectTo: "/" })
}

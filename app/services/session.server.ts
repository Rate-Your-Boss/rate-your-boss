import { createCookieSessionStorage } from "@remix-run/node"

let { SESSION_SECRET } = process.env
if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET env variable.")

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
})

export let { getSession, commitSession, destroySession } = sessionStorage

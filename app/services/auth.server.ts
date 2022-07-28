import type { User } from "@prisma/client"
import { Authenticator } from "remix-auth"
import { LinkedinStrategy } from "remix-auth-linkedin"
import { db } from "~/services/db.server"
import { sessionStorage } from "~/services/session.server"

let { LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_CALLBACK_URL } =
  process.env

if (!LINKEDIN_CLIENT_ID)
  throw new Error("Missing LINKEDIN_CLIENT_ID env variable.")
if (!LINKEDIN_CLIENT_SECRET)
  throw new Error("Missing LINKEDIN_CLIENT_SECRET env variable.")
if (!LINKEDIN_CALLBACK_URL)
  throw new Error("Missing LINKEDIN_CALLBACK_URL env variable.")

export let LINKEDIN_STRATEGY = "LINKEDIN_STRATEGY"
export let auth = new Authenticator<User>(sessionStorage)

let linkedinStrategy = new LinkedinStrategy(
  {
    clientID: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL: LINKEDIN_CALLBACK_URL,
  },
  async ({ profile }) => {
    let memberId = profile.id
    let user = await db.user.findUnique({ where: { memberId } })
    if (user) return user

    return db.user.create({ data: { memberId } })
  }
)

auth.use(linkedinStrategy, LINKEDIN_STRATEGY)

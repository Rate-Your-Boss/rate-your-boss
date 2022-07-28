import type { LinksFunction, MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import Navigation from "./components/Navigation"
import styles from "./tailwind.css"

export let links: LinksFunction = () => [{ rel: "stylesheet", href: styles }]

export let meta: MetaFunction = () => ({
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1",
  title: "Rate Your Boss",
  description:
    "Give actional feedback to your managers so they know where to improve. You deserve a great boss.",
  "og:title": "Rate Your Boss",
  "og:description":
    "Give actional feedback to your managers so they know where to improve. You deserve a great boss.",
  "og:url": "https://www.rateyourboss.club",
  "og:image": "https://www.rateyourboss.club/media/logo.jpeg",
  "twitter:title": "Rate Your Boss",
  "twitter:description": "You deserve a great boss",
  "twitter:image:src": "https://www.rateyourboss.club/media/logo.jpeg",
  "twitter:card": "summary",
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <Navigation />
        </header>
        <main className="prose prose-quoteless prose-base lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto px-4 py-8">
          <Outlet />
        </main>
        <footer>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </footer>
      </body>
    </html>
  )
}

import { Link, useLoaderData } from "@remix-run/react"
import React from "react"

import * as article1 from "./posts/article1.mdx"
import * as article2 from "./posts/article2.mdx"

export async function loader() {
  return [article1, article2].map((mod) => ({
    slug: mod.filename.replace(/\.mdx?$/, ""),
    title: mod.attributes.meta.title,
    date: mod.attributes.meta.date,
    introduction: mod.attributes.meta.introduction,
  }))
}

export default function Index() {
  let posts = useLoaderData<Awaited<ReturnType<typeof loader>>>()

  return (
    <>
      {posts.map((post) => (
        <React.Fragment key={post.slug}>
          <Link to={`posts/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <small>{post.date}</small>
          <p>{post.introduction}</p>
          <hr />
        </React.Fragment>
      ))}
    </>
  )
}

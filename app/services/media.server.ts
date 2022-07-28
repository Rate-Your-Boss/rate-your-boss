import cloudinary from "cloudinary"

let { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env
if (!CLOUDINARY_CLOUD_NAME)
  throw new Error("Missing CLOUDINARY_CLOUD_NAME env variable.")
if (!CLOUDINARY_API_KEY)
  throw new Error("Missing CLOUDINARY_API_KEY env variable.")
if (!CLOUDINARY_API_SECRET)
  throw new Error("Missing CLOUDINARY_API_SECRET env variable.")

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
})

export async function upload(url: string, id: string) {
  let resp = await cloudinary.v2.uploader.upload(url, { public_id: id })
  return resp.url
}

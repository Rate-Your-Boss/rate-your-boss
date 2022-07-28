interface Props {
  rating: number
}

export default function StarRating({ rating }: Props) {
  return <>{[0.5, 1.5, 2.5, 3.5, 4.5].map((x) => (rating > x ? "★" : "☆"))}</>
}

type Props = {
  params: {
    id: string
  }
}

export default function CareerDetails({ params }: Props) {
  return (
    <div>
      Career ID: {params.id}
    </div>
  )
}
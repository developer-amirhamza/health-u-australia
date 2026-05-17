type Props = {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ]
}

export default async function CareerPage({ params }: Props) {
  const { id } = await params;

  return <div>Career ID: {id}</div>
}
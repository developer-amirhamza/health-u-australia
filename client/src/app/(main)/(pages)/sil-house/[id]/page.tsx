import { permanentRedirect } from 'next/navigation';
import SilHouseDetailClient from './SilHouseDetailClient';

const originalHousePaths: Record<string, string> = {
  'sil-belmore': '/belmore_street/',
  'sil-bowden': '/bowden_street/',
  'sil-normanhurst': '/normanhurst/',
  'sil-granny-flat': '/granny-flat/',
};

export default async function SilHouseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const originalPath = originalHousePaths[id];
  if (originalPath) permanentRedirect(originalPath);
  return <SilHouseDetailClient />;
}

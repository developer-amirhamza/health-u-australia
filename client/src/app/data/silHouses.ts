import bed from 'assets/images/2026/10/icon.png';
import bathroom from 'assets/images/2026/10/icon2.png';
import car from 'assets/images/2026/10/icon4.png';
import wheelchair from 'assets/images/sil-houses/wheelchiar.png';

export interface SilHouse {
  id: string;
  address: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  accessible: boolean;
  description: string;
  gallery: string[];
  legacyPath: string | null;
  sortOrder: number;
}

export const silHousePath = (house: SilHouse) => `/sil-house/${house.id}`;

export const silHouseFeatures = (house: SilHouse) => [
  { label: `${house.bedrooms} Bedrooms`, icon: bed },
  { label: `${house.bathrooms} Bathrooms`, icon: bathroom },
  { label: `${house.parking} Parking Spaces`, icon: car },
  ...(house.accessible ? [{ label: 'Fully Accessible', icon: wheelchair }] : []),
];

import '../src/config/env.js';
import assert from 'node:assert/strict';
import { prisma } from '../src/lib/prisma.js';

const url = new URL(process.env.DATABASE_URL || '');
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
  throw new Error('This check only runs against a local database.');
}

const rollback = new Error('Roll back local verification record');
try {
  const counts = await Promise.all([
    prisma.user.count(), prisma.scPlan.count(), prisma.scTimeEntry.count(),
    prisma.serviceAgreement.count(), prisma.contract.count(), prisma.silHouse.count(),
  ]);
  const originalHouses = await prisma.silHouse.findMany({
    where: { id: { in: ['sil-belmore', 'sil-bowden', 'sil-normanhurst', 'sil-granny-flat'] } },
  });
  assert.equal(originalHouses.length, 4, 'All four original listings must be present');
  assert.ok(originalHouses.every(house => house.image && house.gallery.length > 0), 'Original listings need cover and gallery photos');
  assert.equal(originalHouses.find(house => house.id === 'sil-belmore')?.accessible, true, 'Belmore must show the accessible sign');
  try {
    await prisma.$transaction(async tx => {
      const house = await tx.silHouse.create({ data: {
        address: 'Local database verification', image: originalHouses[0].image,
        bedrooms: 1, bathrooms: 1, parking: 0,
      } });
      const updated = await tx.silHouse.update({ where: { id: house.id }, data: { bedrooms: 2 } });
      assert.equal(updated.bedrooms, 2);
      assert.equal((await tx.silHouse.findUniqueOrThrow({ where: { id: house.id } })).bedrooms, 2);
      await tx.silHouse.delete({ where: { id: house.id } });
      assert.equal(await tx.silHouse.findUnique({ where: { id: house.id } }), null);
      throw rollback;
    });
  } catch (error) { if (error !== rollback) throw error; }
  console.log(`Local database verified: all application tables accessible; ${counts[5]} SIL houses; CRUD transaction passed without retaining test data.`);
} finally {
  await prisma.$disconnect();
}

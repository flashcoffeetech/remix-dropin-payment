import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const orderData = [
  {
    name: 'Mildrid Roseman',
    amount: 1000,
  },
  {
    name: 'Eveline Cumberbatch',
    amount: 2000,
  },
  {
    name: 'Skye Wenman',
    amount: 3000,
  },
  {
    name: 'Linette Branni',
    amount: 4000,
  },
  {
    name: 'Ulysses Olufsen',
    amount: 5000,
  },
  {
    name: 'Ketti Mechic',
    amount: 6000,
  },
  {
    name: 'Melloney Muckley',
    amount: 7000,
  },
  {
    name: 'Angelia Arnholtz',
    amount: 8000,
  },
  {
    name: 'Leyla Carnegie',
    amount: 9000,
  },
  {
    name: 'Bliss Odhams',
    amount: 10000,
  },
];

const seed = async () => {
  await Promise.all(
    orderData.map((order) => {
      return db.order.create({ data: order });
    }),
  );
};

seed();

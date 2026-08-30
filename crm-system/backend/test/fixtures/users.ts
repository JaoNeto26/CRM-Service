export const createUserPayload = {
  email: 'user@prisma.io',
  name: 'Prisma fan',
  active: true,
  createdAt: new Date('2026-08-29T09:00:00.000Z'),
  updatedAt: new Date('2026-08-29T09:30:00.000Z'),
  taxID: '123456789',
  phone: '1234567890',
};

export const createdUserMock = {
  ...createUserPayload,
  id: '1',
  taxId: null,
};

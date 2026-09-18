export const createAppointmentPayload = {
  company: { connect: { id: 'company-1' } },
  customer: { connect: { id: 'customer-1' } },
  startAt: new Date('2026-08-29T10:00:00.000Z'),
  endAt: new Date('2026-08-29T11:00:00.000Z'),
  status: 'scheduled' as const,
  totalAmount: null,
  cancellationReason: null,
  reminderSent: false,
  reminderSentAt: null,
};

export const createdAppointmentMock = {
  id: '1',
  companyId: 'company-1',
  customerId: 'customer-1',
  startAt: createAppointmentPayload.startAt,
  endAt: createAppointmentPayload.endAt,
  status: 'scheduled' as const,
  totalAmount: null,
  cancellationReason: null,
  reminderSent: false,
  reminderSentAt: null,
  createdAt: new Date('2026-08-29T09:00:00.000Z'),
  updatedAt: new Date('2026-08-29T09:30:00.000Z'),
};

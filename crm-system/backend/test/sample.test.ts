import { expect, it, vi } from 'vitest';
import { createAppointment, createUser } from '../src/script';
import prisma from '../src/lib/__mocks__/prisma';
import { createUserPayload, createdUserMock } from './fixtures/users';
import { createAppointmentPayload, createdAppointmentMock } from './fixtures/appointments';

vi.mock('../src/lib/prisma');

it('createUser should return the generated user object', async () => {
    prisma.usuario.create.mockResolvedValue(createdUserMock);

    const user = await createUser(createUserPayload);

    expect(user).toStrictEqual(createdUserMock);
});

it('createAppointment should return the generated appointment object', async () => {
    prisma.appointment.create.mockResolvedValue(createdAppointmentMock);

    const appointment = await createAppointment(createAppointmentPayload);

    expect(appointment).toStrictEqual(createdAppointmentMock);
});
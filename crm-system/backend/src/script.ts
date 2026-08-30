import { Prisma } from '../generated/prisma_client';
import prisma from './lib/prisma';

export const createUser = async (user: Prisma.usuarioCreateInput) => {
    return await prisma.usuario.create({
        data: user,
    });
}

export const createAppointment = async (appointment: Prisma.AppointmentCreateInput) => {
    return await prisma.appointment.create({
        data: appointment,
    });
}
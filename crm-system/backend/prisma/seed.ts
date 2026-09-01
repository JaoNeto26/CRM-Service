import {
    AppointmentStatus,
    DayOfWeek,
    PaymentMethod,
    PaymentStatus,
    PrismaClient,
    SubscriptionStatus,
} from "../generated/prisma_client";

import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("Criando dados de teste...");

    // =========================================================
    // USUÁRIO
    // =========================================================

    const user = await prisma.usuario.upsert({
        where: {
            email: "teste@crm.com",
        },
        update: {},
        create: {
            name: "Usuário Teste",
            email: "teste@crm.com",
            phone: "84999999999",
            active: true,
        },
    });

    // =========================================================
    // EMPRESA
    // =========================================================

    const company = await prisma.company.upsert({
        where: {
            userId: user.id,
        },
        update: {},
        create: {
            userId: user.id,
            name: "Barbearia Teste",
            address: "Rua Principal, 123",
            district: "Centro",
            city: "Mossoró",
            state: "RN",
            postalCode: "59600-000",
            phone: "8433333333",
            email: "contato@barbeariateste.com",
            instagram: "@barbeariateste",
            active: true,
        },
    });

    // =========================================================
    // SERVIÇOS
    // =========================================================

    const corte = await prisma.service.create({
        data: {
            companyId: company.id,
            name: "Corte de cabelo",
            price: 30.0,
            duration: 30,
            active: true,
        },
    });

    const barba = await prisma.service.create({
        data: {
            companyId: company.id,
            name: "Barba",
            price: 20.0,
            duration: 20,
            active: true,
        },
    });

    const corteBarba = await prisma.service.create({
        data: {
            companyId: company.id,
            name: "Corte + Barba",
            price: 45.0,
            duration: 50,
            active: true,
        },
    });

    // =========================================================
    // CLIENTES
    // =========================================================

    const customer1 = await prisma.customer.upsert({
        where: {
            companyId_googleId: {
                companyId: company.id,
                googleId: "google-test-001",
            },
        },
        update: {},
        create: {
            companyId: company.id,
            name: "João Silva",
            email: "joao@gmail.com",
            googleId: "google-test-001",
            active: true,
        },
    });

    const customer2 = await prisma.customer.upsert({
        where: {
            companyId_googleId: {
                companyId: company.id,
                googleId: "google-test-002",
            },
        },
        update: {},
        create: {
            companyId: company.id,
            name: "Maria Oliveira",
            email: "maria@gmail.com",
            googleId: "google-test-002",
            active: true,
        },
    });

    const customer3 = await prisma.customer.upsert({
        where: {
            companyId_googleId: {
                companyId: company.id,
                googleId: "google-test-003",
            },
        },
        update: {},
        create: {
            companyId: company.id,
            name: "Pedro Santos",
            email: "pedro@gmail.com",
            googleId: "google-test-003",
            active: true,
        },
    });

    // =========================================================
    // HORÁRIO DE FUNCIONAMENTO
    // =========================================================

    const weekdays = [DayOfWeek.monday, DayOfWeek.tuesday, DayOfWeek.wednesday, DayOfWeek.thursday, DayOfWeek.friday];

    for (const weekday of weekdays) {
        await prisma.businessHour.upsert({
            where: {
                companyId_weekday: {
                    companyId: company.id,
                    weekday,
                },
            },
            update: {},
            create: {
                companyId: company.id,
                weekday,
                opensAt: new Date("1970-01-01T08:00:00"),
                closesAt: new Date("1970-01-01T18:00:00"),
                closed: false,
            },
        });
    }

    await prisma.businessHour.upsert({
        where: {
            companyId_weekday: {
                companyId: company.id,
                weekday: DayOfWeek.saturday,
            },
        },
        update: {},
        create: {
            companyId: company.id,
            weekday: DayOfWeek.saturday,
            opensAt: new Date("1970-01-01T08:00:00"),
            closesAt: new Date("1970-01-01T12:00:00"),
            closed: false,
        },
    });

    await prisma.businessHour.upsert({
        where: {
            companyId_weekday: {
                companyId: company.id,
                weekday: DayOfWeek.sunday,
            },
        },
        update: {},
        create: {
            companyId: company.id,
            weekday: DayOfWeek.sunday,
            closed: true,
        },
    });

    // =========================================================
    // AGENDAMENTOS
    // =========================================================

    const appointment1 = await prisma.appointment.create({
        data: {
            companyId: company.id,
            customerId: customer1.id,
            startAt: new Date("2026-08-29T09:00:00"),
            endAt: new Date("2026-08-29T09:30:00"),
            status: AppointmentStatus.scheduled,
            totalAmount: 30.0,

            services: {
                create: {
                    serviceId: corte.id,
                    priceAtBooking: 30.0,
                    durationAtBooking: 30,
                },
            },
        },
    });

    const appointment2 = await prisma.appointment.create({
        data: {
            companyId: company.id,
            customerId: customer2.id,
            startAt: new Date("2026-08-29T10:00:00"),
            endAt: new Date("2026-08-29T10:50:00"),
            status: AppointmentStatus.completed,
            totalAmount: 45.0,

            services: {
                create: {
                    serviceId: corteBarba.id,
                    priceAtBooking: 45.0,
                    durationAtBooking: 50,
                },
            },
        },
    });

    const appointment3 = await prisma.appointment.create({
        data: {
            companyId: company.id,
            customerId: customer3.id,
            startAt: new Date("2026-08-29T11:00:00"),
            endAt: new Date("2026-08-29T11:20:00"),
            status: AppointmentStatus.waiting,
            totalAmount: 20.0,

            services: {
                create: {
                    serviceId: barba.id,
                    priceAtBooking: 20.0,
                    durationAtBooking: 20,
                },
            },
        },
    });

    // =========================================================
    // PAGAMENTO
    // =========================================================

    const payment = await prisma.payment.create({
        data: {
            appointmentId: appointment2.id,
            companyId: company.id,
            amount: 45.0,
            method: PaymentMethod.pix,
            installments: 1,
            status: PaymentStatus.paid,
            transactionId: "PIX-TEST-001",
            paidAt: new Date("2026-08-29T10:55:00"),
            processedBy: user.id,
            notes: "Pagamento de teste",
        },
    });

    // =========================================================
    // TRANSAÇÃO FINANCEIRA
    // =========================================================

    await prisma.financialTransaction.create({
        data: {
            companyId: company.id,
            paymentId: payment.id,
            category: "Serviço",
            description: "Pagamento Corte + Barba",
            amount: 45,
            transactionDate: new Date("2026-08-29T00:00:00.000Z"),
            type: "income",
        },
    });

    // =========================================================
    // PLANO
    // =========================================================

    const plan = await prisma.subscriptionPlan.create({
        data: {
            name: "Plano Profissional",
            description: "Plano para pequenos negócios",
            monthlyPrice: 49.9,
            annualPrice: 499.0,
            maxCustomers: 500,
            maxAppointmentsPerMonth: 1000,
            features: {
                agenda: true,
                pagamentos: true,
                clientes: true,
                relatorios: true,
            },
            active: true,
        },
    });

    // =========================================================
    // ASSINATURA
    // =========================================================

    await prisma.subscription.create({
        data: {
            userId: user.id,
            planId: plan.id,
            status: SubscriptionStatus.active,
            startDate: new Date("2026-08-01"),
            endDate: new Date("2027-08-01"),
        },
    });

    console.log("");
    console.log("Seed criado com sucesso!");
    console.log("");
    console.log("USUÁRIO:");
    console.log(user.id);
    console.log("");
    console.log("EMPRESA:");
    console.log(company.id);
    console.log("");
    console.log("CLIENTES:");
    console.log(customer1.id);
    console.log(customer2.id);
    console.log(customer3.id);
    console.log("");
    console.log("SERVIÇOS:");
    console.log(corte.id);
    console.log(barba.id);
    console.log(corteBarba.id);
    console.log("");
    console.log("AGENDAMENTOS:");
    console.log(appointment1.id);
    console.log(appointment2.id);
    console.log(appointment3.id);
}

main()
    .catch(error => {
        console.error("Erro ao executar seed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

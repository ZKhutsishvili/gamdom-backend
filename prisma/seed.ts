import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.event.deleteMany({})

  // Create sample events
  const events = [
    {
      name: "Champions League Final 2024",
      odds: 1.95,
    },
    {
      name: "World Cup 2026 - Opening Match",
      odds: 2.10,
    },
    {
      name: "NBA Finals 2024 - Game 1",
      odds: 1.85,
    },
    {
      name: "Wimbledon 2024 - Men's Final",
      odds: 1.75,
    },
    {
      name: "F1 Monaco Grand Prix 2024",
      odds: 2.25,
    },
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event,
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
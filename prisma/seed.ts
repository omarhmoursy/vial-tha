import { PrismaClient } from '@prisma/client'

import { getSeedData } from './data'

const client = new PrismaClient()

const deleteAllRecords = async () => {
  // Deletion order is important due to non-null relation constraints.

  await client.formData.deleteMany()

  console.log('All records deleted')
}

const createAllRecords = async () => {
  // Deletion order is important due to non-null relation constraints.
  const data = await getSeedData()
  await client.formData.createMany({ data: data.formData })

  console.log('All records created')
}

async function seed() {
  await deleteAllRecords()
  await createAllRecords()
}

seed()
  .then(async () => {
    await client.$disconnect()
    console.log('database disconnected')
    process.exit(0)
  })
  .catch(async e => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })

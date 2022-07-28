import { faker } from "@faker-js/faker"
import type { Prisma } from "@prisma/client"
import { db } from "~/services/db.server"

async function seed() {
  await db.review.deleteMany()
  await db.manager.deleteMany()
  await db.user.deleteMany()

  for (let data of managers()) {
    await db.manager.create({ data })
  }
}

seed()

let managers = (): Prisma.ManagerCreateInput[] =>
  Array.from({ length: 10 }, (_, i) => ({
    fullName: faker.name.findName(),
    headline: faker.name.jobTitle() + " at " + faker.company.companyName(),
    picture: faker.image.avatar(),
    memberId: faker.datatype.string(),
    url: faker.internet.url(),
    reviews: {
      create: Array.from({ length: i }, () => ({
        rating: faker.datatype.number({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
        q1: faker.datatype.number({ min: 1, max: 5 }),
        q2: faker.datatype.number({ min: 1, max: 5 }),
        q3: faker.datatype.number({ min: 1, max: 5 }),
        q4: faker.datatype.number({ min: 1, max: 5 }),
        q5: faker.datatype.number({ min: 1, max: 5 }),
        q6: faker.datatype.number({ min: 1, max: 5 }),
        q7: faker.datatype.number({ min: 1, max: 5 }),
        q8: faker.datatype.number({ min: 1, max: 5 }),
        q9: faker.datatype.number({ min: 1, max: 5 }),
        q10: faker.datatype.number({ min: 1, max: 5 }),
        q11: faker.datatype.number({ min: 1, max: 5 }),
        q12: faker.datatype.number({ min: 1, max: 5 }),
        user: { create: { memberId: faker.datatype.string() } },
      })),
    },
  }))

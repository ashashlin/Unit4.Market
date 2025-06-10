import { faker } from "@faker-js/faker";
import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // seed 2 users
  for (let i = 0; i < 2; i++) {
    const username = faker.internet.username();
    const password = faker.internet.password();
    console.log(username, password);

    await createUser(username, password);
  }

  // seed 10 products
  const productTitles = [];

  for (let i = 0; i < 10; i++) {
    let title = faker.commerce.productName();
    while (productTitles.includes(title)) {
      title = faker.commerce.productName();
    }
    productTitles.push(title);

    const description = faker.commerce.productDescription();
    const price = faker.commerce.price();

    await createProduct(title, description, price);
  }

  // seed 2 orders, one for each user
  for (let i = 0; i < 2; i++) {
    const date = faker.date.past();
    const note = faker.lorem.paragraph();
    const userId = i + 1;

    await createOrder(date, userId, note);
  }

  // seed order 1 with 5 distinct products
  for (let i = 0; i < 5; i++) {
    const orderId = 1;
    const productId = i + 1;
    const quantity = 1;

    await createOrderProduct(orderId, productId, quantity);
  }

  // seed order 2 with 2 distinct products
  for (let i = 5; i < 7; i++) {
    const orderId = 2;
    const productId = i + 1;
    const quantity = 2;

    await createOrderProduct(orderId, productId, quantity);
  }
}

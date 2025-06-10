import db from "#db/client";

export async function createProduct(title, description, price) {
  const sql = `
    INSERT INTO products(
      title,
      description,
      price
    )
    VALUES(
      $1,
      $2,
      $3
    )
    RETURNING *;
  `;
  const {
    rows: [product],
  } = await db.query(sql, [title, description, price]);

  return product;
}

export async function getProducts() {
  const sql = `
    SELECT * FROM products;
  `;
  const { rows: products } = await db.query(sql);

  return products;
}

export async function getProductById(id) {
  const sql = `
    SELECT * FROM products
    WHERE id = $1;
  `;
  const {
    rows: [product],
  } = await db.query(sql, [id]);

  return product;
}

export async function getProductsByOrderId(orderId) {
  const sql = `
    SELECT p.*
    FROM orders_products op
    JOIN products p
      ON op.product_id = p.id
    WHERE op.order_id = $1;
  `;
  const { rows: products } = await db.query(sql, [orderId]);

  return products;
}

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

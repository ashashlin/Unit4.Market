import db from "#db/client";

export async function createOrder(date, userId, note = null) {
  const sql = `
    INSERT INTO orders(
      date,
      user_id,
      note
    )
    VALUES(
      $1,
      $2,
      $3
    )
    RETURNING *;
  `;
  const {
    rows: [order],
  } = await db.query(sql, [date, userId, note]);

  return order;
}

export async function getOrdersByProductId(productId, userId) {
  const sql = `
    SELECT o.id
    FROM orders_products op
    JOIN orders o
      ON op.order_id = o.id
    WHERE op.product_id = $1
      AND o.user_id = $2;
  `;
  const { rows: orders } = await db.query(sql, [productId, userId]);

  return orders;
}

export async function getOrdersByUserId(userId) {
  const sql = `
    SELECT * FROM orders
    WHERE user_id = $1;
  `;
  const { rows: orders } = await db.query(sql, [userId]);

  return orders;
}

export async function getOrderById(id) {
  const sql = `
    SELECT * FROM orders
    WHERE id = $1;
  `;
  const {
    rows: [order],
  } = await db.query(sql, [id]);

  return order;
}

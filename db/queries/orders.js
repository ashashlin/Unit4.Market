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

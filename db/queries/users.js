import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  const sql = `
    INSERT INTO users(
      username,
      password
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;

  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);

  // only modifies the user obj. won't modify anything in the db
  delete user.password;
  return user;
}

export async function getUserByUsername(username, password) {
  const sql = `
    SELECT * FROM users
    WHERE username = $1;
  `;

  const {
    rows: [user],
  } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  delete user.password;
  return user;
}

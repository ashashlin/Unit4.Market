import express from "express";
import requireBody from "#middleware/requireBody";
import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";

const usersRouter = express.Router();

usersRouter.use(requireBody(["username", "password"]));

// POST /users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // create a user in the db
    const user = await createUser(username, password);
    // create and send the access token
    const payload = { id: user.id };
    const accessToken = createToken(payload);
    res.status(201).send({ accessToken });
  } catch (error) {
    next(error);
  }
});

// POST /users/login
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // check if user exists and verify the password
    const user = await getUserByUsername(username, password);
    if (!user)
      return res.status(401).send("Error: invalid username or password.");

    // create and send the access token
    const payload = { id: user.id };
    const accessToken = createToken(payload);
    res.send({ accessToken });
  } catch (error) {
    next(error);
  }
});

export default usersRouter;

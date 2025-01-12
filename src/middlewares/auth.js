import jwt from "jsonwebtoken"
import User from "../models/User.model.js"

const auth = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header.
    // Assumes the token is sent as "Bearer <token>".
    const token = req.header("Authorization").replace("Bearer ", "");

    // Decode and verify the token using the secret key.
    // Ensures the token is valid and hasn't been tampered with.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database:
    // - Matches the user's `_id` from the decoded token.
    // - Verifies the token exists in the `tokens` array of the user document.
    // - findOne is used instead of findById because the query requires  matching multiple criteria, not just the user's _id
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    // If no matching user is found, throw an error to stop authentication.
    if (!user) throw new Error();

    // Attach the user instance to the `req` object for further use in the request lifecycle.
    req.user = user;
    req.token=token
    // Pass control to the next middleware or route handler.
    next();
  } catch (err) {
    // If an error occurs (e.g., token is invalid, expired, or user not found):
    // - Respond with a 503 status and an error message indicating authentication is required.
    res.status(503).send({ err: "Please authenticate." });
  }
};

export default auth
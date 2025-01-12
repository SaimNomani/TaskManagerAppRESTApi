import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import sharp from "sharp";

import { sendWelcome, sendCancellation } from "../emails/account.js";

import User from "../models/User.model.js";

import auth from "../middlewares/auth.js";

const router = new express.Router();

router.post("/", async (req, res) => {
  // console.log(req.body);

  const newUser = new User(req.body);
  try {
    const createdUser = await newUser.save();
    sendWelcome(createdUser.name, createdUser.email)
    const token = await createdUser.generateToken();
    res.status(201).send({ createdUser, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    // Call the static method with the email and password from the request body
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token }); // Send the authenticated user as a response
  } catch (err) {
    res.status(400).send(); // Respond with a 400 status code for errors
  }
});

// POST request to log out the user
router.post("/logout", auth, async (req, res) => {
  try {
    // Filter out the token that matches the current token from the user's tokens array
    // This removes the current session's token from the database
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    // Save the updated user document (with the removed token) to the database
    await req.user.save();

    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

// Other users should not have the privilege to access accounts belonging to other users using their IDs.
// router.get("/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send();
//   }
// });

router.patch("/:id", async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const validUpdates = ["name", "age", "email", "password"];
  const isValidUpdate = requestedUpdates.every((update) =>
    validUpdates.includes(update.toLowerCase())
  );

  if (!isValidUpdate)
    return res.status(400).send({ error: "Invalid updates." });

  try {
    // The following line was initially used to update the user in one go:
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,  // Ensures that the updated document is returned
    //   runValidators: true,  // Ensures that Mongoose validators run for the update
    // });

    // This approach is commented out because it bypasses any pre-save middleware that might be defined on the User model (e.g., password hashing).
    // We need to handle updates manually to ensure middleware (like password hashing) runs correctly.

    const user = await User.findById(req.params.id); // Fetch the user first by ID
    // console.log(user)

    // If the user is not found, return a 404 status code indicating the resource doesn't exist
    if (!user) return res.status(404).send();

    // 'requestedUpdates' is assumed to be an array of fields that should be updated in the user document
    // Loop through the requested updates and update each field of the user object
    requestedUpdates.forEach((update) => (user[update] = req.body[update]));

    // Save the updated user document, which will trigger any relevant middleware (e.g., password hashing)
    const updatedUser = await user.save(); // This approach ensures that pre-save middleware is executed

    // Send the updated user document back as a response
    res.send(updatedUser);
  } catch (error) {
    // Handle any errors that occur during the try block execution
    res.status(500).send(error);
  }
});

// Other users should not have the privilege to delete accounts belonging to other users using their IDs.
//
// router.delete("/:id", async (req, res) => {
//   try {
//     const userToDelete = await User.findByIdAndDelete(req.params.id);

//     if (!userToDelete) return res.status(404).send();

//     res.send(userToDelete);
//   } catch (err) {
//     res.status(500).send();
//   }
// });

// Define a DELETE route to delete the logged-in user ("/me" refers to the current user)
router.delete("/me", auth, async (req, res) => {
  try {
    // The `auth` middleware ensures that only authenticated users can access this route.
    // `req.user` will contain the logged-in user (populated by the authentication middleware).

    // Call `deleteOne()` on the user document to delete it from the database.
    // This method is a Mongoose document method that removes the document from the database.
    await req.user.deleteOne();
    sendCancellation(req.user.name, req.user.email)

    // Send the removed user data back as the response (could include information about the deleted user).
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

const upload = multer({
  // dest: "avatars",  // This line is commented out because specifying a destination saves the file
  // directly to the specified folder on the server. By commenting it out,
  // Multer will pass the file to the request object,
  //  allowing further processing (e.g., saving to a database or manipulating before storing).
  limits: {
    fileSize: 1000000, // Limit the file size to 1MB to prevent users from uploading excessively large files,
    //  which could consume server resources.
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("file must be png or jpg")); // Ensure only image files with extensions .png, .jpg, or .jpeg
    }
    cb(undefined, true); // Proceed with the upload if the file type is valid.
  },
});

router.post(
  "/me/avatar", // Endpoint for uploading a user's avatar.
  auth, // Middleware to ensure the user is authenticated before proceeding.
  upload.single("avatar"), // Middleware to handle the file upload. It expects a single file with the field name "avatar".
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer) // Use the Sharp library to process the image buffer.
        .resize({ width: 250, height: 250 }) // Resize the image to 250x250 pixels to maintain a consistent avatar size.
        .png() // Convert the image to PNG format.
        .toBuffer(); // Convert the modified image back to a buffer for storage.
      req.user.avatar = buffer; // Store the processed image buffer in the user's `avatar` field.
      await req.user.save(); // Save the updated user information to the database.
      res.send(); // Send a response indicating the upload was successful.
    } catch (error) {
      res.status(400).send({ error: error.message }); // Send a 400 error response if something goes wrong during the process.
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message }); // Error handling middleware to catch and send any errors
    //that occur during the file upload or image processing.
  }
);

router.delete("/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fetch the user by ID from the database using the ID parameter in the request URL.
    if (!user || !user.avatar) {
      // Check if the user exists and if the user has an avatar.
      res.status(404).send(); // If either condition is not met, send a 404 response indicating the resource was not found.
    }
    res.set("Content-Type", "image/png"); // Set the response header to indicate the content type is an image in PNG format.
    res.send(user.avatar); // Send the user's avatar image as the response.
  } catch (err) {
    res.status(400).send(); // If an error occurs during the process, send a 400 response indicating a bad request.
  }
});

export default router;

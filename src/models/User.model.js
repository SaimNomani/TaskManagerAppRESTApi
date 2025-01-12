import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Task from "./Task.model.js"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      validate: {
        validator: function (age) {
          return age >= 0;
        },
        message: `age must be positive`,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (email) {
          return validator.isEmail(email);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // minLength:7,

      validate: [
        {
          validator: function (password) {
            return password.length > 6;
          },
          message: (props) =>
            `password: '${props.value}' is less than 7 characters`,
        },
        {
          validator: function (password) {
            return !password.toLowerCase().includes("password");
          },
          message: (props) =>
            console.log(
              `password: '${props.value}' contains the string 'password'`
            ),
        },
      ],
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.methods = {
  generateToken: async function () {
    const user = this; // Reference to the current user document.

    // Generate a JWT with the user's unique _id as the payload.
    // The token is signed with a secret key "keepitsecret" and has an expiration time of 1 hour.
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Add the new token to the user's `tokens` array.
    user.tokens.push({ token });

    // Save the updated user instance to the database to persist the token.
    await user.save();

    // Return the newly generated token to the caller.
    return token;
  },
  toJSON: function () {
    // Save the current Mongoose document (this) into a variable `user`
    const user = this;

    // Convert the Mongoose document to a plain JavaScript object
    // This removes all Mongoose-specific properties and methods
    const userObject = user.toObject();

    // Delete the `password` field from the plain object to prevent it
    // from being included in the JSON output. This is important for security.
    delete userObject.password;

    // Delete the `tokens` field from the plain object to prevent it
    // from being included in the JSON output. This prevents exposing session tokens.
    delete userObject.tokens;

    delete userObject.avatar;

    // Return the modified plain object. This object will be used
    // whenever the Mongoose document is serialized to JSON,
    // such as when sending it in an API response.
    return userObject;
  },
};

// Adding a custom static method to the schema to find a user by credentials
userSchema.statics = {
  findByCredentials: async (email, password) => {
    // Search for a user in the database by email
    const user = await User.findOne({ email }, {});
    if (!user) throw new Error("Unable to login"); // Throw error if no user is found

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch); // Debugging log for password match status

    if (!isMatch) throw new Error("Unable to login"); // Throw error if the password doesn't match

    return user; // Return the authenticated user
  },
};

// Pre-save middleware for the 'user' schema
userSchema.pre("save", async function (next) {
  // 'this' refers to the current document (user) being saved
  const user = this;

  // Check if the password field has been modified (to prevent hashing if it's not changed)
  if (user.isModified("password")) {
    // Hash the new password using bcrypt with a salt round value of 8
    user.password = await bcrypt.hash(user.password, 8);
  }

  // Proceed to the next middleware or save operation after password modification
  next();
});

// pre("save"): Always operates on the document, so this refers to the document being saved.
// deleteOne: By default, this refers to the query; specify { document: true } to work with the document.

// userSchema.pre("deleteOne", { document: true }, async function (next) {
//   const user = this; // 'this' refers to the document
//   await Task.deleteMany({ createdBy: user._id });
//   next();
// });

userSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc, next) {
    // `doc` refers to the document being deleted
    await Task.deleteMany({ createdBy: doc._id });
    next();
  }
);

const User = mongoose.model("User", userSchema);

export default User;

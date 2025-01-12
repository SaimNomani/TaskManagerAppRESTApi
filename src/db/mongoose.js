//////////////////////////////////////////////////////////////////////////////////
// *******************SECTION: MONGOOSE*******************
// *******************lecture 1: SETTINGUP MONGOOSE AND CREATING SCHEMA AND MODELS*******************
//////////////////////////////////////////////////////////////////////////////////

import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => console.log(`connected to mongodb server`))
  .catch((err) => console.log(`error in connecting mongodb server: ${err}`));

// const user1 = new User({ name: "jacob", age: 12 });
// const user2 = new User({
//   name: "   s meed",
//   age: 3,
//   email: "SMEED@gmail.com",
// });

// const user3 = new User({
//   name: "Sam",
//   age: 3,
//   email: "Sam@gmail.com",
//   password: "Sam0987ty",
// });

// user1
//   .save()
//   .then((result) => console.log(`user saved to mongodb, `, result))
//   .catch((err) => console.log(`error in saving user: ${err}`));

// user2
//   .save()
//   .then((result) => console.log(`user saved to mongodb, `, result))
//   .catch((err) => console.log(`error in saving user: ${err}`));

// user3
//   .save()
//   .then((result) => console.log(`user saved to mongodb, `, result))
//   .catch((err) => console.log(`error in saving user: ${err}`));

// const task1 = new Task({ description: `book reading for 30 min` });

// task1
//   .save()
//   .then((result) => console.log(`task successfully added, `, result))
//   .catch((err) => console.log(`error in adding task `, err))
//   .finally(() =>
//     mongoose
//       .disconnect()
//       .then(() => console.log(`successfully disconnected`))
//       .catch((err) => console.log(err))
//   );

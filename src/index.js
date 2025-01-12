import "dotenv/config";

import express from "express";
import "./db/mongoose.js";
import userRouter from "./routers/user.router.js";
import taskRouter from "./routers/task.router.js";
import Task from "./models/Task.model.js";
import User from "./models/User.model.js";

const app = express();


app.use(express.json());

app.use("/users", userRouter);
app.use(taskRouter); // OR app.use("/tasks",taskRouter); and remove /tasks form specific router files

app.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`);
});

// *******************PLAYGROUND*******************************
// const main = async () => {
//   // const task = await Task.findById("677b1035b56a85e676a15d6b");
//   // await task.populate("createdBy");
//   // console.log(task.createdBy);

//   const user = await User.findById("677b0e2e9a2dab351567bb92").populate(
//     "tasks"
//   );
//   // `user.tasks` will now contain an array of all tasks created by this user.
//   console.log(user.tasks);
// };

// main();

// app.post("/users", (req, res) => {
//   console.log(req.body);

//   const newUser = new User(req.body);

//   newUser
//     .save()
//     .then((result) => res.status(201).send(result))
//     .catch((err) => res.status(400).send(err));
// });

// app.get("/users", (req, res) => {
//   User.find({}, {})
//     .then((result) => res.send(result))
//     .catch((err) => res.status(500).send());
// });

// app.get("/users/:id", (req, res) => {
//   const _id = req.params.id;

//   User.findById(_id)
//     .then((result) => {
//       if (!result) {
//         return res.status(404).send();
//       }
//       res.send(result);
//     })
//     .catch((err) => res.status(500).send());
// });

// app.post("/tasks", (req, res) => {
//   console.log(req.body);

//   const newTask = new Task(req.body);

//   newTask
//     .save()
//     .then((result) => res.status(201).send(result))
//     .catch((err) => res.status(400).send(err));
// });

// app.get("/tasks", (req, res) => {
//   Task.find({}, {})
//     .then((result) => res.send(result))
//     .catch((err) => res.status(500).send());
// });

// app.get("/tasks/:id", (req, res) => {
//   const _id = req.params.id;

//   Task.findById(_id)
//     .then((result) => {
//       if (!result) {
//         res.status(404).send();
//       }
//       res.send(result);
//     })
//     .catch((err) => res.status(500).send());
// });
// const multer = require("multer");

// const upload = multer({ dest: 'images' });

// app.post("/upload", upload.single('upload'), (req,res)=>{
//   res.send()
// })

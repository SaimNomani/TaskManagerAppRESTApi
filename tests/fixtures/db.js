import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../../src/models/User.model.js";
import Task from "../../src/models/Task.model.js";

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
  _id: user1Id,
  name: "saim",
  age: 22,
  email: "saim@example.com",
  password: "saim123",
  tokens: [{ token: jwt.sign({ _id: user1Id }, process.env.JWT_SECRET) }],
};

const user2Id = new mongoose.Types.ObjectId();
const user2 = {
  _id: user2Id,
  name: "sams",
  age: 22,
  email: "sams@example.com",
  password: "sams123",
  tokens: [{ token: jwt.sign({ _id: user2Id }, process.env.JWT_SECRET) }],
};

const task1 = {
  _id: new mongoose.Types.ObjectId(),
  description: "task1",
  completed: false,
  createdBy: user1._id,
};

const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: "task2",
  completed: true,
  createdBy: user1._id,
};

const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: "task3",
  completed: false,
  createdBy: user2._id,
};

const setupDB = async function () {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(user1).save();
  await new User(user2).save();
  await new Task(task1).save();
  await new Task(task2).save();
  await new Task(task3).save();
};

export { user1, user1Id, user2, user2Id, task1, task2, task3, setupDB };

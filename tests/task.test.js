import Task from "../src/models/Task.model.js";
import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";

import {
  user1,
  user1Id,
  setupDB,
  user2,
  user2Id,
  task1,
  task2,
  task3,
} from "./fixtures/db.js";

beforeEach(setupDB);

afterAll(async () => {
  await mongoose.connection.close();
});

test("should create task for authenticated user", async function () {
  try {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${user1.tokens[0].token}`)
      .send({ description: "Have fun" })
      .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

    expect(task.completed).toEqual(false);
  } catch (err) {
    console.log(err.message);
  }
});

test("Request all tasks for user1", async function () {
  const resonse = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);

  expect(resonse.body.length).toEqual(2);
});

test("Should not delete other user's tasks", async function () {
  const response = await request(app)
    .delete(`/tasks/${task1._id}`)
    .set("Authorization", `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)

    const task= await Task.findById(task1._id)

    expect(task).not.toBeNull()
    
});

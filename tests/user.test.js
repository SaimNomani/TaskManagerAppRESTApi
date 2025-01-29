import app from "../src/app.js";
import request from "supertest";
import User from "../src/models/User.model.js";
import { user1, user1Id, setupDB } from "./fixtures/db.js";
import mongoose from "mongoose";



beforeEach(setupDB);

afterAll(async () => {
  await mongoose.connection.close();
});

test("should signup new user", async function () {
  const response = await request(app)
    .post("/users")
    .send({
      name: "james",
      age: 22,
      email: "james@example.com",
      password: "james123",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);

  // assertion about database was changed correctly
  expect(user).not.toBeNull();

  // assertion about the response
  expect(response.body).toMatchObject({
    user: {
      name: "james",
      email: "james@example.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("james123");
});

test("should login the existing user", async function () {
  const response = await request(app)
    .post("/users/login")
    .send({ email: user1.email, password: user1.password })
    .expect(200);

  const user = await User.findById(user1Id);
  expect(response.body.token).toBe(user.tokens[1].token);
});
test("should not login the nonexistent user", async function () {
  await request(app)
    .post("/users/login")
    .send({ email: "joe", password: "joe1234" })
    .expect(400);
});

test("should get profile for authenticated user", async function () {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated user", async function () {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for authenticated user", async function () {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(user1Id);

  expect(user).toBeNull();
});

test("should not delete account for unauthenticated user", async function () {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar", async function () {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/banner.png")
    .expect(200);

  const user = await User.findById(user1Id);

  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user field", async function () {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send({ name: "jess" }).expect(200)

    const user=await User.findById(user1Id)

    expect(user.name).toEqual("jess")

});

test("should not update invalid user field", async function () {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${user1.tokens[0].token}`)
    .send({ location: "karachi" }).expect(400)



});

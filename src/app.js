import express from "express";
import { connectDB } from "./db/mongoose.js";
import userRouter from "./routers/user.router.js";
import taskRouter from "./routers/task.router.js";


connectDB();

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use(taskRouter); // OR app.use("/tasks",taskRouter); and remove /tasks form specific router files

export default app
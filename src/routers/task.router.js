import express from "express"
import Task from "../models/Task.model.js"

import auth from "../middlewares/auth.js"

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  // old way of creating task without auth
  // const newTask = new Task(req.body);

  const newTask = new Task({
    ...req.body,
    createdBy: req.user._id,
  });

  try {
    const createdTask = await newTask.save();
    res.status(201).send(createdTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

// router.get("/tasks", async (req, res) => {
//   try {
//     const allTasks = await Task.find({}, {});
//     res.send(allTasks);
//   } catch (err) {
//     res.status(500).send();
//   }
// });
router.get("/tasks", auth, async (req, res) => {
  // Initialize an object to store filtering criteria
  const matchObj = {};

  // Initialize an object to store sorting criteria
  const sortObj = {};

  // Filtering: Add a filter for 'completed' status if provided in the query
  if (req.query.completed) {
    matchObj.completed = req.query.completed === "true";
  }

  // Sorting: Add sorting criteria based on 'sortBy' query parameter
  if (req.query.sortBy) {
    // Split the 'sortBy' query parameter into field and criteria (asc or desc)
    const [field, criteria] = req.query.sortBy.split(":");
    // Set sorting order: -1 for descending, 1 for ascending
    sortObj[field] = criteria === "desc" ? -1 : 1;
  }

  try {
    // ***************************another approach*********************************
    // const allTasks = await Task.find({ createdBy: req.user._id })
    //   .limit(parseInt(req.query.limit))      // Pagination: Limit the number of results
    //   .skip(parseInt(req.query.skip))        // Pagination: Skip results for pagination
    //   .sort(sortObj);                        // Sorting: Apply sorting based on criteria
        // **************************************************************************

    // Populate the 'tasks' associated with the authenticated user
    await req.user.populate({
      path: "tasks",        // Path to populate
      match: matchObj,      // Filtering: Apply the filter based on 'completed' status
      options: {
        limit: parseInt(req.query.limit), // Pagination: Limit the number of results returned
        skip: parseInt(req.query.skip),   // Pagination: Skip a number of results for pagination
        sort: sortObj,                    // Sorting: Apply the sorting criteria
      },
    });

    res.send(req.user.tasks);
  } catch (err) {
    res.status(500).send();
  }
});


// router.get("/tasks/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const task = await Task.findById(_id);
//     if (!task) {
//       return res.status(400).send();
//     }
//     res.send(task);
//   } catch (err) {
//     res.status(500).send();
//   }
// });

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, createdBy: req.user._id }, {});
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

// router.patch("/tasks/:id", async (req, res) => {
//   const requestedUpdates = Object.keys(req.body);
//   const validUpdates = ["description", "completed"];
//   const isValidUpdate = requestedUpdates.every((update) =>
//     validUpdates.includes(update.toLowerCase())
//   );

//   if (!isValidUpdate)
//     return res.status(400).send({ error: "Not a valid update" });

//   try {
//     const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedTask) return res.status(404).send();

//     res.send(updatedTask);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

router.patch("/tasks/:id", auth, async (req, res) => {
  const requestedUpdates = Object.keys(req.body);
  const validUpdates = ["description", "completed"];
  const isValidUpdate = requestedUpdates.every((update) =>
    validUpdates.includes(update.toLowerCase())
  );

  if (!isValidUpdate)
    return res.status(400).send({ error: "Not a valid update" });

  try {
    // const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) return res.status(404).send();

    requestedUpdates.forEach((update) => (task[update] = req.body[update]));

    const updatedTask = await task.save();

    res.send(updatedTask);
  } catch (err) {
    res.status(500).send(err);
  }
});

// router.delete("/tasks/:id", async (req, res) => {
//   try {
//     const taskToDelete = await Task.findByIdAndDelete(req.params.id);

//     if (!taskToDelete) return res.status(404).send();

//     res.send(taskToDelete);
//   } catch (err) {
//     res.status(500).send();
//   }
// });

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const taskToDelete = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!taskToDelete) return res.status(404).send();

    res.send(taskToDelete);
  } catch (err) {
    res.status(500).send();
  }
});

export default router;

//////////////////////////////////////////////////////////////////////////////////
// *******************lecture 1: connecting app to mongodb server*******************
//////////////////////////////////////////////////////////////////////////////////

// // Import the MongoDB driver
// const mongodb = require('mongodb');

// // Access the MongoClient object from the MongoDB driver
// const MongoClient = mongodb.MongoClient;

// // Define the connection URL for the MongoDB server (default localhost and port 27017)
// const connectionUrl = 'mongodb://127.0.0.1:27017';

// // Define the name of the database to work with
// const databaseName = 'task-app';

// // Log a message indicating that the connection attempt is starting
// console.log("Trying to connect...");

// // Connect to the MongoDB server
// MongoClient.connect(connectionUrl)
//   .then(client => {
//     // Log a message on successful connection to MongoDB
//     console.log("Successfully connected to MongoDB");

//     // Access the specified database
//     const db = client.db(databaseName);

//     // Insert a document into the 'users' collection
//     db.collection('users').insertOne({
//       name: "saim", // User's name
//       age: 22,      // User's age
//     });

//     // Close the MongoDB client connection
//     return client.close();
//   })
//   .then(() => {
//     // Log a message after the connection is successfully closed
//     console.log('Connection closed');
//   })
//   .catch(error => {
//     // Log an error message if the connection fails
//     console.error("Error connecting to MongoDB:", error);
//   });

//////////////////////////////////////////////////////////////////////////////////
// *******************lecture 2: crud operations*******************
//////////////////////////////////////////////////////////////////////////////////

// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// const connectionUrl = "mongodb://127.0.0.1:27017";
// const databaseName = "task-app";

// console.log("Trying to connect...");

// MongoClient.connect(connectionUrl)
//   .then((client) => {
//     console.log("Connected to MongoDB");

//     const db = client.db(databaseName); // Ensure you're using the correct database name

// ***********INSERT/CREATE***************

// // Insert a document into the 'users' collection
// return db
//   .collection("users")
//   .insertMany([
//     {
//       name: "saim", // User's name
//       age: 22, // User's age
//     },
//     {
//       name: "joe",
//       age: 25,
//     },
//     {
//       name: "john",
//       age: 27,
//     },
//   ])
//   .then((result) => {
//     console.log("users inserted with ID:", result.insertedIds); // Logs the inserted document ID
//   })
//   .catch((insertError) => {
//     console.error("Error inserting users:", insertError);
//   })
//   .finally(() => {
//     client.close();
//     console.log("Connection closed.");
//   });

// Insert a document into the 'tasks' collection
// return db
//   .collection("tasks")
//   .insertMany([
//     {
//       description: "Organize Workspace",
//       completed: true,
//     },
//     {
//       description: "Meal Preparation",
//       completed: true,
//     },
//     {
//       description: "john",
//       completed: false,
//     },
//   ])
//   .then((result) => {
//     console.log("users inserted with ID:", result.insertedIds); // Logs the inserted document ID
//   })
//   .catch((insertError) => {
//     console.error("Error inserting users:", insertError);
//   })
//   .finally(() => {
//     client.close();
//     console.log("Connection closed.");
//   });

// ***********READ/QUERY***************

// const { MongoClient, ObjectId } = require("mongodb");
import { MongoClient, ObjectId } from "mongodb";

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-app";

console.log("Trying to connect...");

MongoClient.connect(connectionUrl)
  .then((client) => {
    console.log("Connected to MongoDB");

    const db = client.db(databaseName);

    // return only first documnet
    // db.collection("tasks")
    //   .findOne()
    //   .then((data) => console.log(data))
    //   .catch((error) => console.log(error))
    //   .finally(() => client.close());

    //db.collection("users")

    // .findOne({name:"saim"}, {projection:{age:1}}) // First argument: Query filter (optional). Second argument: Projection (optional), used to control which fields are returned.
    // // .findOne({name:"saim"}, {projection:{age:0}}) //exclude age include rest
    // // .findOne({name:"saim"}, {projection:{name:1}}) //include name exckude rest, can not mix include/exclude for non id fields
    // // .findOne({name:"saim"}, {projection:{_id:0, name:1,age:1}})  //
    // .then((data) => console.log(data))
    // .catch((error) => console.log(error))
    // .finally(() => client.close());

    // db.collection("tasks")
    //   .findOne({ _id: new ObjectId("676f6a49bccba4867b64dade") }, {})
    //   .then((data) => console.log(data))
    //   .catch((error) => console.log(error))
    //   .finally(() => client.close());

    // // find return all documents that meet the query criteria
    // // it actually returns a cursor 
    // db.collection("tasks")
    //   .find({ completed: true }, {})
    //   .toArray()
    //   .then((data) => console.log(data))
    //   .catch((error) => console.log(error))
    //   .finally(() => client.close());

    // **********Update*****************

  //   // updateOne updates the first documents that meet the query criteria
  //   // $set is update operator
  //   db.collection("users")
  //     .updateOne({ name: "saim" }, {$set:{name:"james"}})
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error))
  //     .finally(() => client.close());
  // })

  // // updateMany updates all documents that meet the query criteria
  //   db.collection("tasks")
  //     .updateMany({ completed: false }, {$set:{completed:true}})
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error))
  //     .finally(() => client.close());
  // })
  // ***********deletion*****************
  // updateMany updates all documents that meet the query criteria
    db.collection("tasks")
      .deleteOne({ description: "walk for 30 min" })
      .then((result) => console.log(result))
      .catch((error) => console.log(error))
      .finally(() => client.close());
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB server:", error);
  });

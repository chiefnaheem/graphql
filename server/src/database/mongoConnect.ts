import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

require("dotenv").config();

export const connectDB = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://chiefnaheem:£NAHeem199@cluster0.styhr.mongodb.net/graphql-project?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
      )
      .then(() => {
        console.log("Connected to DB");
      });
  } catch (error) {
    console.log(error);
  }
};
export const connectTestDB = () => {
  try {
    MongoMemoryServer.create().then((mongo) => {
      const uri: any = mongo.getUri();
      mongoose.connect(uri).then(() => {
        // console.log("connected to testDB");
      });
    });
  } catch (error: any) {
    console.log(error);
  }
};

require('dotenv-safe').load();
import * as mongoose from "mongoose";

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const database = process.env.MONGO_DATABASE;
const auth = username ? `${username}:${password}@` : "";

const uri = `mongodb://${auth}${host}:${port}/${database}`;

function connectDB() {
  mongoose.connect(uri, { useNewUrlParser: true });
}

exports.connectDB = connectDB;

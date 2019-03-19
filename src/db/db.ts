import * as mongodb from "mongodb";
import * as config from "config";
import * as dotenv from "dotenv";

dotenv.config();

const username = process.env.MONGO_USERNAME || config.get("mongo.username");
const password = process.env.MONGO_PASSWORD || config.get("mongo.password");
const host = process.env.MONGO_HOST || config.get("mongo.host");
const port = process.env.MONGO_PORT || config.get("mongo.port");
const database = process.env.MONGO_DATABASE || config.get("mongo.database");
const auth = username ? `${username}:${password}@` : "";

const uri = `mongodb://${auth}${host}:${port}/${database}`;

function MongoDbConnect(callback) {
  mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, function(
    err,
    client
  ) {
    if (err) return callback(err);

    const db = client.db(database);

    console.log(db);

    callback(null, db);

    client.close();
  });
}

exports.MongoDbConnect = MongoDbConnect;

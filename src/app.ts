import * as express from "express";
import * as dotenv from "dotenv";
var morgan = require("morgan");
var piadas = require("./controllers/PiadaController");
var db = require("./db/db");

dotenv.config();

const app = express();

db.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/piadas", piadas);

export default app;

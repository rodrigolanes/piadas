import * as express from "express";
import * as dotenv from "dotenv";
var morgan = require("morgan");
var piadas = require("./controller/piadas");

dotenv.config();

// Create Express server
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/piadas", piadas);

export default app;

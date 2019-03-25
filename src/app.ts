require("dotenv-safe").load();
import * as express from "express";
const cors = require("cors");
var morgan = require("morgan");
var db = require("./db/db");
const passport = require("passport");

const app = express();

db.connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

var corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"]
};

app.use(cors(corsOption));

app.use("/api/auth", require("./controllers/AuthController"));

app.use("/api/piadas", require("./controllers/PiadaController"));

export default app;

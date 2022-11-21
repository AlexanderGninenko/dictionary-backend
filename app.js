const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
require("dotenv").config();
const cors = require("cors");
const corsOptions = require("./middlewares/cors");
const routes = require("./routes");
const errorUniHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const { PORT = 4010, MONGO_DB = "mongodb://localhost:27017/dictionarydb" } =
  process.env;

mongoose.connect(MONGO_DB, {
  useNewUrlParser: true,
});

const app = express();

app.use("*", cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorUniHandler);

app.listen(PORT, () => console.log(`running on ${PORT}`));

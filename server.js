const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const fileupload = require("express-fileupload");
const path = require("path");
const connectDb = require("./config/db");

// Load dotenv files
dotenv.config({ path: "./config/config.env" });

// Connect Database
connectDb();

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

// Initialize app
const app = express();

// Add body parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// file uploading
app.use(fileupload());

// set statics folder
app.use(express.static(path.join(__dirname, "public")));

// mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // Close the server and exit process
  server.close(() => process.exit(1));
});

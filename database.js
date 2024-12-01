const mongoose = require("mongoose");

console.log("Connecting to DB...");

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.warn("Error on DB Connection: ", error);

db.on("error", handleError);
db.once("open", handleOpen);

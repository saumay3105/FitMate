const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const calorieTrackerRoutes = require("./routes/calorieTrackerRoutes");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/calorie",calorieTrackerRoutes);
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

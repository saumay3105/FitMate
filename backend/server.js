const express = require("express");
const cors = require("cors");
const axios = require("axios");
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
app.use("/api/calorie", calorieTrackerRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const pingServer = async () => {
  try {
    const response = await axios.get(
      `https://fitmate-hp51.onrender.com/health`
    );
    if (response.status === 200) {
      console.log("Server pinged successfully");
    }
  } catch (error) {
    console.error("Error pinging server:", error.message);
  }
};

setInterval(pingServer, 300000);

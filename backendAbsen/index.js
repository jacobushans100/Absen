const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

const allowList_API = ["http://localhost:3000"];
const cors_option = {
  Credential: true,
  origin: (origin, callback) => {
    if (allowList_API.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Gagal terhubung ke API!"));
    }
  },
};

//middleware
app.use(cors(cors_option));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//database config
const db = require("./app/config/mongo.config");
// mongoose.set("useCreateIndex", true);
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log(`Terhubung ke Database : ${db.mongoURI}`);
  })
  .catch((err) => {
    console.log(`Gagal Terhubung ke Database ${err}`);
  });

app.get("/", (req, res) => {
  res.json({
    message: "API berhasil didapat",
  });
});

//API auth
const auth = require("./app/routes/auth.route");
app.use("/api/auth", auth);

// jalankan port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server berjalan di port http://localhost:${PORT}`);
});

require("dotenv").config();
module.exports = {
  mongoURI: `mongodb://${process.env.MONGO_HOST}`,
  secret: process.env.MONGO_SECRET,
};

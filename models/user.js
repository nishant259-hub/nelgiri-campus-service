const mongoose = require("mongoose");


const plmModule = require("passport-local-mongoose");
const passportLocalMongoose = plmModule.default || plmModule;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  githubId: {
    type: String,
    default: null   //  NO unique here
  }
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);



// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: false,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: false,
//   },
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user",
//   },
//   image: {
//     type: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   age: {
//     type: Number,
//     optional: true,
//   },
//   height: {
//     type: Number,
//     optional: true,
//   },
//   weight: {
//     type: Number,
//     optional: true,
//   },
//   gender: {
//     type: String,
//     enum: ["male", "female", "other"],
//     optional: true,
//   },
//   physicalActivityLevel: {
//     type: String,
//     optional: true,
//   },
//   goals: {
//     type: String,
//     enum: ["loose weight", "gain weight", "maintain weight"],
//     optional: true,
//   },
//   dietPreference: {
//     type: String,

//     optional: true,
//   },
//   bmi: {
//     type: Number,
//     optional: true,
//   },
//   foodAllergies: [String],
//   foodsToAvoid: [String],
//   region: {
//     type: String,
//     enum: [
//       "South American",
//       "North American",
//       "Indian Subcontinent",
//       "European",
//     ],
//     optional: true,
//   },
// });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// export default User;

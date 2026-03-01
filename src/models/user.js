import { required } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  camp: { type: String, required: true },
  date: { type: String, required: true },
  dayName: { type: String, required: true },
  shift: { type: String, required: true },
  troopersName: { type: [String], required: true },
  comdsName: { type: [String], required: true },
  reserveName: { type: [String], required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

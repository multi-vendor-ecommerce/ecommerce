// models/Admin.js
import Person from "./Person.js";
import mongoose from "mongoose";

const Admin = Person.discriminator("admin", new mongoose.Schema({}));

export default Admin;
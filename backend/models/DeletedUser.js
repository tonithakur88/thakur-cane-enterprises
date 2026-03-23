import mongoose from "mongoose";

const deletedUserSchema = new mongoose.Schema(
  {
    originalUserId: mongoose.Schema.Types.ObjectId,
    name: String,
    lastName: String,
    email: String,
    phone: String,
    role: String,

    deletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const DeletedUser = mongoose.model("DeletedUser", deletedUserSchema);

export default DeletedUser;
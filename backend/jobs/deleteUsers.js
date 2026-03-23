import User from "../models/User.js";
import DeletedUser from "../models/DeletedUser.js";

const deleteOldUsers = async () => {
  try {
    const now = new Date();

    const users = await User.find({
      deleteScheduledAt: { $lte: now },
    });

    for (const user of users) {
      // ✅ Move to DeletedUser collection
      await DeletedUser.create({
        originalUserId: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });

      // ✅ Delete from main users
      await User.findByIdAndDelete(user._id);
    }

    console.log("Old users cleanup done ✅");

  } catch (error) {
    console.error("Delete users job error:", error);
  }
};

export default deleteOldUsers;
// import express from "express";
// import auth from "../middleware/auth.js";
// import User from "../models/user.js";

// const router = express.Router();

// router.get("/", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select(
//       "-password"
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar || null,
//       bio: user.bio || "",
//       progress: user.progress || {
//         chats: 0,
//         debates: 0,
//         scenarios: 0,
//       },
//     });
//   } catch (err) {
//     console.error("Profile error:", err);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// });

// export default router;

import express from "express";
import auth from "../middleware/auth.js";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", auth, getProfile);

export default router;

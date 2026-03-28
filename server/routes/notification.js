// import express from "express";
// import auth from "../middleware/auth.js";
// import { fileComplaint, getMyComplaints } from "../controllers/complaintController.js";

// const router = express.Router();

// router.post("/", auth, fileComplaint);
// router.get("/my", auth, getMyComplaints);
// router.get("/:id", auth, async (req,res) => {
//   const c = await Complaint.findById(req.params.id).populate("citizen","name phone");
//   if(!c) return res.status(404).json({message:"Not found"});
//   if(req.user.role === "citizen" && c.citizen._id.toString() !== req.user._id.toString()) {
//     return res.status(403).json({message:"Forbidden"});
//   }
//   res.json({ complaint: c });
// });

// export default router;

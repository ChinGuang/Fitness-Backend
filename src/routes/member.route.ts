import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth";
import { ReadMembersSchema } from "../models/member.interface";
import { MemberModule } from "../modules/member";

export const MemberRouter = Router();
MemberRouter.use(verifyJwtToken);

// View all members
MemberRouter.get('/', async (req, res) => {
  try {
    const payload = ReadMembersSchema.parse(req.query);
    const members = await MemberModule.read(payload);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});
// View single Member
// Create Member
// Update Member
// Delete Member

// Import members from csv

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

MemberRouter.param("memberId", (req, res, next, id) => {
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return res.status(400).json({ error: 'Invalid member ID type' });
  }
  next();
})

// View single Member
MemberRouter.get('/:memberId', async (req, res) => {
  const member = await MemberModule.readOne(Number(req.params.memberId));
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }
  res.status(200).json(member);
})
// Create Member
// Update Member
// Delete Member

// Import members from csv

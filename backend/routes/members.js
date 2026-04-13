const express = require('express');
const memberRouter = express.Router();
const User = require('../models/user');
const Activity = require('../models/activity');
const Fund = require('../models/fund');
const { protect, authorize } = require('../middleware/auth');

memberRouter.get('/fund/:fundId', protect, async (req, res) => {
  try {
    const members = await User.find({ fund: req.params.fundId, role: { $in: ['member', 'secretary'] } }).select('-password');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

memberRouter.get('/:id', protect, async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password').populate('fund', 'name');
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

memberRouter.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('fund', 'name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

memberRouter.post('/create', protect, authorize('admin', 'president'), async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, role, fundId } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password: password || 'ibimina123', phone, age, gender, role: role || 'member', fund: fundId });
    await Activity.create({ fund: fundId, user: req.user._id, action: `New ${role || 'member'} ${name} created`, type: 'member' });
    res.status(201).json({ ...user._doc, password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

memberRouter.post('/create-by-president', protect, authorize('president'), async (req, res) => {
  try {
    const { name, email, phone, address, password, role } = req.body;
    const presidentUser = await User.findById(req.user._id);
    if (!presidentUser.fund) return res.status(400).json({ message: 'No fund assigned' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const newUser = await User.create({
      name, email, phone, password: password || 'ibimina123',
      role: role || 'member', fund: presidentUser.fund, address
    });

    const fund = await Fund.findById(presidentUser.fund);
    if (role === 'secretary') {
      if (fund.secretary) {
        await User.findByIdAndUpdate(fund.secretary, { role: 'member' });
      }
      fund.secretary = newUser._id;
    } else {
      if (!fund.members.includes(newUser._id)) fund.members.push(newUser._id);
    }
    await fund.save();

    await Activity.create({
      fund: presidentUser.fund, user: req.user._id,
      action: `President created ${role || 'member'} account for ${name}`,
      type: 'member'
    });

    res.status(201).json({ ...newUser._doc, password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = memberRouter;
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const db = require("../models/index");
const {
  validateUser,
  validatePassword,
  validateUserUpdate,
} = require("../validation/user");
const user = require("../models/user");
const auth = require("../middleware/auth");
require("dotenv").config();

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await db.user.findAll();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//get one user
router.get("/:uuid", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { uuid: req.params.uuid } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//create a new user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let userInDb = await db.user.findOne({ where: { email: req.body.email } });
    if (userInDb) return res.status(400).send("Email already registered.");
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }

  let user = _.pick(req.body, [
    "email",
    "firstName",
    "lastName",
    "password",
    "streetAddress",
    "aptOrSuite",
    "city",
    "province",
    "postalCode",
    "phone",
    "isAdmin",
    "isActive",
    "membershipType",
  ]);

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    const userCreated = await db.user.create(user);
    res.json(userCreated);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user password
router.patch("/", auth, async (req, res) => {
  const userUUID = req.userUUID;

  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send("Invalid password");

  try {
    const user = await db.user.findOne({ where: { uuid: userUUID } });
    if (!user) return res.status(400).send("User not found.");

    let password = req.body.password;

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user.set({ password });
    await user.save();
    res.json(user);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }

  res.json(user);
});

//admin modify user info
router.put("/:uuid", async (req, res) => {
  const { error } = validateUserUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await db.user.findOne({ where: { uuid: req.params.uuid } });
    if (!user) return res.status(404).send("User not found.");
    user.set(req.body);
    if (!("aptOrSuite" in req.body)) {
      user.set({ aptOrSuite: null });
    }
    await user.save();
    res.json(user);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

router.delete("/:uuid", async (req, res) => {
  try {
    const user = await db.user.findOne({ where: { uuid: req.params.uuid } });
    if (!user) return res.status(404).send("User not found.");
    const userDeleted = await user.destroy();
    res.json(userDeleted);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

//user modify info
router.put("/", auth, async (req, res) => {
  const userUUID = req.userUUID;

  const { error } = validateUserUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await db.user.findOne({ where: { uuid: userUUID } });
    if (!user) return res.status(404).send("User not found.");

    user.set(req.body);
    if (!("aptOrSuite" in req.body)) {
      user.set({ aptOrSuite: null });
    }
    await user.save();

    res.json(user);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;

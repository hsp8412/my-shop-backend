const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { validateAuthInfo } = require("../validation/user");
const db = require("../models");

router.post("/", async (req, res) => {
  const { error } = validateAuthInfo(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const user = await db.user.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send("Invalid email or password");

    const validLogin = await bcrypt.compare(req.body.password, user.password);
    if (!validLogin) return res.status(400).send("Invalid email or password");

    if (user.isActive === false)
      return res.status(400).send("User is not active");

    const payload = _.pick(user.toJSON(), ["email", "uuid", "isAdmin"]);

    const accessToken = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);

    res.send({ uuid: user.uuid, accessToken });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

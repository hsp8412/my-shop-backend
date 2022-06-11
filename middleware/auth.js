const jwt = require("jsonwebtoken");

function userAuth(req, res, next) {
  const token = req.header("x-access-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    if (decoded.uuid && decoded.isAdmin) {
      if (decoded.isAdmin === true) {
        return res.status(401).send("Access denied");
      }
      req.userUUID = decoded.uuid;
      next();
    } else {
      throw new Error("Invalid token");
    }
  } catch (e) {
    res.status(403).send("Invalid token");
  }
}

function adminAuth(req, res, next) {
  const token = req.header("x-access-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    if (decoded.uuid && decoded.isAdmin) {
      if (decoded.isAdmin === false) {
        return res.status(401).send("Access denied");
      }
      req.userUUID = decoded.uuid;
      next();
    } else {
      throw new Error("Invalid token");
    }
  } catch (e) {
    res.status(403).send("Invalid token");
  }
}

function auth(req, res, next) {
  const token = req.header("x-access-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.userUUID = decoded.uuid;
    next();
  } catch (e) {
    res.status(403).send("Invalid token");
  }
}

module.exports = { userAuth, adminAuth, auth };

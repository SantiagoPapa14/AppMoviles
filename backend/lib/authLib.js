const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const userRepository = require("./userRepository");
dotenv.config({ path: __dirname + "../.env" });
const key = process.env.JWS_SECRET;

function generateToken(user) {
  const token = jwt.sign(user, key, {
    expiresIn: "2h",
  });
  return token;
}

const validateAuthorization = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throwError(400);
    }
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, key);
    req.userData = decoded;
    next();
  } catch (err) {
    res.status(403).json("Forbidden.");
  }
};

const loginUser = async (email, password) => {
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    return false;
  }
  const valid = await bcrypt.compare(password, user.hashedPassword);
  if (!valid) {
    return false;
  }
  return generateToken(user);
};

const registerUser = async (email, username, password, name) => {
  const hashedPass = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser(
    email,
    username,
    hashedPass,
    name
  );
  if (!user) {
    return false;
  }
  // delete user.hashedPassword; PIERDO CONTRASEÑA EN EL TOKEN :(
  return generateToken(user);
};

module.exports = {
  generateToken,
  validateAuthorization,
  loginUser,
  registerUser,
};

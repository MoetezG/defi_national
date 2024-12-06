const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    await User.create({ name, email, password: passwordHash });
    res.json({ status: "ok", message: "user created" });
  } catch {
    res.json({ status: "ko", message: "user not created" });
  }
};

const loginUser = async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  console.log(user);
  if (!user) {
    return res.json({ status: "ko", message: "Login faild" });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.json({ status: "ko", message: "login faild" });
  }
  const token = jwt.sign(
    { name: user.name, idUser: user._id },
    "secret_shhhht",
    { expiresIn: "30d" }
  );
  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .json({ status: "ok", user });
};

module.exports = {
  loginUser,
  RegisterUser,
};

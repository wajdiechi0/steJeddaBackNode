const db = require("../models");
const User = db.user;

const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  await User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    phone: req.body.phone,
    birthdate: req.body.birthdate,
    role: req.body.role,
  }).catch((err) => {
    res.status(200).send({ code: 500, message: err.message });
    return;
  });
  res.status(200).send({ code: 200, message: "success" });
  return;
};

exports.signin = async (req, res) => {
  await User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(200).send({ code: 404, message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(200).send({
          code: 401,
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      res.status(200).send({
        code: 200,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          accessToken: "token",
        },
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

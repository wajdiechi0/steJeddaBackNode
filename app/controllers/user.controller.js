const db = require("../models");
const User = db.user;
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};


exports.getUserEmail = async (req, res) => {
  if (req.query.id) {
    User.findOne({
      where: {
        id: req.query.id,
      },
    }).then((user) => {
      if (user) {

        res.status(200).send({
          code: 200,
          data: user.email,
          message: "success",
        });
        return;
      } else {
        res.status(200).send({
          code: 404,
          data: {},
          message: "User not found",
        });
        return;
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};

exports.getUserList = async (req, res) => {
  User.findAll({
    where:{
      role:"user"
    }
  }).then(users=>{

    res.status(200).send({
      code: 200,
      data: users,
      message: "success",
    });
  })
  return;
};


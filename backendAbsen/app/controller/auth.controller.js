const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/mongo.config").secret;

// create user
exports.create = (req, res) => {
  const { username, name_user, password, email } = req.body;
  const newUser = new userModel({
    username: username,
    name_user: name_user,
    email: email,
    password: password,
    role_user: 0,
  });
  newUser.save(function (err, data) {
    if (err) {
      if (err.code == 11000)
        return res.status(403).json({
          message: "E-mail sudah dipakai.",
        });
      res.status(500).json(err);
    } else {
      res.status(200).json({
        message: `${data.name_user} berhasil dibuat`,
      });
    }
  });
};

exports.login = (req, res) => {
  userModel
    // .findOne({
    //   username: req.body.username,
    // })
    //cek multi field db
    .findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    })
    .then(async (user) => {
      //cek user
      if (!user) {
        res.status(404).json({
          message: "Pengguna tidak ditemukan",
        });
      } else {
        let token = await cekLogin(req.body, user);
        if (!token) {
          res.status(401).json({
            message: "Email atau password salah",
          });
        } else {
          userModel
            .findByIdAndUpdate(user._id, {
              last_access_user: Date.now(),
            })
            .then((result) => {
              res.status(200).json({
                message: "Berhasil Masuk",
                token: `Bearer ${token}`,
              });
            })
            .catch((error) => {
              res.status(500).json(error);
            });
        }
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

cekLogin = async (userData, dbData) => {
  return bcrypt
    .compare(userData.password, dbData.password)
    .then((isMatched) => {
      if (!isMatched) {
        return false;
      } else {
        // Generate token
        const payload = {
          _id: dbData._id,
          role_user: dbData.role_user,
          last_access_user: dbData.last_access_user,
        };
        return jwt.sign(payload, secretKey, {
          expiresIn: 604800, // 7 Hari
        });
      }
    })
    .catch(() => {
      return false;
    });
};

exports.tampilDataUser = (req, res) => {
  userModel
    // .find({ role_user: 1 })
    .find()
    .then((listUser) => {
      return res.status(200).json({
        message: "Daftar user",
        data: listUser,
      });
    })
    .catch((error) => {
      req.status(500).json(error);
    });
};

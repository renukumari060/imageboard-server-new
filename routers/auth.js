const { Router } = require("express");
const User = require("../models").user;
const bcrypt = require("bcrypt");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");

const router = new Router();

//http POST :4000/auth/signup email='pr@g.com' password='pri' fullName='prisha'
router.post("/signup", async (req, res, next) => {
  try {
    // email, name => frontend
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      res.status(400).send("Missing parameters");
    } else {
      if (password.length < 5) {
        res.status(400).send("Give atleat 6 characters");
      }
    }
    const encrypted = bcrypt.hashSync(password, 10);
    const newUser = await User.create({ email, password: encrypted, fullName });

    // delete newUser.password; // look up
    res.send(newUser);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

// router.post("/signup", async (req, res, next) => {
//   try {
//     // email, name => frontend
//     const { email, password, fullName } = req.body;
//     if (!email || !password || !fullName) {
//       res.status(400).send("Missing parameters");
//     }
//     const encrypted = bcrypt.hashSync(password, 10);
//     const newUser = await User.create({ email, password: encrypted, fullName });

//     // delete newUser.password; // look up
//     res.send(newUser);
//   } catch (e) {
//     console.log(e.message);
//     next(e);
//   }
// });

//http POST :4000/auth/login email='pr@g.com' password='pri' fullName='prisha'
router.post("/login", async (req, res, next) => {
  try {
    // 1. get { email, password } from body
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).send("Missing credentials");
    }

    // 2. find user with this email
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) return res.status(400).send("Wrong credentials");

    // 3. compare passwords
    const samePasswords = bcrypt.compareSync(password, user.password);
    if (samePasswords) {
      // give them something to prove they logged in
      const token = toJWT({ userId: user.id }); // { userId: 4 }
      console.log("All good!");
      res.send({ message: "Welcome!! you are logged in", token });
    } else {
      return res.status(400).send({ message: "Wrong credentials" });
    }
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

module.exports = router;

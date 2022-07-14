const express = require("express");
const userRouter = require("./routers/user");
const imageRouter = require("./routers/image");
const authRouter = require("./routers/auth");
const authMiddleware = require("./auth/middleware");

const PORT = 4000;

const app = express();

const jsonParser = express.json();

app.use(jsonParser);

//app.use(express.json()); //parse the body

app.use("/users", userRouter);
app.use("/images", imageRouter);
app.use("/auth", authRouter);

// router.get("/test-auth", authMiddleware, (req, res) => {
//   res.send({
//     message: `Thanks for visiting the secret endpoint ${req.user.email}.`,
//   });
// });

app.get("/hello", (req, res) => res.send("hello"));

app.listen(PORT, () => console.log(`Server started in port: ${PORT}`));

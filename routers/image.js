const { Router } = require("express");
const Image = require("../models").image;
const authMiddleware = require("../auth/middleware");

const router = new Router();

//get images
//http :4000/images
router.get("/", authMiddleware, async (request, response, next) => {
  try {
    const images = await Image.findAll();
    response.send(images);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

//http POST :4000/images title='mango' url='https://www.google.com/search'

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    // title,url => frontend
    const { title, url } = req.body;
    const newImage = await Image.create({ title, url });
    res.send(newImage);
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

//delete user
//http DELETE :4000/images/5
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    //1.get the id from the params
    const { id } = req.params;
    //2. find what you want to delete
    const userToDelete = await Image.findByPk(id);
    //3. delete
    await userToDelete.destroy();
    //4. send a response
    res.send("User teminated");
  } catch (e) {
    console.log(e.message);
    next(e);
  }
});

module.exports = router;

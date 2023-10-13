// MVC  = MODEL,VIEW,CONTROLLER

const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");

// memberga doir routerlar
router.get("/", memberController.home);
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);

// others
router.get("/menu", function (req, res) {
  res.send("Menu sahifadasiz");
});

router.get("/community", (req, res) => {
  res.send("Jamiyat sahifadasiz");
});

module.exports = router;

/* MVC, middleware patterns => dependency injection(AOP) => microservices */

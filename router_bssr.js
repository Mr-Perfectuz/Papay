// MVC  = MODEL,VIEW,CONTROLLER

const express = require("express");
const router_bssr = express.Router();
const restaurantController = require("./controllers/restaurantController");

/*           BSSR EJS     */

router_bssr.get("/signup", restaurantController.getSignupMyRestaurant);
router_bssr.post("/signup", restaurantController.signupProcess);

router_bssr.get("/login", restaurantController.login);
router_bssr.post("/login", restaurantController.loginProcess);

router_bssr.get("/logout", restaurantController.logout);

module.exports = router_bssr;

/* MVC, middleware patterns => dependency injection(AOP) => microservices */

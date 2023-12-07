// MVC  = MODEL,VIEW,CONTROLLER

const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const restaurantController = require("./controllers/restaurantController");
const orderController = require("./controllers/orderController");

/*           REST API     */

// memberga doir routerlar
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retreiveAuthMember,
  memberController.getChosenMember
);

// productga doir routerlar
router.post(
  "/products",
  memberController.retreiveAuthMember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retreiveAuthMember,
  productController.getChosenProduct
);

// Restaurant related reouters
router.get(
  "/restaurants",
  memberController.retreiveAuthMember,
  restaurantController.getRestaurants
);

router.get(
  "/restaurants/:id",
  memberController.retreiveAuthMember,
  restaurantController.getChosenRestaurant
);

// Order related reouters
router.post(
  "/orders/create",
  memberController.retreiveAuthMember,
  orderController.createOrder
);

router.get(
  "/orders",
  memberController.retreiveAuthMember,
  orderController.getMyOrders
);

// others

router.get("/menu", function (req, res) {
  res.send("Menu sahifadasiz");
});

router.get("/community", (req, res) => {
  res.send("Jamiyat sahifadasiz");
});

module.exports = router;

/* MVC, middleware patterns => dependency injection(AOP) => microservices */

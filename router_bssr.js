// MVC  = MODEL,VIEW,CONTROLLER

const express = require("express");
const router_bssr = express.Router();
const restaurantController = require("./controllers/restaurantController");
const productController = require("./controllers/productController");
const uploader_product = require("./utils/uploadMulter");
const productUploader = uploader_product("products");

/*           BSSR EJS     */

router_bssr
  .get("/signup", restaurantController.getSignupMyRestaurant)
  .post("/signup", restaurantController.signupProcess);

router_bssr
  .get("/login", restaurantController.getLoginMyRestaurant)
  .post("/login", restaurantController.loginProcess);

router_bssr.get("/logout", restaurantController.logout);
router_bssr.get("/check-me", restaurantController.checkSessions);

router_bssr.get("/products/menu", restaurantController.getMyRestaurantData);

router_bssr.post(
  "/products/create",
  restaurantController.validateAuthRestaurant,
  productUploader.array("product_images", 5), // Use productUploader here
  productController.addNewProduct
);
router_bssr.post("/products/edit/:id", productController.updateChosenProduct);

module.exports = router_bssr;

/* MVC, middleware patterns => dependency injection(AOP) => microservices */

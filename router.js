// MVC  = MODEL,VIEW,CONTROLLER

const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const productController = require("./controllers/productController");
const restaurantController = require("./controllers/restaurantController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const followController = require("./controllers/followController");
const uploader_community = require("./utils/uploadMulter")("community");
const uploader_member = require("./utils/uploadMulter")("members");

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

router.post(
  "/orders/edit",
  memberController.retreiveAuthMember,
  orderController.editChosenOrder
);

// community related reouters

router.post(
  "/community/image",
  uploader_community.single("community_image"),
  communityController.imageInsertion
);

router.post(
  "/community/create",
  memberController.retreiveAuthMember,
  communityController.createArticle
);

router.get(
  "/community/articles",
  memberController.retreiveAuthMember,
  communityController.getMemberArticles
);
router.get(
  "/community/target",
  memberController.retreiveAuthMember,
  communityController.getArticles
);
router.get(
  "/community/single-article/:art_id",
  memberController.retreiveAuthMember,
  communityController.getChosenArticles
);

// following related reouters

router.post(
  "/follow/subscribe/",
  memberController.retreiveAuthMember,
  followController.subscribe
);
router.post(
  "/follow/unsubscribe/",
  memberController.retreiveAuthMember,
  followController.unsubscribe
);
router.get("/follow/followings/", followController.getMemberFollowings);

// others

router.get("/menu", function (req, res) {
  res.send("Menu sahifadasiz");
});

module.exports = router;

/* MVC, middleware patterns => dependency injection(AOP) => microservices */

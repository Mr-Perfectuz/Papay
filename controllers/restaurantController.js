const Member = require("../modules/Member");
const Product = require("../modules/Product");

let restaurantController = module.exports;

restaurantController.getMyRestaurantProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantProducts ");
    const product = new Product();
    const data = await product.getAllProductDataResto(res.locals.member);
    console.log(data);
    res.render("restaurant-menu", { restaurant_data: data });
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log("ERROR, cont/getMyRestaurantProducts", err.message);
  }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant ");
    res.render("signup");
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log("ERROR, cont/getSignupMyRestaurant", err.message);
  }
};

restaurantController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    console.log("body:", req.body);
    (member = new Member()), (new_member = await member.signupData(data));

    req.session.member = new_member;
    res.redirect("/resto/products/menu");
    // console.log("member", member);
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log(err.message);
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyRestaurant ");
    res.render("login-page");
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log("ERROR, cont/getLoginMyRestaurant", err.message);
  }
};

restaurantController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    console.log("body:", req.body),
      (member = new Member()),
      (result = await member.loginDate(data));

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/resto/products/menu");
    });
  } catch (err) {
    // console.log("ERROR: cont/login", err.message);
    res.json({ state: "failed", message: err.message });
  }
};

restaurantController.logout = (req, res) => {
  console.log(" GET cont.logout");
  res.send("logout sahifasidasiz");
};

restaurantController.validateAuthRestaurant = (req, res, next) => {
  if (req.session?.member?.mb_type === "RESTAURANT") {
    req.member = req.session.member;
    next();
  } else
    res.json({
      state: "fail",
      message: "only authenticated members are allowed",
    });
};

restaurantController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};

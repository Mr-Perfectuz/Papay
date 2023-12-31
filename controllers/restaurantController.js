const assert = require("assert");
const Member = require("../modules/Member");
const Product = require("../modules/Product");
const Restaurant = require("../modules/Restaurant");
const Definer = require("../lib/mistake");

let restaurantController = module.exports;

restaurantController.getRestaurants = async (req, res) => {
  try {
    console.log(" GET cont/getRestaurants");
    const data = req.query;
    const restaurant = new Restaurant();
    const result = await restaurant.getRestaurantsData(req.member, data);

    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getRestaurants", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getChosenRestaurant = async (req, res) => {
  try {
    console.log(" GET cont/getChosenRestaurant");
    const id = req.params.id;

    const restaurant = new Restaurant();
    const result = await restaurant.getChosenRestaurantData(req.member, id);

    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/getChosenRestaurant", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

// *************************************
//             BSSR RELATED ROUTER
// *************************************

restaurantController.home = (req, res) => {
  try {
    console.log("GET: cont/home ");
    res.render("home-page");
  } catch (err) {
    res.json({ state: "ERROR", message: err.message });
    console.log("fail, cont/home", err.message);
  }
};

restaurantController.getMyRestaurantProducts = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantProducts ");
    const product = new Product();
    const data = await product.getAllProductDataResto(res.locals.member);
    console.log(data);
    res.render("restaurant-menu", { restaurant_data: data });
  } catch (err) {
    console.log("ERROR, cont/getMyRestaurantProducts", err.message);
    res.redirect("/resto");
  }
};

restaurantController.getSignupMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getSignupMyRestaurant ");
    res.render("signup");
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log("ERROR, cont/getSignupMyRestaurant", err.message);
  }
};

restaurantController.signupProcess = async (req, res) => {
  try {
    console.log("POST: cont/signupProcess");

    assert(req.file, Definer.member_err1);

    let new_member = req.body;
    new_member.mb_type = "RESTAURANT";
    new_member.mb_image = req.file.path;

    console.log("body:", req.body);
    const member = new Member();
    const result = await member.signupData(new_member);
    assert(req.file, Definer.general_err1);

    req.session.member = result;
    res.redirect("/resto/products/menu");
  } catch (err) {
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.getLoginMyRestaurant = async (req, res) => {
  try {
    console.log("GET: cont/getLoginMyRestaurant ");
    res.render("login-page");
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log("ERROR, cont/getLoginMyRestaurant", err.message);
  }
};

restaurantController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/loginProcess");
    const data = req.body;
    (member = new Member()), (result = await member.loginDate(data));

    req.session.member = result;
    req.session.save(function () {
      result.mb_type === "ADMIN"
        ? res.redirect("/resto/all-restaurant")
        : res.redirect("/resto/products/menu");
    });
  } catch (err) {
    console.log("ERROR: cont/loginProcess", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.logout = (req, res) => {
  try {
    console.log(" GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/resto");
    });
  } catch (error) {
    console.log("ERROR: cont/logout", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.validateAuthRestaurant = (req, res, next) => {
  if (req.session?.member?.mb_type === "RESTAURANT") {
    req.member = req.session.member;
    next();
  } else {
    res.json({
      state: "fail",
      message: "only authenticated members are allowed",
    });
  }
};

restaurantController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};

restaurantController.validateAdmin = (req, res, next) => {
  if (req?.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
              alert("Admin page: Permission denied !");
              window.location.replace('/resto');
              </script>`;
    res.end(html);
  }
};

restaurantController.getAllRestaurants = async (req, res) => {
  try {
    console.log(" GET cont/getAllRestaurants");
    const restaurant = new Restaurant();
    const restaurants_data = await restaurant.getAllRestaurantsData();
    res.render("all-restaurants", { restaurants_data: restaurants_data });
  } catch (err) {
    console.log("ERROR: cont/logout", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

restaurantController.updateRestaurantByAdmin = async (req, res) => {
  try {
    console.log(" GET cont/updateRestaurantByAdmin");
    const restaurant = new Restaurant();
    const result = await restaurant.updateRestaurantByAdminData(req.body);
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log("ERROR: cont/updateRestaurantByAdmin", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

const Member = require("../modules/Member");

let restaurantController = module.exports;

restaurantController.getMyRestaurantData = async (req, res) => {
  try {
    console.log("GET: cont/getMyRestaurantData ");
    // TODO Get my restaurant products

    res.render("restaurant-menu");
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log("ERROR, cont/getMyRestaurantData", err.message);
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
    console.log("body::", req.body);
    (member = new Member()), (new_member = await member.signupData(data));

    req.session.member = new_member;
    // res.json({ state: "Session succeed", data: new_member });
    res.redirect("/resto/products/menu");
    console.log("member", member);
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
    // console.log(req);
    console.log("body:", req.body),
      (member = new Member()),
      (result = await member.loginDate(data));

    req.session.member = result;
    req.session.save(function () {
      // res.redirect("/resto/products/menu");
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

const Member = require("../modules/Member");

let memberController = module.exports;

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    console.log("bodu::", req.body);
    const member = new Member();
    const new_member = await member.signupData(data);
    res.send("done");
  } catch (err) {
    console.log("ERROR, cont/signup", err);
  }
};
memberController.login = (req, res) => {
  console.log(" POST cont.login");
  res.send("login sahifasidasiz");
};
memberController.logout = (req, res) => {
  console.log(" GET cont.logout");
  res.send("logout sahifasidasiz");
};

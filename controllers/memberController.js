const Member = require("../modules/Member");

let memberController = module.exports;

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    console.log("bodu::", req.body);
    const member = new Member();
    const new_member = await member.signupData(data);
    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    res.json({ state: "failed", message: err });
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

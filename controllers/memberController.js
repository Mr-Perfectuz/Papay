const Member = require("../modules/Member");

let memberController = module.exports;

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    console.log("bodu::", req.body);
    (member = new Member()), (new_member = await member.signupData(data));
    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    res.json({ state: "failed", message: err });
  }
};
memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    console.log("bodu::", req.body),
      (member = new Member()),
      (result = await member.loginDate(data));
    res.json({ state: "succeed", data: result });
  } catch (err) {
    // console.log("ERROR: cont/login", err.message);
    res.json({ state: "failed", message: err.message });
  }
};
memberController.logout = (req, res) => {
  console.log(" GET cont.logout");
  res.send("logout sahifasidasiz");
};

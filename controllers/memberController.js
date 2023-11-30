const assert = require("assert");
const Member = require("../modules/Member");

let memberController = module.exports;
const jwt = require("jsonwebtoken");
const Definer = require("../lib/mistake");

memberController.signup = async (req, res) => {
  try {
    console.log("POST: cont/signup");
    const data = req.body;
    console.log("body::", req.body);
    (member = new Member()), (new_member = await member.signupData(data));

    // passing the token
    const token = memberController.createToken(new_member);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });

    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    res.json({ state: "failed", message: err.message });
    console.log(err.message);
  }
};

memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    console.log("body::", req.body),
      (member = new Member()),
      (result = await member.loginDate(data));

    // passing the token
    const token = memberController.createToken(result);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });

    res.json({ state: "succeed", data: result });
  } catch (err) {
    res.json({ state: "failed", message: err.message });
  }
};

memberController.logout = (req, res) => {
  console.log(" GET cont.logout");
  res.send("logout sahifasidasiz");
};

memberController.createToken = (result) => {
  try {
    const uploadData = {
      _id: result._id,
      mb_nick: result.mb_nick,
      mb_type: result.mb_type,
    };

    const token = jwt.sign(uploadData, process.env.SECRET_TOKEN, {
      expiresIn: "6h",
    });

    assert.ok(token, Definer.token_err1);
    return token;
  } catch (err) {
    console.log(" con.createToken");
    res.json({ state: "failed", message: err.message });
  }
};

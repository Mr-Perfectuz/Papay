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
    const member = new Member();
    const new_member = await member.signupData(data);

    // passing the token
    const token = memberController.createToken(new_member);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });

    res.json({ state: "success", data: new_member });
  } catch (err) {
    res.json({ state: "fail", message: err.message });
    console.log(err.message);
  }
};

memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    console.log("body:", req.body);
    const member = new Member();
    const result = await member.loginDate(data);

    // passing the token
    const token = memberController.createToken(result);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true, // TEST HERE
    });

    res.json({ state: "success", data: result });
  } catch (err) {
    res.json({ state: "fail", message: err.message });
  }
};

memberController.logout = (req, res) => {
  console.log(" GET cont/logout");
  res.cookie("access_token", null, { maxAge: 0, httpOnly: true });
  res.json({ state: "success", data: "Logout successfully ! " });
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
    throw err;
  }
};

memberController.checkMyAuthentication = (req, res) => {
  try {
    console.log(" GET cont/checkMyAuthentication");
    let token = req.cookies["access_token"];
    console.log("token", token);

    const member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    assert.ok(member, Definer.token_err2);
    res.json({ state: "success", data: member });
  } catch (err) {
    throw err;
  }
};

memberController.getChosenMember = async (req, res) => {
  try {
    console.log(" GET cont/getChosenMember");
    const id = req.params.id;
    const member = new Member();
    const result = await member.getChosenMemberData(req.member, id);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(" cont/getChosenMember", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.retreiveAuthMember = (req, res, next) => {
  try {
    let token = req.cookies["access_token"];
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    next();
  } catch (err) {
    console.log(" cont/getChosenMember", err.message);
    next();
  }
};
memberController.getMyOrders = (req, res) => {
  try {
    let token = req.cookies["access_token"];
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    next();
  } catch (err) {
    console.log(" cont/getChosenMember", err.message);
    next();
  }
};

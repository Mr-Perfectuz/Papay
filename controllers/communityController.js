const assert = require("assert");
const Definer = require("../lib/mistake");
const Community = require("../modules/Community");

let communityController = module.exports;

communityController.imageInsertion = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
    assert.ok(req.file, Definer.general_err3);
    const image_url = req.file.path;
    res.json({ state: "success", data: image_url });
  } catch (err) {
    console.log("ERROR, cont/updateChosenProduct", err.message);
    res.json({ state: "fail", message: err.message });
  }
};
communityController.createArticle = async (req, res) => {
  try {
    console.log("GET: cont/createArticle");
    const community = new Community();
    const result = await community.createArticleData(req.member, req.body);
    assert.ok(result, Definer.general_err1);
    res.json({ state: "success", data: result });
    // community service model
  } catch (err) {
    console.log("ERROR, cont/createArticle", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

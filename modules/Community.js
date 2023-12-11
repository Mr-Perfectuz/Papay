const { shapeIntoMongoseObjectIdn } = require("../lib/config");
const Definer = require("../lib/mistake");
const BoArticleModel = require("../schema/bo_article.model");
const ProductModel = require("../schema/product.model");
const ViewModel = require("../schema/view.model");

class Community {
  constructor(mb_id) {
    this.boArticleModel = BoArticleModel;
  }

  async createArticleData(member, data) {
    try {
      data.mb_id = shapeIntoMongoseObjectIdn(member._id);
      const new_article = await this.saveArticleData(data);
      return new_article;
    } catch (err) {
      throw err;
    }
  }

  async saveArticleData(data) {
    try {
      const article = new this.boArticleModel(data);
      return await article.save();
    } catch (mongo_err) {
      console.log("mongo_err:", mongo_err);
      throw new Error(Definer.auth_err1);
    }
  }
}

module.exports = Community;

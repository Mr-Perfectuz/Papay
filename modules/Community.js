const {
  shapeIntoMongoseObjectIdn,
  board_id_enum_list,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const BoArticleModel = require("../schema/bo_article.model");
const ProductModel = require("../schema/product.model");
const ViewModel = require("../schema/view.model");
const assert = require("assert");
const Member = require("./Member");

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
      throw new Error(Definer.mongo_val_error);
    }
  }

  async getMemberArticlesData(member, mb_id, inquery) {
    try {
      const auth_mb_id = shapeIntoMongoseObjectIdn(member?._id);
      mb_id = shapeIntoMongoseObjectIdn(mb_id);
      const page = inquery["page"] ? inquery["page"] * 1 : 1;
      const limit = inquery["limit"] ? inquery["limit"] * 1 : 5;

      const result = await this.boArticleModel
        .aggregate([
          { $match: { mb_id: mb_id, art_status: "active" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          // todo check auth member liked the chosen target
        ])
        .exec();
      assert.ok(result, Definer.article_err2);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getArticlesdata(member, inquery) {
    try {
      const auth_mb_id = shapeIntoMongoseObjectIdn(member?._id);
      let matches =
        inquery.bo_id == "all"
          ? { bo_id: { $in: board_id_enum_list }, art_status: "active" }
          : { bo_id: inquery.bo_id, art_status: "active" };
      inquery.limit *= 1;
      inquery.page *= 1;
      const sort = inquery.order
        ? { [`${inquery.order}`]: -1 }
        : { createdAt: -1 };

      const result = await this.boArticleModel
        .aggregate([
          { $match: matches },
          { $sort: sort },
          { $skip: (inquery.page - 1) * inquery.limit },
          { $limit: inquery.limit },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
          // todo check auth member liked the chosen target
        ])
        .exec();

      assert.ok(result, Definer.article_err3);
      return result;
    } catch (mongo_err) {
      console.log("mongo_err:", mongo_err);
      throw new Error(Definer.mongo_val_error);
    }
  }

  async getChosenArticlesData(member, art_id) {
    try {
      const auth_mb_id = shapeIntoMongoseObjectIdn(member?._id);
      art_id = shapeIntoMongoseObjectIdn(art_id);

      // increase view if member has not seen the target before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, art_id, "community");
      }

      const result = await this.boArticleModel
        .aggregate([{ $match: { _id: art_id, art_status: "active" } }]) // !
        .exec();
      assert.ok(result, Definer.article_err4);
      return result;
    } catch (mongo_err) {
      console.log("mongo_err:", mongo_err);
      throw new Error(Definer.mongo_val_error);
    }
  }
}

module.exports = Community;

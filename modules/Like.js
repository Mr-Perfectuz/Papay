const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const LikeModel = require("../schema/like.model");
const BoArticleModel = require("../schema/bo_article.model");
const Definer = require("../lib/mistake");

class Like {
  constructor(mb_id) {
    this.likeModel = LikeModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.boArticleModel = BoArticleModel;
    this.mb_id = mb_id;
  }

  async validateTargetChosen(id, group_type) {
    console.log("group_type:", group_type);
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({
              _id: id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;

        case "product":
          result = await this.productModel
            .findOne({
              _id: id,
              product_status: "PROCESS",
            })
            .exec();
          break;

        case "community":
          result = await this.boArticleModel
            .findOne({
              _id: id,
              art_status: "active",
            })
            .exec();
          break;
      }
      return !!result;
    } catch (error) {
      throw error;
    }
  }
  async removeMemberLike(like_ref_id, group_type) {
    try {
      const result = await this.likeModel
        .findOneAndDelete({
          like_ref_id: like_ref_id,
          mb_id: this.mb_id,
        })
        .exec();

      await this.modifyItemLikeCounts(like_ref_id, group_type, -1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberLike(like_ref_id, group_type) {
    try {
      const new_like = new this.likeModel({
        mb_id: this.mb_id,
        like_ref_id: like_ref_id,
        like_group: group_type,
      });

      const result = await new_like.save();

      // target like sonini bittaga oshiramiz
      await this.modifyItemLikeCounts(like_ref_id, group_type, 1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async modifyItemLikeCounts(like_ref_id, type, modifier) {
    try {
      if (type === "member") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: like_ref_id },
            { $inc: { mb_likes: modifier } }
          )
          .exec();
      } else if (type === "product") {
        await this.productModel
          .findByIdAndUpdate(
            { _id: like_ref_id },
            { $inc: { producta_likes: modifier } }
          )
          .exec();
      } else if (type === "community") {
        await this.boArticleModel
          .findByIdAndUpdate(
            { _id: like_ref_id },
            { $inc: { art_likes: modifier } }
          )
          .exec();
      }
      return true;
    } catch (mongo_err) {
      console.log("mongo_err", mongo_err);
      throw new Error(Definer.mongo_val_error);
    }
  }

  async checkLikeExisstance(like_ref_id) {
    try {
      const like = await this.likeModel
        .findOne({
          mb_id: this.mb_id,
          like_ref_id: like_ref_id,
        })
        .exec();
      return like ? true : false;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Like;

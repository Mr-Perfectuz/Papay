const { shapeIntoMongoseObjectIdn } = require("../lib/config");
const Definer = require("../lib/mistake");
const Followmodel = require("../schema/follow.model");
const assert = require("assert");
const MemberModel = require("../schema/member.model");

class Follow {
  constructor(mb_id) {
    this.followModel = Followmodel;
    this.memberModel = MemberModel;
  }

  async subscribeData(member, data) {
    try {
      assert.ok(member._id !== data.mb_id, Definer.follow_err1);
      const subscriber_id = shapeIntoMongoseObjectIdn(member._id);
      const follow_id = shapeIntoMongoseObjectIdn(data.mb_id);

      const member_data = await this.memberModel
        .aggregate([{ $match: { _id: follow_id } }]) // !
        .exec();

      assert.ok(member_data, Definer.general_err2);

      const result = await this.createSubscriptionData(
        follow_id,
        subscriber_id
      );
      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", 1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", 1);

      return true;
    } catch (err) {
      throw err;
    }
  }

  async createSubscriptionData(follow_id, subscriber_id) {
    try {
      const new_follow = new this.followModel({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });

      return await new_follow.save();
    } catch (mongo_err) {
      console.log("mongo_err", mongo_err);
      throw new Error(Definer.follow_err2);
    }
  }

  async modifyMemberFollowCounts(mb_id, type, modifier) {
    try {
      if (type === "follow_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_follow_cnt: modifier } } // ! why not += modifiler
          )
          .exec();
      } else if (type === "subscriber_change") {
        await this.memberModel
          .findByIdAndUpdate(
            { _id: mb_id },
            { $inc: { mb_subscriber_cnt: modifier } } // ! why not += modifiler
          )
          .exec();
      }
      return true;
    } catch (mongo_err) {
      console.log("mongo_err", mongo_err);
      throw new Error(Definer.follow_err2);
    }
  }
  async unsubscribeData(member, data) {
    try {
      const subscriber_id = shapeIntoMongoseObjectIdn(member._id);
      const follow_id = shapeIntoMongoseObjectIdn(data.mb_id);

      const result = await this.followModel.findOneAndDelete({
        follow_id: follow_id,
        subscriber_id: subscriber_id,
      });

      assert.ok(result, Definer.general_err1);

      await this.modifyMemberFollowCounts(follow_id, "subscriber_change", -1);
      await this.modifyMemberFollowCounts(subscriber_id, "follow_change", -1);

      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Follow;
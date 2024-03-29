const assert = require("assert");
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const {
  shapeIntoMongoseObjectIdn,
  lookup_auth_liked,
} = require("../lib/config");
const Member = require("./Member");

class Restaurant {
  constructor() {
    this.memberModel = MemberModel;
  }

  async getRestaurantsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongoseObjectIdn(member?._id);
      let match = { mb_type: "RESTAURANT", mb_status: "ACTIVE" };
      let aggregationQuery = [];
      data.limit = data["limit"] * 1;
      data.page = data["page"] * 1;
      // data.limit = Number(data.limit);
      // data.page = Number(data.page);

      switch (data.order) {
        case "top":
          match["mb_top"] = "Y";
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });

          break;

        case "random":
          aggregationQuery.push({ $match: match });
          aggregationQuery.push({ $sample: { size: data.limit } });
          break;

        default:
          aggregationQuery.push({ $match: match });
          const sort = { [data.order]: -1 };
          aggregationQuery.push({ $sort: sort });
          break;
      }

      aggregationQuery.push({ $skip: (data.page - 1) * data.limit });
      aggregationQuery.push({ $limit: data.limit });
      aggregationQuery.push(lookup_auth_liked(auth_mb_id));

      const result = await this.memberModel.aggregate(aggregationQuery).exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getChosenRestaurantData(member, id) {
    try {
      id = shapeIntoMongoseObjectIdn(id);

      // increase view if member has not seen the target before
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "member");
      }

      const result = await this.memberModel
        .findOne({
          _id: id,
          mb_status: "ACTIVE",
        })
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // *************************************
  //             BSSR RELATED ROUTER
  // *************************************

  async getAllRestaurantsData() {
    try {
      const result = await this.memberModel
        .find({
          mb_type: "RESTAURANT",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateRestaurantByAdminData(update_data) {
    try {
      const id = shapeIntoMongoseObjectIdn(update_data?.id);
      const result = await this.memberModel
        .findByIdAndUpdate({ _id: id }, update_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert.ok(result, Definer.general_err1);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Restaurant;

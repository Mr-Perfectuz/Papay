const assert = require("assert");
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const { shapeIntoMongoseObjectIdn } = require("../lib/config");

class Restaurant {
  constructor() {
    this.memberModel = MemberModel;
  }

  async getAllRestaurantsData() {
    try {
      const result = await this.memberModel
        .find({
          mb_type: "RESTAURANT",
        })
        .exec();

      assert(result, Definer.restaurant_err1);
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

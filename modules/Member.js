const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const { shapeIntoMongoseObjectIdn } = require("../lib/config");

class Member {
  constructor() {
    this.memberModel = MemberModel;
  }
  async signupData(input) {
    try {
      let result;
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);
      const new_member = new this.memberModel(input);

      try {
        result = await new_member.save();
      } catch (mongo_error) {
        console.log(mongo_error);
        throw new Error(Definer.auth_err1);
      }
      result.mb_password = "";
      return result;
    } catch (err) {
      throw err;
    }
  }
  async loginDate(input) {
    try {
      const member = await this.memberModel
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 })
        .exec();

      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );

      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel.findOne({ mb_nick: input.mb_nick }).exec();
    } catch (err) {
      throw err;
    }
  }
  async getChosenMemberData(id) {
    id = shapeIntoMongoseObjectIdn(id);
    const result = await this.memberModel
      .aggregate([
        { $match: { _id: id, mb_status: "ACTIVE" } },
        { $unset: "mb_password" },
      ])
      .exec();
    assert.ok(result, Definer.general_err2);
    return result[0];
    try {
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;

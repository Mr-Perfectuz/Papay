const MemberModel = require("../schema/member.model");
const View = require("./View");
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
  async getChosenMemberData(member, id) {
    try {
      id = shapeIntoMongoseObjectIdn(id);
      console.log("member: ", member);

      if (member) {
        // if not seen before
        await this.viewChosenItemByMember(member, id, "member");
      }

      const result = await this.memberModel
        .aggregate([
          { $match: { _id: id, mb_status: "ACTIVE" } },
          { $unset: "mb_password" },
        ])
        .exec();
      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongoseObjectIdn(view_ref_id);
      const mb_id = shapeIntoMongoseObjectIdn(member._id);

      const view = new View(mb_id);

      // validation needed
      const isValid = await view.validateChosenTarget(view_ref_id, group_type);
      console.log("isValid::", isValid);
      assert.ok(isValid, Definer.general_err2);

      //logged user has seen target before
      const doesExist = await view.checkViewExisstance(view_ref_id);
      console.log("doesExist:", doesExist);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;

const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");

class Member {
  constructor() {
    this.memberModel = MemberModel;
  }
  async signupData(input) {
    try {
      const new_member = new this.memberModel(input);

      try {
        const result = await new_member.save();
      } catch (mongo_error) {
        throw new Error(Definer.auth_err1);
      }

      const result = await new_member.save();

      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Member;

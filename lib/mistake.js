class Definer {
  // general errors
  static general_err1 = "att: Something went wrong";
  static general_err2 = "att: there is no data with such params ";
  static general_err3 = "att: file upload error";

  // Member auth related errors

  static auth_err1 = "att: mongodb validation failed";
  static auth_err3 = "att: no member with that member mb_nick";
  static auth_err4 = "att: your credentials do not match mb_password";

  // products related errors
  static product_err1 = "att: product creation is failed";

  // member related errors
  static member_err1 = "att: file upload is failed";

  // token related errors
  static token_err1 = "att: jsonwebToken creation is failed";
}

module.exports = Definer;

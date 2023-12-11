class Definer {
  // general errors
  static general_err1 = "att: Something went wrong";
  static general_err2 = "att: there is no data with such params ";
  static general_err3 = "att: file upload error";

  // Member auth related errors

  static auth_err1 = "att: mongodb validation failed";
  static auth_err3 = "att: no member with that member mb_nick";
  static auth_err4 = "att: your credentials do not match mb_password";
  static auth_err5 = "att: you are not authenticated";

  // products related errors
  static product_err1 = "att: product creation is failed";

  // member related errors
  static member_err1 = "att: file upload is failed";

  // order related errors
  static order_err1 = "att: order creation failed";
  static order_err2 = "att: orderItem creation failed";
  static order_err3 = "att: no order with that params exists";

  // token related errors
  static token_err1 = "att: jsonwebToken creation is failed";
  static token_err2 = "att: no token is found";
}

module.exports = Definer;

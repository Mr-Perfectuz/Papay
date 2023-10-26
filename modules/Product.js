const assert = require("assert");
const { shapeIntoMongoseObjectIdn } = require("../lib/config");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async addNewProductData(data, member) {
    try {
      data.restaurant_mb_id = shapeIntoMongoseObjectIdn(member._id);

      const new_product = new this.productModel(data);
      const result = await new_product.save();
      assert.ok(result, Definer.product_err1);

      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;

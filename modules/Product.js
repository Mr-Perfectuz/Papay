const assert = require("assert");
const { shapeIntoMongoseObjectIdn } = require("../lib/config");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductDataResto(member) {
    try {
      member._id = shapeIntoMongoseObjectIdn(member._id);
      const result = await this.productModel.find({
        restaurant_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
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

  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongoseObjectIdn(id);
      mb_id = shapeIntoMongoseObjectIdn(mb_id);
      const result = this.productModel
        .findByIdAndUpdate(
          {
            _id: id,
            restaurant_mb_id: mb_id,
          },
          updated_data,
          { runValidators: true, lean: true, returnDocument: "after" }
        )
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;

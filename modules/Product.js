const assert = require("assert");
const { shapeIntoMongoseObjectIdn } = require("../lib/config");
const ProductModel = require("../schema/product.model");
const Definer = require("../lib/mistake");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongoseObjectIdn(member?._id);
      let match = { product_status: "PROCESS" };
      if (data.restaurant_mb_id) {
        match["restaurant_mb_id"] = shapeIntoMongoseObjectIdn(
          data.restaurant_mb_id
        );
        match["product_collection"] = data.product_collection;
      }
      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };
      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
        ])
        .exec();

      // TODO check auth member pproduct likes
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongoseObjectIdn(member?._id);
      id = shapeIntoMongoseObjectIdn(id);
      const result = await this.productModel
        .aggregate([{ $match: { _id: id, product_status: "PROCESS" } }])
        // toddo: check auth number product likes
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (error) {
      throw error;
    }
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

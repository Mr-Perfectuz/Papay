const orderModel = require("../schema/order.model");
const orderItemModel = require("../schema/orderItem.model");
const Definer = require("../lib/mistake");
const assert = require("assert");
const { shapeIntoMongoseObjectIdn } = require("../lib/config");

class Order {
  constructor() {
    this.orderModel = orderModel;
    this.orderItemModel = orderItemModel;
  }
  async createOrderData(member, data) {
    try {
      let order_total_amount = 0;
      let delivery_cost = 0;
      const mb_id = shapeIntoMongoseObjectIdn(member._id);

      data.map((item) => {
        order_total_amount += item["quantity"] * item["price"];
      });

      if (order_total_amount < 100) {
        delivery_cost = 2;
        order_total_amount += delivery_cost;
      }

      const order_id = await this.saveOrderData(
        order_total_amount,
        delivery_cost,
        mb_id
      );

      console.log("order_id::: ", order_id);

      // order items creation
      await this.recordOrderItemsData(order_id, data);

      return order_id;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
      const new_order = new this.orderModel({
        order_total_amount: order_total_amount,
        order_delivery_cost: delivery_cost,
        mb_id: mb_id,
      });

      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);
      console.log("result::: ", result);
      return result._id;
    } catch (err) {
      throw new Error(Definer.order_err1);
    }
  }

  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveOrderItemsData(item, order_id);
      });

      const results = await Promise.all(pro_list);
      console.log("results:", results);
    } catch (err) {
      throw err;
    }
  }

  async saveOrderItemsData(item, order_id) {
    try {
      order_id = shapeIntoMongoseObjectIdn(order_id);
      item._id = shapeIntoMongoseObjectIdn(item._id);

      const order_item = new this.orderItemModel({
        item_quentity: item["quantity"],
        item_price: item["price"],
        order_id: order_id,
        product_id: item["_id"],
      });

      const result = await order_item.save();
      assert.ok(result, Definer.order_err2);
      return "created";
    } catch (err) {
      throw new Error(Definer.order_err2);
    }
  }

  async getMyOrdersData(member, query) {
    try {
      console.log("POST: cont/getMyOrdersData");
      const mb_id = shapeIntoMongoseObjectIdn(member._id);
      let order_status = query.status.toUpperCase();
      console.log("order_status", order_status);
      let matches = { mb_id: mb_id, order_status: order_status };

      const result = await this.orderModel
        .aggregate([
          { $match: matches },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "orderitems",
              localField: "_id",
              foreignField: "order_id",
              as: "order_items",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "order_items.product_id",
              foreignField: "_id",
              as: "product_data",
            },
          },
        ])
        .exec();

      console.log("result", result);
      // assert.ok(result, Definer.order_err2);
      return result;
    } catch (err) {
      throw err;
      // throw new Error(Definer.order_err2);
    }
  }

  async editChosenOrderData(member, data) {
    try {
      console.log("POST: cont/editChosenOrderData");
      const mb_id = shapeIntoMongoseObjectIdn(member._id);
      const order_id = shapeIntoMongoseObjectIdn(data.order_id);
      const order_status = data.order_status.toUpperCase();

      const result = await this.orderModel.findOneAndUpdate(
        { mb_id: mb_id, _id: order_id },
        { order_status: order_status },
        { runValidators: true, lean: true, returnDocument: "before" }
      );
      // console.log("result", result);
      assert.ok(result, Definer.order_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Order;

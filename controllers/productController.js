let productController = module.exports;

productController.getAllProducts = async (req, res) => {
  try {
    console.log("GET: cont/getAllProducts");
  } catch (error) {
    res.json({ state: "failed", message: err.message });
    console.log("ERROR, cont/getAllProducts", err.message);
  }
};

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    // console.log(req.member);
    //  TODO product creation develop
    res.send("ok");
  } catch (error) {
    console.log("ERROR, cont/addNewProduct", err.message);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
  } catch (error) {
    res.json({ state: "failed", message: err.message });
    console.log("ERROR, cont/updateChosenProduct", err.message);
  }
};

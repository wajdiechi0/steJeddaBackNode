const controller = require("../controllers/template.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/template/uploadtemplate", controller.uploadTemplateDetails);
  app.post("/api/template/uploadtemplateimage", controller.uploadTemplateImage);
  app.post("/api/template/uploadtemplatefile", controller.uploadTemplateFile);
  app.get("/api/template/fetchtemplatelist", controller.fetchTemplateList);
  app.get("/api/template/loadtemplateimage", controller.loadTemplateImage);
  app.get("/api/template/downloadtemplate", controller.downloadTemplate);
  app.post("/api/template/updatetemplate", controller.updateTemplate);
  app.post("/api/template/deletetemplate", controller.deleteTemplate);
  app.post("/api/template/addtocart", controller.addToCart);
  app.post("/api/template/deletefromcart", controller.deleteFromCart);
  app.get("/api/template/fetchcart", controller.fetchCart);
  app.post("/api/template/clearcart", controller.clearCart);
  app.post("/api/template/createorder", controller.createOrder);
  app.post("/api/template/fetchorders", controller.fetchOrders);
  app.post("/api/template/fetchallorders", controller.fetchAllOrders);
  app.post("/api/template/cancelorder", controller.cancelOrder);
  app.post("/api/template/markpaidorder", controller.markAsPaidOrder);
  app.post("/api/template/fetchmytemplates", controller.fetchMyTemplates);
  app.post("/api/template/fetchorderdetails", controller.fetchOrderDetails);
  app.get("/api/template/orderspermonth", controller.ordersPerMonth);
  app.get("/api/template/ordersperday", controller.ordersPerDay);
  app.get("/api/template/totalOrders", controller.totalOrdersN);
  
  
};

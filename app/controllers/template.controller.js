const db = require("../models");
const multer = require("multer");
const path = require("path");
const url = require("url");
const Template = db.template;
const User = db.user;
const Cart = db.cart;
const Order = db.order;

exports.uploadTemplateDetails = async (req, res) => {
  const template = await Template.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  }).catch((err) => {
    res.status(200).send({ code: 500, message: "Please check your entries" });
    return;
  });
  res.status(200).send({
    code: 200,
    data: { idTemplate: template.id },
    message: "Operation Completed Successfully",
  });

  return;
};
exports.uploadTemplateImage = async (req, res) => {
  let idTemplate = Number(url.parse(req.url, true).query.id);
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "templateImages");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    },
  });
  let upload = multer({ storage: multerStorage }).single("image");
  upload(req, res, function (err) {
    if (req.fileValidationError) {
      res.status(200).send({ code: 400, message: req.fileValidationError });
      return;
    } else if (!req.file) {
      res
        .status(200)
        .send({ code: 404, message: "Please select an image to upload" });
      return;
    } else if (err instanceof multer.MulterError) {
      res.status(200).send({ code: 400, message: err });
      return;
    } else if (err) {
      res.status(200).send({ code: 400, message: err });
      return;
    }
    Template.update(
      {
        img: req.file.filename,
      },
      {
        where: { id: idTemplate },
      }
    ).then(function (result) {});
    res.status(200).send({ code: 200, data: req.file.filename });
  });
};

exports.uploadTemplateFile = async (req, res) => {
  let idTemplate = Number(url.parse(req.url, true).query.id);
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "templateFiles");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, "FILE-" + Date.now() + path.extname(file.originalname));
    },
  });
  let upload = multer({ storage: multerStorage }).single("file");
  upload(req, res, function (err) {
    if (req.fileValidationError) {
      res.status(200).send({ code: 400, message: req.fileValidationError });
      return;
    } else if (!req.file) {
      res
        .status(200)
        .send({ code: 404, message: "Please select a file to upload" });
      return;
    } else if (err instanceof multer.MulterError) {
      res.status(200).send({ code: 400, message: err });
      return;
    } else if (err) {
      res.status(200).send({ code: 400, message: err });
      return;
    }

    Template.update(
      {
        file: req.file.filename,
      },
      {
        where: { id: idTemplate },
      }
    ).then(function (result) {});
    res.status(200).send({
      code: 200,
      data: req.file.filename,
    });
  });
};
exports.fetchTemplateList = async (req, res) => {
  const templates = await Template.findAll().catch((err) => {
    res.status(200).send({ code: 500, message: "error" });
    return;
  });
  res.status(200).send({
    code: 200,
    data: { templates },
  });

  return;
};

exports.loadTemplateImage = async (req, res) => {
  let image = url.parse(req.url, true).query.img;
  res.sendFile(path.resolve("templateImages/" + image));
  return;
};
exports.downloadTemplate = async (req, res) => {
  let file = url.parse(req.url, true).query.file;
  res.sendFile(path.resolve("templateFiles/" + file));
  return;
};

exports.updateTemplate = async (req, res) => {
  if (req.body.id) {
    Template.update(
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      },
      {
        where: { id: req.body.id },
      }
    ).then(function (result) {});
    res.status(200).send({
      code: 200,
      data: {},
      message: "success",
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};
exports.deleteTemplate = async (req, res) => {
  if (req.body.id) {
    Template.findOne({
      where: {
        id: req.body.id,
      },
    }).then((template) => {
      if (template) {
        template.destroy();

        res.status(200).send({
          code: 200,
          data: template,
          message: "success",
        });
        return;
      } else {
        res.status(200).send({
          code: 404,
          data: {},
          message: "Template not found",
        });
        return;
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};

exports.addToCart = async (req, res) => {
  if (req.body.userId && req.body.templateId) {
    Cart.findOne({
      where: {
        userId: req.body.userId,
        templateId: req.body.templateId,
      },
    }).then((cart) => {
      if (cart) {
        res.status(200).send({
          code: 400,
          data: {},
          message: "template is already in user cart",
        });
      } else {
        Cart.create({
          userId: req.body.userId,
          templateId: req.body.templateId,
        }).then((cart) => {
          res.status(200).send({ code: 200, data: { cart }, message: "" });
          return;
        });
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};
exports.deleteFromCart = async (req, res) => {
  if (req.body.userId && req.body.templateId) {
    Cart.findOne({
      where: {
        userId: req.body.userId,
        templateId: req.body.templateId,
      },
    }).then((cart) => {
      if (cart) {
        cart.destroy();
        res.status(200).send({
          code: 200,
          data: cart,
          message: "",
        });
      } else {
        res.status(200).send({
          code: 200,
          data: {},
          message: "template not found in cart",
        });
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchCart = async (req, res) => {
  let userId = Number(url.parse(req.url, true).query.id);
  if (userId) {
    const cart = await Cart.findAll({
      where: {
        userId,
      },
    }).then((cart) => {
      let templates = [];
      const fetchTemplates = async () => {
        for (let i = 0; i < cart.length; i++) {
          await Template.findOne({
            where: {
              id: cart[i].templateId,
            },
          }).then((template) => {
            templates.push(template);
          });
        }

        res.status(200).send({ code: 200, data: templates, message: "" });
        return;
      };
      fetchTemplates();
    });
    res.status(200).send({
      code: 200,
      data: { templates },
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "id not provided",
    });
  }
  return;
};

exports.clearCart = async (req, res) => {
  if (req.body.userId) {
    Cart.destroy({
      where: {
        userId: req.body.userId,
      },
    }).then((cart) => {
      if (cart) {
        res.status(200).send({
          code: 200,
          data: cart,
          message: "Cart cleared",
        });
      } else {
        res.status(200).send({
          code: 200,
          data: {},
          message: "template not found in cart",
        });
      }
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.createOrder = async (req, res) => {
  if (req.body.userId && req.body.templates) {
    const order = await Order.create({
      date: new Date(),
      userId: req.body.userId,
      state: "waiting",
    }).catch((err) => {
      res
        .status(200)
        .send({ code: 500, data: {}, message: "Please check your entries" });
      return;
    });
    let templatesId = [];
    for (let i = 0; i < req.body.templates.length; i++) {
      templatesId.push(req.body.templates[i].id);
    }
    order.addTemplates(templatesId);
    res.status(200).send({ code: 200, data: order, message: "success" });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchOrders = async (req, res) => {
  if (req.body.userId) {
    Order.findAll({
      where: {
        userId: req.body.userId,
      },
      include: [
        {
          model: Template,
          as: "templates",
        },
      ],
    }).then(function (orders) {
      res.status(200).send({ code: 200, data: orders, message: "success" });
      return;
    });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchAllOrders = async (req, res) => {
  Order.findAll({
    include: [
      {
        model: Template,
        as: "templates",
      },
    ],
  }).then(function (orders) {
    res.status(200).send({ code: 200, data: orders, message: "success" });
    return;
  });
  return;
};

exports.fetchOrderDetails = async (req, res) => {
  Order.findByPk(Number(req.body.orderId),{
    include: [
      {
        model: Template,
        as: "templates",
      },
    ],
  }).then(function (order) {
    res.status(200).send({ code: 200, data: order, message: "success" });
    return;
  });
  return;
};

exports.markAsPaidOrder = async (req, res) => {
  if (req.body.orderId) {
    Order.update(
      {
        state: "paid",
      },
      {
        where: { id: req.body.orderId },
      }
    ).then(function (result) {});
    res.status(200).send({ code: 200, data: {}, message: "success" });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.cancelOrder = async (req, res) => {
  if (req.body.orderId) {
    Order.update(
      {
        state: "canceled",
      },
      {
        where: { id: req.body.orderId },
      }
    ).then(function (result) {});
    res.status(200).send({ code: 200, data: {}, message: "success" });
  } else {
    res.status(200).send({
      code: 400,
      data: {},
      message: "Incorrect arguemnts",
    });
  }
  return;
};

exports.fetchMyTemplates = async (req, res) => {
  Order.findAll({
    include: [
      {
        model: Template,
        as: "templates",
      },
    ],
  }).then(function (orders) {
    let filteredOrders = orders.filter(
      (order) => order.userId == req.body.userId && order.state == "paid"
    );
    let myTemplates = [];
    filteredOrders.map((order) => {
      for (let i = 0; i < order.templates.length; i++) {
        let existTest = false;
        for (let j = 0; j < myTemplates.length; j++)
          if (myTemplates[j].id === order.templates[i].id) {
            existTest = true;
          }
        if (!existTest) {
          myTemplates.push(order.templates[i]);
        }
      }
    });
    res.status(200).send({ code: 200, data: myTemplates, message: "success" });
    return;
  });
  return;
};

exports.ordersPerMonth = async (req, res) => {
  Order.findAll().then(function (orders) {
    let ordersMonth =[];
    for(let i=0;i<12;i++){
      ordersMonth[i]= 0;
    }
    for(let i=0;i<orders.length;i++){
      switch (String(orders[i].createdAt).split(' ')[1]){
        case 'Jan':ordersMonth[0]++;break;
        case 'Feb':ordersMonth[1]++;break;
        case 'Mar':ordersMonth[2]++;break;
        case 'Apr':ordersMonth[3]++;break;
        case 'May':ordersMonth[4]++;break;
        case 'Jun':ordersMonth[5]++;break;
        case 'Jul':ordersMonth[6]++;break;
        case 'Aug':ordersMonth[7]++;break;
        case 'Sep':ordersMonth[8]++;break;
        case 'Oct':ordersMonth[9]++;break;
        case 'Nov':ordersMonth[10]++;break;
        case 'Dec':ordersMonth[11]++;break;
      }
    }
    res.status(200).send({ code: 200, data: ordersMonth, message: "success" });

  });
  return;
};

exports.ordersPerDay = async (req, res) => {
  Order.findAll().then(function (orders) {
    let ordersDay =[];
    for(let i=0;i<31;i++){
      ordersDay[i]= 0;
    }
    for(let i=0;i<orders.length;i++){
      if(Date().split(' ')[1] == String(orders[i].createdAt).split(' ')[1] ){
        ordersDay[Number(String(orders[i].createdAt).split(' ')[2])-1]++
      }
    }
    res.status(200).send({ code: 200, data: ordersDay, message: "success" });

  });
  return;
};

exports.totalOrdersN = async (req, res) => {
  Order.findAll().then(function (orders) {
    res.status(200).send({ code: 200, data: orders.length, message: "success" });

  });
  return;
};

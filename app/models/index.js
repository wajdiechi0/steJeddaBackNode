const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.template = require("../models/template.model.js")(sequelize, Sequelize);
db.cart = require("../models/cart.model.js")(sequelize, Sequelize);
db.order = require("../models/order.model.js")(sequelize, Sequelize);

db.template.belongsToMany(db.user, {
  through: "user_templates",
  foreignKey: "templateId",
  otherKey: "userId",
});
db.user.belongsToMany(db.template, {
  through: "user_templates",
  foreignKey: "userId",
  otherKey: "templateId",
});

db.user.hasMany(db.order);
db.order.belongsToMany(db.template, {
  through: "order_templates",
  foreignKey: "orderId",
  otherKey: "templateId",
});
db.template.belongsToMany(db.order, {
  through: "order_templates",
  foreignKey: "templateId",
  otherKey: "orderId",
});
module.exports = db;

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    date: {
      type: Sequelize.DATE
    },
    state: {
      type: Sequelize.STRING
    }
  });

  return Order;
};

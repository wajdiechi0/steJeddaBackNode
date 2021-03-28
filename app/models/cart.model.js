module.exports = (sequelize, Sequelize) => {
  const Template = sequelize.define("cart", {
    userId: {
      type: Sequelize.STRING,
    },
    templateId: {
      type: Sequelize.STRING,
    },
  });

  return Template;
};

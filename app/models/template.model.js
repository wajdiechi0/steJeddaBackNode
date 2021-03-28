module.exports = (sequelize, Sequelize) => {
  const Template = sequelize.define("templates", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING(10000)
    },
    img: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.FLOAT(6,2)
    },
    file: {
      type: Sequelize.STRING
    }
  });

  return Template;
};

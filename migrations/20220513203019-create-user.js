'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("Users",  {
      fields: ["username"],
      type: "unique",
      name: "usernameUnique"
    });
  },
down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint("Users", "usernameUnique");
  },
};
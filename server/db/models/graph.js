const Sequelize = require('sequelize')
const db = require('../db')

const Graph = db.define('graph', {
  //save a customized id for each graph
  //do we want colors, width, height anything else customizable
  //will we store all socrata data to aws or will we remake the call everytime
  //space vs complexity/time, aws seems to be unlimited space
  graphId: {
    type: Sequelize.STRING
  },
  xAxis: {
    type: Sequelize.STRING
  },
  // datasetUrl: {
  //     type: Sequelize.STRING,
  //     allowNull: false,
  //     validate: {
  //         isUrl: true
  //     }
  // },
  // shareable: {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: false
  // },
  title: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  xAxisLabel: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  yAxisLabel: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  graphType: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  thumbnail: {
    type: Sequelize.STRING,
    defaultValue: '/graph.gif'
  },
  colors: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: ['#8884d8', '#82ca9d', '#ffc658', '#FF8042']
  }
})

module.exports = Graph

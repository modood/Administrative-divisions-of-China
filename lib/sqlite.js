const path = require('path')

const Sequelize = require('sequelize')

/* Init database */

const sequelize = new Sequelize('gopkg', undefined, undefined, {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../dist/data.sqlite'),
  define: {
    timestamps: false,
    freezeTableName: true
  }
})

/* Create tables */

const code = { type: Sequelize.STRING, primaryKey: true }
const name = Sequelize.STRING

const Province = sequelize.define('province', { code, name })
const City = sequelize.define('city', { code, name })
const Area = sequelize.define('area', { code, name })
const Street = sequelize.define('street', { code, name })
const Village = sequelize.define('village', { code, name })

/* Set foreign key */

City.belongsTo(Province)

Area.belongsTo(Province)
Area.belongsTo(City)

Street.belongsTo(Province)
Street.belongsTo(City)
Street.belongsTo(Area)

Village.belongsTo(Province)
Village.belongsTo(City)
Village.belongsTo(Area)
Village.belongsTo(Street)

/* Connect database */

sequelize.sync()
  .then(() => console.log('db connected!'))
  .error(err => console.log(err))

module.exports = { Province, City, Area, Street, Village }

const pg = require('pg')

module.exports = new pg.Client({
  type: 'postgres'
  ,host: 'ec2-18-215-96-22.compute-1.amazonaws.com'
  ,user: 'caxyxzjlehdski'
  ,password: 'acff716b1d05576ddcbc28e48c8f8b762ade0e69940c5fcf6f04aec12bd4a698'
  ,database: 'd3dnd7jbcik4qh'
  ,port: '5432'
  ,ssl: { rejectUnauthorized: false }
  // ,extra: {
  //   ssl: {
  //     require: true,
  //   }
  // }
})
const pg = require('pg')

// module.exports = new pg.Client('postgres://tryglsovcauemo:b064f875b45a60990abe26423443db0d50efe2f6366e93d439ffff30ba2839b8@ec2-44-194-92-192.compute-1.amazonaws.com:5432/daot2u4hi8n524')

module.exports = new pg.Client({
  type: 'postgres'
  ,host: 'ec2-44-194-92-192.compute-1.amazonaws.com'
  ,user: 'tryglsovcauemo'
  ,password: 'b064f875b45a60990abe26423443db0d50efe2f6366e93d439ffff30ba2839b8'
  ,database: 'daot2u4hi8n524'
  ,port: '5432'
  ,ssl: { rejectUnauthorized: false }
  // ,extra: {
  //   ssl: {
  //     require: true,
  //   }
  // }
})
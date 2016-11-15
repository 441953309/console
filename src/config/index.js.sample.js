const path = require('path');

const config = {
  session:{
    secrets: '0a6b944d-d2fb-46fc-a85e-0295c986cd9f',
  },
  // db: 'mongodb://localhost/mobaders-android'
  db: 'mongodb://localhost/mobaders'
  // db: 'mongodb://mobaders:2283250@dds-2zedcc03374ee6c41.mongodb.rds.aliyuncs.com:3717,dds-2zedcc03374ee6c42.mongodb.rds.aliyuncs.com:3717/mobaders?replicaSet=mgset-2002845'
};

module.exports = config;

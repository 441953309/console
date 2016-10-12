const Koa = require('koa');
const mongoose = require('mongoose');
const config = require('./config');

var connection = mongoose.connect(config.db);
autoIncrement.initialize(connection);
require('./models');
mongoose.Promise = global.Promise;

const app = new Koa();
require('./config/koa')(app);
require('./router/console')(app);

export default app;

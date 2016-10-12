const path = require('path');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const views = require('koa-views');
const config = require('./index');

export default function configKoa(app) {
  app.keys = [config.session.secrets];
  app.use(convert(require('koa-session')(app)));
  app.use(bodyParser());
  app.use(compress());
  app.use(views(path.join(__dirname, '../views'), {
    extension: 'html',
    map: {html: 'ejs'}
  }));
  app.use(require('koa-static')(path.join(__dirname, '../public')));

  app.on('error', err => console.error(err));
}

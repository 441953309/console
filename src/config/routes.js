const mount = require('koa-mount');

const console = require('../router/console');

export default function configRoutes(app) {
  app.use(mount('/console', console.routes()));
}

const Koa = require('./koa/application');
const app = new Koa();

app.use(async (ctx,next) => {
    ctx.body = 'Hello World';
});

app.listen(3000);
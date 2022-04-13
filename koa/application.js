const Emitter = require("events");
const http = require('http');
const compose = require('./compose')

/**
 * Application继承Emitter类
 */
module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.middleware = [];
    this.context = Object.create({});
    this.request = Object.create({});
    this.response = Object.create({});
  }

  use(fn){
    this.middleware.push(fn)
  }

  listen(){
    const server = http.createServer(this.listenCallback());
    return server.listen.apply(server, arguments);
  }

  listenCallback(){
    const dispatch = compose(this.middleware)

    return(req,res)=>{
      const ctx = this.createContext(req, res);

      dispatch(ctx).then(() => this.respond(ctx)).catch((err)=>{
        console.log('出错了',err)
      });
    }
  }

  /**
   * 创建ctx实例
   * @param {*} req 
   * @param {*} res 
   */
  createContext(req,res){
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;

    return context;
  }

  /**
   * 位于中间件的最后，用于处理ctx.body返回
   * @param {*} ctx 
   */
  respond(ctx){
    let body = ctx.body;
    if ('string' == typeof body){
      return ctx.res.end(body);
    } else if('object' == typeof body){
      body = JSON.stringify(body);
      return ctx.res.end(body);
    }
  }
};

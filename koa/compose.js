module.exports = compose;

/**
 * @param {Array} middleware
 * @return {Function}   返回一个函数，函数中执行fn，并把ctx和next当做参数传递
 */
function compose(middleware) {

  /**
   * @param {Object} ctx  Application实例
   * @param {Function} next  作用：递归执行下一个fn
   */
  return function (ctx, next) {
    let index = -1;
    return dispatch(0);

    function dispatch(i) {
      if (i <= index) {
        return;
      }

      let fn = middleware[i];
      index = i;

      if (i === middleware.length) {
        fn = next;
      }

      if (!fn) {
        return Promise.resolve();
      }

      try {
        return Promise.resolve(
          fn(ctx, function next() {
            dispatch(i + 1);
          })
        );
      } catch (error) {
        return Promise.reject(error);
      }
    }
  };
}

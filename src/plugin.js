
// VueLoaderPlugin：在 webpack 编译之前就会执行 plugin
class VueLoaderPlugin {
  apply(compiler) {
    // 拿到 webpack.config.js 内部配置的所有 rules
    const rules = compiler.options.module.rules
    const pitcher = {
      loader: require.resolve('./pitcher'),
      resourceQuery: (query) => {
        if (!query) {
          return false
        }
        let parsed = new URLSearchParams(query.slice(1))
        return parsed.get('vue') !== null
      }
    }

    // 在所有的模块解析规则的最前面加一个 pitcher 规则的 rule
    compiler.options.module.rules = [ pitcher, ...rules ]
  }
}

exports.default = VueLoaderPlugin

// VueLoaderPlugin作用：在 webpack 编译之前就会执行此 plugin，目的是重写 webpack.config.js 内配置的 rules
// { loader: '需要使用的loader', resourceQuery: '匹配条件' }
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

    const templateCompilerRule = {
      loader: require.resolve('./templateLoader'),
      resourceQuery: (query) => {
        if (!query) { return false }
        let parsed = new URLSearchParams(query.slice(1))
        return parsed.get('vue') !== null && parsed.get('type') === 'template'
      }
    }

    // 1.在所有的模块解析规则的最前面加一个 pitcher 规则的 rule
    // 2.在所有的模块解析规则的前面加一个编译 template 规则的 rule
    // 3.拿到所有处理 vue 文件的 loader，塞入到 pitcher 与 template 两个自定义 loader 中间
    const vueRule = rules.find(rule => 'foo.vue'.match(rule.test))
    const cloneRules = rules.filter(rule => rule !== vueRule).map(cloneRule)
    compiler.options.module.rules = [ pitcher, templateCompilerRule, ...rules ]
  }
}

function cloneRule(rule) {
  let currentResource
  const result = Object.assign(Object.assign({}, rule), {
    resource: resource => {
      currentResource = resource
      return true
    },
    resourceQuery: query => {
      if (!query) { return false }
      const parsed = new URLSearchParams(query.slice(1))
      if (parsed.get('vue') === null) {
        return false
      }

      const fakeResourcePath = ruleResource(parsed, currentResource)
      if (!fakeResourcePath.match(rule.test)) {
        return false
      }
      return true
    }
  })

  // 删除 rule 原有正则匹配规则
  delete result.test
  return result
}

// 拿到代码对应的文件后缀 如 xxx.js, xxx.css
const ruleResource = (query, resource) => `${resource}.${query.get('lang')}`

exports.default = VueLoaderPlugin
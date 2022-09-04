const compiler = require('vue/compiler-sfc') // 编译 vue 文件
const hash = require('hash-sum')

const select = require('./select')
const { stringifyRequest } = require('./utils')
const plugin_1 = require("./plugin")
exports.VueLoaderPlugin = plugin_1.default

function loader(source) { // source: example/App.vue 源码
  // loaderContext就是loader函数执行的时候的this指针，上面有很多方法和属性
  // https://webpack.docschina.org/api/loaders/#the-loader-context
  const loaderContext = this
  //resourcePath  =  "/Users/xxx/Documents/learning/mini-vue-loader/example/App.vue" 资源文件的绝对路径。
  //resourceQuery = "?vue&type=script" 资源的 query 参数 
  const { resourcePath, resourceQuery } = loaderContext
  const { descriptor } = compiler.parse(source)
  const id = hash(resourcePath)

  /************ 第二次进来 vue-loader 执行如下 start ************/
  const rawQuery = resourceQuery.slice(1)
  const incomingQuery = new URLSearchParams(rawQuery)
  if (incomingQuery.get('type')) {
    return select.selectBlock(descriptor, id, loaderContext, incomingQuery)
  }
  /************ 第二次进来 vue-loader 执行如下 end ************/



  /************ 第一次进来 vue-loader 执行如下 start ************/
  const code = []
  // 拿到 vue 文件中 <script> 标签内的 js 代码
  const { script, template, styles } = descriptor // { template, script, styles, ... }
  if (script) {
    const query = `?vue&type=script&id=${id}&lang=js`
    // request = "./App.vue?vue&type=script&id=5b5eb0b0&lang=js"
    const request = stringifyRequest(loaderContext, resourcePath + query)
    code.push(`import script from ${request}`)
  }

  const hasScoped = descriptor.styles.some(s => s.scoped)
  // <template> 生成 render 方法
  if (template) {
    const scopedQuery = hasScoped ? `&scoped=true` : ``
    const query = `?vue&type=template&id=${id}${scopedQuery}&lang=js`
    const request = stringifyRequest(loaderContext, resourcePath + query)
    code.push(`import { render } from ${request}`)
  }

  // <style> 生成 css 方法
  if (styles.length > 0) {
    styles.forEach((style, index) => {
      const scopedQuery = style.scoped ? `&scoped=true` : ``
      const query = `?vue&type=style&index=${index}&id=${id}${scopedQuery}&lang=css`
      const request = stringifyRequest(loaderContext, resourcePath + query)
      code.push(`import ${request}`)
    })
  }

  // vue组件局部 css
  if (hasScoped) {
    code.push(`script.__scopeId = "data-v-${id}"`);
  }

  code.push(`script.render = render`)
  code.push(`export default script`)
  console.log("第一次打包code================= \n", code.join('\n'), "\n ============================")
  return code.join('\n')
  /************ 第一次进来 vue-loader 执行如下 end ************/
}

exports.default = loader
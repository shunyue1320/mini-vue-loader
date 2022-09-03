const compiler = require('vue/compiler-sfc') // 编译 vue 文件
const hash = require('hash-sum')

const { stringifyRequest } = require('./utils')
const plugin_1 = require("./plugin");
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



  /************ 第一次进来 vue-loader 执行如下 start ************/
  const code = []
  // 拿到 vue 文件中 <script> 标签内的 js 代码
  const { script } = descriptor // { template, script, styles, ... }
  if (script) {
    const query = `?vue&type=script&id=${id}&lang=js`
    const request = stringifyRequest(loaderContext, resourcePath + query)
    // request = "./App.vue?vue&type=script&id=5b5eb0b0&lang=js"
    code.push(`import script from ${request}`)
  }

  code.push(`script.render = render`)
  code.push(`export default script`)
  console.log("第一次打包code================= \n", code.join('\n'), "\n ============================")
  return code.join('\n')
  /************ 第一次进来 vue-loader 执行如下 end ************/
}

exports.default = loader
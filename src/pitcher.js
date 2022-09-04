const { stringifyRequest } = require('./utils')
const stylePostLoaderPath = require.resolve('./stylePostLoader')

const pitcher = code => code
// loader路径不是当前路径返回 true
const isNotPitcher = loader => loader.path !== __filename
// 查到 css-loader 的下标
const isCSSLoader = loader => /css-loader/.test(loader.path)

const pitch = function (params) {
  const loaderContext = this
  // loaders= [pitcher,vue-loader] 过滤成 [vue-loader]
  const loaders = loaderContext.loaders.filter(isNotPitcher)
  // query = { vue: '', type: 'script' }
  const query = new URLSearchParams(loaderContext.resourceQuery.slice(1))

  if (query.get('type') === 'style') {
    const cssLoaderIndex = loaders.findIndex(isCSSLoader)
    // "-!css-loader!stylePostLoader!vue-loader!app.vuevue&type=style..."
    return genProxyModule(
      [...loaders.slice(0, cssLoaderIndex + 1), { request: stylePostLoaderPath }, ...loaders.slice(cssLoaderIndex + 1)],
      loaderContext
    )
  }

  // return 'export { default } from  "-!vue-loader!/Users/xxx/Documents/learning/mini-vue-loader/example/App.vue?vue&type=script"'
  return genProxyModule(loaders, loaderContext, query.get('type') !== 'template')
}

// 返回拼接好的内联 loader 引用
function genProxyModule(loaders, loaderContext, exportDefault = true) {
  const request = genRequest(loaders, loaderContext)
  // 是 type = template 导入 default， 不是则导入 *
  return exportDefault ? `export { default } from ${request}` : `export * from ${request}`
}

// 把所有匹配到的 loader 拼接成内联 loader
function genRequest(loaders, loaderContext) {
  // loader.request 是loader文件的绝对路径 [ /Users/xxx/Documents/learning/mini-vue-loader/src/index.js ]
  const loaderStrings = loaders.map(loader => loader.request || loader) 
  // resource = "/Users/xxx/Documents/learning/mini-vue-loader/example/App.vue?vue&type=script"
  const resource = loaderContext.resourcePath + loaderContext.resourceQuery
  // 在前面加上关键字，是为了忽略配置文件中的 loader
  return stringifyRequest(loaderContext, '-!' + [...loaderStrings, resource].join('!'))
}

// ⚠️ webpack loader 的执行规则： pitch 有返回时就不会走后续 loader
exports.pitch = pitch
exports.default = pitcher
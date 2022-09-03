const { stringifyRequest } = require('./utils')
const stylePostLoaderPath = require.resolve('./stylePostLoader')

// loader路径不是当前路径返回 true
const isNotPitcher = loader => loader.path !== __filename

const pitch = function (params) {
  const loaderContext = this
  // loaders= [pitcher,vue-loader] 过滤成 [vue-loader]
  const loaders = loaderContext.loaders.filter(isNotPitcher)
  // query=vue&type=script
  const query = new URLSearchParams(loaderContext.resourceQuery.slice(1))
  // query = { vue: '', type: 'script' }
}

// ⚠️ webpack loader 的执行规则： pitch 有返回时就不会走后续 loader
exports.pitch = pitch
exports.default = pitcher
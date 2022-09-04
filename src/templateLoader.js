const compiler = require('vue/compiler-sfc')

function templateLoader(source) {
  const loaderContext = this
  const query = new URLSearchParams(loaderContext.resourceQuery.slice(1))
  const scopedId = query.get('id')
  const { code } = compiler.compileTemplate({
    source,
    id: scopedId
  })

  loaderContext.callback(null, code)
}

module.exports = templateLoader
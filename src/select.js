const compiler = require('vue/compiler-sfc')

// descriptor = { template: "template代码", script: "script代码", styles, ... }
function selectBlock(descriptor, scopedId, loaderContext, query) {
  if (query.get('type') === 'script') {
    const script = compiler.compileScript(descriptor, { id: scopedId })
    loaderContext.callback(null, script.content) // 编译后的JS脚本向后传递给 babel
    return
  }
  if (query.get('type')  === 'template') {
    const template = descriptor.template
    //  template.content = '<h1 class="title">hello world</h1>'
    loaderContext.callback(null, template.content)
    return
  }
}

exports.selectBlock = selectBlock
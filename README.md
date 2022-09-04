# mini-vue-loader
mini vue-loader for learning


## start:
```
pnpm i
pnpm run example:start
```


## 工作流程：
```js
// 0. 在 webpack 编译之前就会执行此 plugin，vueLoaderPlugin 目的是重写 webpack.config.js 内配置的 rules 
class VueLoaderPlugin {
	apply(compiler) {
		// pitcher目的: 将 type = script｜template｜type 3种vue路径生成内联 loader 如：(-!loader1!loader2!/app.vue?type=script)
		// cloneRules是 webpack.config.js 内配置的所有匹配 .vue 的 loader
		// templateCompilerRule目的：<template> 转成 render 的 loader
		// rules 原配置的 loader
		compiler.options.module.rules = [ pitcher, ...cloneRules, templateCompilerRule, ...rules ]
	}
}

// 1. 第一次走进 vue-loader 将 .vue 引入解析成
import script from "./App.vue?vue&type=script&id=123456&lang=js"
import { render } from "./App.vue?vue&type=template&id=123456&scoped=true&lang=js"
import "./App.vue?vue&type=style&index=${index}&id=123456&scoped=true&lang=css"
script.render = render
export default script


// 2. 判断url存在 ?vue 走进 pitcher 将 type = script｜template｜type 3种vue路径生成内联loader
export { default } from "-!/vue-loader/index.js!App.vue?vue&type=script&id=123456&lang=js"
export * from "-!匹配的js内联loader!App.vue?vue&type=template&id=123456&scoped=true&lang=js"
// 把 stylePostLoaderPath 插入css-loader 的右边 如： ['css-loader', 'stylePostLoaderPath']
export * from "-!匹配的css内联loader!App.vue?vue&type=template&id=123456&scoped=true&lang=css"

// 3. 第二次走进 vue-loader, webpack 判断 !! 只走内联 loader 所以会在此走到 vue-loader 里面
const compiler = require('vue/compiler-sfc');
// vue-loader 发现 url 有 type=script 并使用 require('vue/compiler-sfc').compileScript 编译源代码并返回
const script = compiler.compileScript(descriptor, { id: scopedId })
loaderContext.callback(null, script.content)
// vue-loader 发现 url 有 type=template 并使用 require('vue/compiler-sfc').compileTemplate 编译源代码并返回
const { code } = compiler.compileTemplate({source, id: scopeId })
loaderContext.callback(null, code)
// vue-loader 发现 url 有 type=style 并使用 require('vue/compiler-sfc').compileStyle 编译源代码并返回
const { code } = compiler.compileStyle({
  source,
  id: `data-v-${query.get('id')}`,
  scoped: !!query.get('scoped')
});
loaderContext.callback(null, code)
```
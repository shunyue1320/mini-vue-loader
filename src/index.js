const plugin_1 = require("./plugin");
exports.VueLoaderPlugin = plugin_1.default

function loader(source) {
  console.log("source=====", source)
}

exports.default = loader
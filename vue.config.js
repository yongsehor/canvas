const pxtorem = require("postcss-pxtorem");

module.exports = {
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        lessOptions: {
          modifyVars: {
            // 直接覆盖变量
            // "text-color": "#111",
            // "border-color": "#eee",
            // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "src/assets/css/style.less";`,
          },
        },
      },
      postcss: {
        plugins: [
          pxtorem({
            rootValue: 37.5,
            propList: ["*"],
            // 该项仅在使用 Circle 组件时需要
            // 原因参见 https://github.com/youzan/vant/issues/1948
            selectorBlackList: ["van-circle__layer"],
          }),
        ],
      },
    },
  },
};

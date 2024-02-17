const { src, dest } = require("gulp");
const babel = require("gulp-babel");

exports.default = function () {
  return src("js/*.js").pipe(babel()).pipe(dest("output/"));
};

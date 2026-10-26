// 新しい Node.js で Nuxt 2.12 を動かすための互換パッチ。
// package.json の dev / build / start / generate で `node -r ./tools/node-compat.js` として先に読み込む。
// .nvmrc の Node 16（CI も同じ）では何もしない。
const crypto = require("crypto");
const fs = require("fs");
const Module = require("module");
const path = require("path");

const major = Number(process.versions.node.split(".")[0]);

// Node 17 以降は OpenSSL 3 になり、webpack 4 が使う md4 ハッシュが使えない。
// --openssl-legacy-provider を付ける代わりに、md4 を sha256 に置き換える。
if (major >= 17) {
  const createHash = crypto.createHash;
  crypto.createHash = (algorithm, options) =>
    createHash(algorithm === "md4" ? "sha256" : algorithm, options);
}

// Node 22 以降では esm パッケージ（Nuxt 2.12 が nuxt.config.js やモジュールの読み込みに使う）が
// 読み込んだ時点でクラッシュする。また Node 22 は import/export を含む .js を ES モジュールとして扱うため、
// require と import が混在した古いパッケージ（@nuxtjs/style-resources など）も読めない。
// そこで、import/export を含む .js は require 時に Babel で CommonJS に変換し、
// require("esm") はただの require を返す代替に差し替える。
if (major >= 22) {
  const ESM_SYNTAX = /^\s*(import|export)\s/m;
  const typeModuleCache = new Map();

  // 最寄りの package.json が "type": "module" なら本物の ES モジュールなので Node に任せる
  const isTypeModule = filename => {
    let dir = path.dirname(filename);
    const visited = [];
    while (true) {
      if (typeModuleCache.has(dir)) break;
      visited.push(dir);
      const pkg = path.join(dir, "package.json");
      if (fs.existsSync(pkg)) {
        let type = "";
        try {
          type = JSON.parse(fs.readFileSync(pkg, "utf8")).type || "";
        } catch (e) {
          // 読めない package.json は CommonJS とみなす
        }
        typeModuleCache.set(dir, type === "module");
        break;
      }
      const parent = path.dirname(dir);
      if (parent === dir) {
        typeModuleCache.set(dir, false);
        break;
      }
      dir = parent;
    }
    const result = typeModuleCache.get(dir);
    visited.forEach(d => typeModuleCache.set(d, result));
    return result;
  };

  const loadJs = Module._extensions[".js"];
  Module._extensions[".js"] = function (module, filename) {
    const code = fs.readFileSync(filename, "utf8");
    if (ESM_SYNTAX.test(code) && !isTypeModule(filename)) {
      const babel = require("@babel/core");
      const result = babel.transformSync(code, {
        filename,
        babelrc: false,
        configFile: false,
        // import/export がなければスクリプトとして扱い、何も変換しない
        sourceType: "unambiguous",
        plugins: [require.resolve("@babel/plugin-transform-modules-commonjs")]
      });
      module._compile(result.code, filename);
      return;
    }
    loadJs.call(this, module, filename);
  };

  // esm(module)(id) と同じ呼び出し方で、親モジュールからの require を返す
  const esmShim = parent => id => parent.require(Module._resolveFilename(id, parent));
  const load = Module._load;
  Module._load = function (request, parent, isMain) {
    if (request === "esm") return esmShim;
    return load.call(this, request, parent, isMain);
  };
}

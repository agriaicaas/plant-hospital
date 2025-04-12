const fs = require('fs');
const path = require('path');

// 读取 HTML 文件
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// 读取并内联 CSS
const cssPath = path.join(__dirname, 'dist', 'assets', 'index.css');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  html = html.replace(
    /<link rel="stylesheet" href="\.\/assets\/index\.css">/,
    `<style>${css}</style>`
  );
}

// 读取并内联 JS
const jsPath = path.join(__dirname, 'dist', 'assets', 'index.js');
if (fs.existsSync(jsPath)) {
  const js = fs.readFileSync(jsPath, 'utf8');
  html = html.replace(
    /<script type="module" src="\.\/assets\/index\.js"><\/script>/,
    `<script>${js}</script>`
  );
}

// 写入处理后的 HTML
fs.writeFileSync(htmlPath, html);

console.log('Assets have been inlined successfully!'); 
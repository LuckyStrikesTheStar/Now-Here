# The Painted Cabinet 绘画柜子网站

可直接交给 GitHub 管理的完整静态网站。代码、插画、Pixelta 字体和 p5.js 均在仓库中，无需 npm、构建步骤或后端。

## 首次发布：网页操作

1. 在 GitHub 创建名为 `painted-cabinet` 的仓库。使用 GitHub 免费方案时选择 Public（公开）；仓库内的代码和插画也会公开。
2. 解压本压缩包，打开 `painted-cabinet-github` 文件夹。
3. 在仓库选择 **Add file → Upload files**，上传里面的 `docs` 文件夹和 `README.md`，提交到 `main` 分支。不要上传 ZIP 本身，也不要多套一层 `painted-cabinet-github` 文件夹。
4. 确认仓库中存在 `docs/index.html`。
5. 打开 **Settings → Pages**，Source 选择 **Deploy from a branch**，Branch 选择 **main**，目录选择 **/docs**，点击 **Save**。
6. 等待 Pages 部署完成，打开该页面显示的网站网址，通常是 `https://你的用户名.github.io/painted-cabinet/`。将这个网址发给其他设备即可访问，无需登录 ChatGPT。

GitHub 官方指南：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 日常修改

在 GitHub 打开需要修改的文件，点击编辑并提交；Pages 会重新发布。历史版本可以从提交记录中查看和恢复。文件名区分大小写，保持相对路径，不要给资源地址添加开头的 `/`。

| 文件 | 用途 |
| --- | --- |
| `docs/index.html` | 柜子首页、物件位置和页面链接 |
| `docs/style.css` | 首页字体、布局和悬停动画 |
| `docs/embed-fit.js` | 中间画面完整缩放适配 |
| `docs/cabinet-seasons.js` | 四只兔子的季节切换 |
| `docs/restaurant.html` | 本地 p5.js 场景入口，无 OpenProcessing 顶栏 |
| `docs/restaurant.js` / `docs/seasons.js` | 店铺绘制、季节效果 |
| `docs/yellow-creature.html` | 黄色角色插画页面、热点和提示文字 |
| `docs/world-motion.js` | 插画动态效果 |
| `docs/world-spots.js` | 热点提示框交互 |
| `docs/world-clicks.js` | 点击累积 WHAT ELSE，避开上方站立角色 |
| `docs/assets/` | 图片、字体、本地 p5.js |

如需导出单文件 p5.js 代码，合并 `restaurant.js` 和 `seasons.js` 更新 `mySketch-seasons.js`。网站自身直接加载前两个文件。

## 本地预览

安装 Python 后，在此文件夹运行：

```sh
python3 -m http.server 8000 --directory docs
```

浏览器打开 http://localhost:8000 。不要直接双击 HTML，以免浏览器限制 iframe 内的季节切换。

## 已保留的功能和设备说明

- 柜子物件悬停放大与摆动，点击进入对应页面。
- 黄色、橙色、紫色、绿色兔子分别切换春、夏、秋、冬。
- 黄色角色插画动画、提示框和 WHAT ELSE 点击效果。
- 页面按屏幕比例缩放；手机横屏能更清楚地看到整幅插画，触屏可点按热点查看文字。
- 点击生成的文字只保留在当前页面会话，刷新后清空，不在设备间同步。
- 某些物件页面仍是现有占位页，可继续编辑各自的 HTML。

## 资源说明

包含当前网站使用的素材，确保完整显示。p5.js 的许可证信息保留在 `docs/assets/p5.min.js` 中。发布前请确认插画和字体允许采用所选的公开发布方式；本包不替素材重新授予许可证。

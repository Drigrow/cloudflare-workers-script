# 欢迎来到 Drigrow 的仓库

中文版 | [English version](https://github.com/Drigrow/cloudflare-workers-script/blob/main/README.md)

**简介**

这是一个用于存储我在 Cloudflare Workers 上部署服务的 JavaScript 代码的仓库。大多数代码是从原始模板修改而来的，我自己添加了用户界面（UI）和交互功能。另有一些用于我的服务器，例如 urlrewrite，用于重写 URL，这样就不需要 .html 后缀。

**注意**

你可以随意使用或修改此仓库中的任何代码，但不能用于商业用途（你可以使用 Cloudflare 模板和 Microsoft Copilot 生成类似代码）。

**使用方法**

- *在 Cloudflare 仪表板中创建一个 Worker*：登录你的 Cloudflare 账户并导航到 Workers & Pages。点击 Create Worker 部署一个基本的 Worker 脚本。
- *编辑代码*：Worker 部署后，点击仪表板页面上的 Edit Code。这将打开 Cloudflare 的在线代码编辑器。
- *替换脚本*：打开此仓库中的所需 JavaScript 文件（例如 chat.js 或其他文件），复制其内容。回到 Cloudflare 编辑器，删除现有的模板代码，粘贴复制的脚本。
- *部署*：点击右上角的 Deploy 按钮以应用更改。Worker 现在已经上线，并且你可以通过添加自定义域名进一步增强可访问性。这允许你使用自己的域名访问你的服务，并利用 Cloudflare CDN 进行高效分发。

有关更多详细指南，请参阅[*指南-英文版*](https://drigrowpersonal.eu.org/github-repo-guide)或[*指南-中文版*](https://www.bilibili.com/read/cv39299108)。

P.S. 一些文件中有 `<link rel="icon" href="https://drigrowpersonal.eu.org/favicon.ico" type="image/x-icon">` 在 HTML 区域，这是我的图标，如果你想清除它，删除 `<link>` 标签即可。

联系我：[Drigrow@bilibili](https://space.bilibili.com/652661680) 或 formal@drigrowpersonal.eu.org

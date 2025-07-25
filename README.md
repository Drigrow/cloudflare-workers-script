# Welcome to Drigrow's repository

English version | [中文](https://github.com/Drigrow/cloudflare-workers-script/blob/main/README-CN.md)

**INTRO:**

This is a repo to store my js code used in deploying services on cloudflare workers. Most of them are modified from its original template and i add userinterface(ui) and interactions myself. ALso there are some for my server like urlrewrite which used for re-write url so no .html suffix is needed.

**NOTICE:**

You feel free to use or modify any of the code in this repo but not for commercial use (you can generate similar code using cloudflare template w/microsoft copilot). 

**HOW TO USE:**

To use the repository with Cloudflare Workers, follow these steps:

- *Create a Worker in Cloudflare Dashboard*: Log into your Cloudflare account and navigate to Workers & Pages. Click Create Worker to deploy a basic worker script.

- *Edit Code*: Once the worker is deployed, click Edit Code on the worker's dashboard page. This will open Cloudflare's online code editor.

- *Replace the Script*: Open the desired JavaScript file from this repository (e.g., chat.js, or any other file) and copy its content. Go back to the Cloudflare editor, remove the existing template code, and paste the copied script.

- *Deploy*: Click the Deploy button in the top right corner to apply the changes. The worker is now live, and you can further enhance accessibility by adding a custom domain. This allows you to access your service using your own domain and leverage Cloudflare CDN for efficient distribution.

For more detailed guidance, refer to [*Guide-EN*](https://drigrowpersonal.eu.org/github-repo-guide) or [*Guide-CN*](https://www.bilibili.com/read/cv39299108).

p.s. Some of the files have `<link rel="icon" href="https://drigrowpersonal.eu.org/favicon.ico" type="image/x-icon">` in html zone that its my icon, if you'd like to clear it, delete the `<link>` lable.

p.p.s. On 7/2025 I found it not working on cf Workers platform and I got why. Now cf require user to bind AI to current worker. Here's how:

- Open your Workers webpage and select the project. -> Select `Bindings` -> Click `Add Bindings` and add Worker AI with name `AI` -> Finish



contact me at:
[Drigrow@bilibili](https://space.bilibili.com/652661680) or formal@drigrowpersonal.eu.org

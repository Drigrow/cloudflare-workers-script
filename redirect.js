addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const baseUrls = ["drigrowpersonal.eu.org", "sarahamathematics.fr.eu.org"];
const availableSubdomains = ["llm", "txt2img", "imgclsfy", "speech2txt", "translation", "censor", "copilot", "blog"];

async function handleRequest(request) {
  const url = new URL(request.url);
  const gotoUrl = url.searchParams.get("goto");

  if (gotoUrl) {
    if (gotoUrl.startsWith("http://") || gotoUrl.startsWith("https://")) {
      // Handle full URL query string
      try {
        const response = await fetch(gotoUrl);
        if (!response.ok) {
          return new Response(showUsagePage(`Error: Received status ${response.status} from ${gotoUrl}`), { headers: { "Content-Type": "text/html" } });
        } else {
          return Response.redirect(gotoUrl, 302);
        }
      } catch (error) {
        return new Response(showUsagePage(`Error: Unable to reach ${gotoUrl}`), { headers: { "Content-Type": "text/html" } });
      }
    } else {
      // Handle simple query string like "llm"
      const randomIndex = Math.random() < 0.5 ? 0 : 1;
      const redirectUrl = `https://${gotoUrl}.${baseUrls[randomIndex]}`;

      try {
        const response = await fetch(redirectUrl);
        if (!response.ok) {
          return new Response(showUsagePage(`Error: Received status ${response.status} from ${redirectUrl}`), { headers: { "Content-Type": "text/html" } });
        } else {
          return Response.redirect(redirectUrl, 302);
        }
      } catch (error) {
        return new Response(showUsagePage(`Error: Unable to reach ${redirectUrl}`), { headers: { "Content-Type": "text/html" } });
      }
    }
  } else {
    return new Response(showUsagePage(""), { headers: { "Content-Type": "text/html" } });
  }
}

function showUsagePage(errorMsg) {
  return `
    <html>
      <head>
        <title>Redirect Page</title>
      </head>
      <body>
        <h1>Welcome to the Redirect Service</h1>
        ${errorMsg ? `<p><strong>${errorMsg}</strong></p>` : ""}
        <p>Use the query string <code>?goto=</code> to redirect to the desired service.</p>
        <p>For example:</p>
        <ul>
          <li><a href="?goto=llm">?goto=llm</a> will redirect you to <code>https://llm.drigrowpersonal.eu.org/</code> or <code>https://llm.sarahamathematics.fr.eu.org/</code></li>
          <li><a href="?goto=txt2img">?goto=txt2img</a> will redirect you to <code>https://txt2img.drigrowpersonal.eu.org/</code> or <code>https://txt2img.sarahamathematics.fr.eu.org/</code></li>
        </ul>
        <p>Available subdomains:</p>
        <ul>
          ${availableSubdomains.map(sd => `<li><a href="?goto=${sd}">${sd}</a></li>`).join('')}
        </ul>
        <p>p.s. the blog and copilot only supports drigrowpersonal.eu.org domain, visit blog at <a href="https://blog.drigrowpersonal.eu.org/">here</a>  and copilot at <a href="https://copilot.drigrowpersonal.eu.org/">here</a> for ease of use. (or you will have 50% chance to enter the correct site)
      </body>
    </html>
  `;
}

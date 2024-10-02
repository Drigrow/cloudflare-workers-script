export default {
  async fetch(request, env) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Text to Image</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 600px; margin: auto; }
          textarea { width: 100%; height: 100px; }
          input[type="number"] { width: 100%; }
          .images { display: flex; flex-wrap: wrap; gap: 10px; }
          .images img { max-width: 100%; height: auto; }
          .notice { margin-top: 10px; color: ; }
          .loading { text-align: center; margin-top: 10px; }
          .loading span { display: inline-block; margin: 0 2px; animation: bounce 0.6s infinite alternate; }
          .loading span:nth-child(2) { animation-delay: 0.2s; }
          .loading span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes bounce {
            to { transform: translateY(-10px); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Text to Image</h1>
          <p class="notice">This site is built using Cloudflare Workers. Availability and suitability are not guaranteed.</p>
          <form id="form">
            <label for="prompt">Prompt:</label>
            <textarea id="prompt" name="prompt" required>a cyberpunk cat sitting in ruined city</textarea>
            <label for="imgCount">Number of Images (1-9):</label>
            <input type="number" id="imgCount" name="imgCount" min="1" max="9" value="1" required>
            <button type="submit">Generate</button>
          </form>
          <p>Generated images will appear below:</p>
          <p>External site: <a href="https://drigrowpersonal.eu.org">What's my IP address?</a></p>
          <div class="images" id="images"></div>
          <div class="loading" id="loading" style="display: none;">
            Generating<span>.</span><span>.</span><span>.</span>
          </div>
        </div>
        <script>
          document.getElementById('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const prompt = document.getElementById('prompt').value;
            const imgCount = document.getElementById('imgCount').value;
            const imagesContainer = document.getElementById('images');
            const loading = document.getElementById('loading');
            imagesContainer.innerHTML = '';
            loading.style.display = 'block';

            for (let i = 0; i < imgCount; i++) {
              const inputs = { prompt };
              const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
              });
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const img = document.createElement('img');
              img.src = url;
              imagesContainer.appendChild(img);
            }
            loading.style.display = 'none';
          });
        </script>
      </body>
      </html>
    `;

    if (request.method === 'GET') {
      return new Response(html, {
        headers: { 'content-type': 'text/html' },
      });
    } else if (request.method === 'POST' && request.url.endsWith('/generate')) {
      const { prompt } = await request.json();
      const inputs = { prompt };
      const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);
      return new Response(response, {
        headers: { 'content-type': 'image/png' },
      });
    } else {
      return new Response('Not Found', { status: 404 });
    }
  },
};

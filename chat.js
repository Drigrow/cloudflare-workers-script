export default {
  async fetch(request, env) {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Chat</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f0f8ff; color: #333; padding: 20px; display: flex; flex-direction: column; align-items: center; }
          .container { max-width: 600px; width: 100%; }
          .chatbox { background-color: #fff; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); padding: 20px; margin-bottom: 10px; max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
          .chatbox .message { padding: 10px; border-radius: 10px; max-width: 80%; word-wrap: break-word; white-space: pre-wrap; }
          .chatbox .message.user { background-color: #dcf8c6; align-self: flex-end; }
          .chatbox .message.ai { background-color: #f1f0f0; align-self: flex-start; }
          .input-box { display: flex; gap: 10px; width: 100%; }
          .input-box textarea { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #ccc; resize: none; max-height: 100px; }
          .input-box button { padding: 10px; border-radius: 10px; border: none; background-color: #4CAF50; color: white; cursor: pointer; }
          .input-box button:hover { background-color: #45a049; }
          .notice { margin-top: 10px; color: red; text-align: center; }
          .new-topic { margin-top: 10px; padding: 10px; border-radius: 10px; border: none; background-color: #f44336; color: white; cursor: pointer; }
          .new-topic:hover { background-color: #e53935; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 2em; color: #333; }
          .header p { margin: 5px 0; color: #666; }
          .loading { text-align: center; margin-top: 10px; }
          .loading span { display: inline-block; margin: 0 2px; animation: bounce 0.6s infinite alternate; }
          .loading span:nth-child(2) { animation-delay: 0.2s; }
          .loading span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes bounce {
            to { transform: translateY(-10px); }
          }
          .mode-selector { margin-top: 10px; display: flex; align-items: center; gap: 10px; }
          .mode-selector select { padding: 5px; border-radius: 5px; border: 1px solid #ccc; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AI Chat</h1>
            <p class="notice">This site uses AI, it may display inaccurate info, so double-check its responses.</p>
            <p class="notice">This site will not save any data.</p>
          </div>
          <div class="chatbox" id="chatbox"></div>
          <div class="input-box">
            <textarea id="userInput" placeholder="Type your message here..."></textarea>
            <button id="sendButton" disabled>Send</button>
          </div>
          <button class="new-topic" id="newTopicButton">New Topic</button>
          <div class="mode-selector">
            <label for="mode">Mode:</label>
            <select id="mode">
              <option value="creative">Creative</option>
              <option value="balanced" selected>Balanced</option>
              <option value="precise">Precise</option>
              <option value="chinese">Chinese Understanding Enhance</option>
            </select>
            <span id="currentMode">Current Mode: Balanced</span>
          </div>
        </div>
        <script>
          let isResponding = false;
          let mode = 'balanced';

          document.getElementById('sendButton').addEventListener('click', sendMessage);
          document.getElementById('userInput').addEventListener('input', () => {
            document.getElementById('sendButton').disabled = !document.getElementById('userInput').value.trim();
            adjustTextareaHeight();
          });
          document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          });
          document.getElementById('newTopicButton').addEventListener('click', () => {
            location.reload();
          });
          document.getElementById('mode').addEventListener('change', (e) => {
            mode = e.target.value;
            document.getElementById('currentMode').textContent = 'Current Mode: ' + mode.charAt(0).toUpperCase() + mode.slice(1);
          });

          function adjustTextareaHeight() {
            const textarea = document.getElementById('userInput');
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
          }

          async function sendMessage() {
            if (isResponding) return;

            const userInput = document.getElementById('userInput').value;
            if (!userInput) return;

            isResponding = true;
            document.getElementById('sendButton').disabled = true;
            const chatbox = document.getElementById('chatbox');
            chatbox.innerHTML += '<div class="message user">' + userInput + '</div>';
            document.getElementById('userInput').value = '';
            adjustTextareaHeight();

            const loading = document.createElement('div');
            loading.className = 'message ai loading';
            loading.innerHTML = 'AI is generating<span>.</span><span>.</span><span>.</span>';
            chatbox.appendChild(loading);
            chatbox.scrollTop = chatbox.scrollHeight;

            let systemContent = 'You are a helpful assistant.';
            if (mode === 'creative') {
              systemContent = 'Respond creatively to each query, offering innovative ideas and unique perspectives. Maintain a balance between originality and clarity, ensuring the response is engaging yet understandable. Keep the response at a readable length, and if the user asks "shortly," reply in a much briefer, concise version. Avoid using emojis but emoticons are okay.';
            } else if (mode === 'balanced') {
              systemContent = 'Provide a balanced response that considers multiple perspectives or arguments. Reply casual questions casually. Ensure the response is well-rounded, logically organized, and maintains readability. If the user specifies "shortly," deliver a concise and summarized version.Avoid using emojis but emoticons are okay.';
            } else if (mode === 'precise') {
              systemContent = 'Deliver a precise, concise response that is clear and accurate, keeping it at a proper length for readability. If the user requests "shortly," provide an even more concise, direct response with only the essential information. Avoid using emojis.';
            } else if (mode === 'chinese') {
              systemContent = 'Respond in Simplified Chinese with a focus on advanced language usage, including idiomatic expressions and cultural references. Ensure proper readability with a clear, logical structure, adjusting the length for clarity. If the user asks "shortly," reply with a much briefer, summarized version while retaining precision.Avoid using emojis but emoticons are okay.';
            }

            const messages = [
              { role: 'system', content: systemContent },
              { role: 'user', content: userInput }
            ];

            let response = await fetch('/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages })
            });
            let data = await response.json();

            const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\u200d]+/gu;
            let shortlyCount = 0;

            while (!/[.!?。！？]$/.test(data.response.response.trim().replace(/["“”]/g, '')) && !emojiRegex.test(data.response.response.trim().slice(-1)) && shortlyCount < 3) {
              messages[1].content += ', shortly';
              response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
              });
              data = await response.json();
              shortlyCount++;
            }

            chatbox.removeChild(loading);
            const message = document.createElement('div');
            message.className = 'message ai';
            message.innerHTML = data.response.response.replace(/\\n/g, '<br>');
            chatbox.appendChild(message);
            chatbox.scrollTop = chatbox.scrollHeight;
            isResponding = false;
            document.getElementById('sendButton').disabled = false;
          }
        </script>
        <br>
      <footer>External site: <a href="https://drigrowpersonal.eu.org">What's my IP adress?</a></footer>
      </body>
      </html>
    `;

    if (request.method === 'GET') {
      return new Response(html, {
        headers: { 'content-type': 'text/html' },
      });
    } else if (request.method === 'POST' && request.url.endsWith('/chat')) {
      const { messages } = await request.json();
      const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });
      return new Response(JSON.stringify({ response }), {
        headers: { 'content-type': 'application/json' },
      });
    } else {
      return new Response('Not Found', { status: 404 });
    }
  },
};

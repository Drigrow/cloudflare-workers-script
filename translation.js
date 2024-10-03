export default {
    async fetch(request, env) {
      if (request.method === 'POST') {
        const { audio, text, source_lang, target_lang } = await request.json();
  
        if (audio) {
          const inputs = { audio };
          const speechResponse = await env.AI.run('@cf/openai/whisper', inputs);
          return new Response(JSON.stringify({ inputs, response: speechResponse }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
  
        if (text) {
          const inputs = { text, source_lang, target_lang };
          const response = await env.AI.run('@cf/meta/m2m100-1.2b', inputs);
  
          // Split the input text by lines and translate each line separately
          const lines = text.split('\n');
          const translatedLines = await Promise.all(lines.map(async (line) => {
            const lineInputs = { text: line, source_lang, target_lang };
            const lineResponse = await env.AI.run('@cf/meta/m2m100-1.2b', lineInputs);
            return lineResponse.translated_text;
          }));
  
          const translatedText = translatedLines.join('\n');
          return new Response(JSON.stringify({ inputs, response: { translated_text: translatedText } }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
  
      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link rel="icon" href="https://drigrowpersonal.eu.org/favicon.ico" type="image/x-icon">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Multilanguage Translation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background: #fff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 8px;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                label {
                    display: block;
                    margin-top: 10px;
                    color: #555;
                }
                textarea, select, button {
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                textarea {
                    resize: vertical;
                    height: 100px;
                }
                button {
                    background-color: #007BFF;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
                #result {
                    margin-top: 20px;
                    padding: 10px;
                    background: #e9ecef;
                    border-radius: 4px;
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Multilingual Translation</h1>
                <button id="toggleButton">Start Recording</button>
                <form id="translationForm">
                    <label for="text">Text to translate:</label>
                    <textarea id="text" name="text" required></textarea>
                    <label for="source_lang">Source Language:</label>
                    <select id="source_lang" name="source_lang">
                        <option value="en">English</option>
                        <option value="zh">Simplified Chinese</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                        <option value="el">Greek</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="it">Italian</option>
                        <option value="pl">Polish</option>
                        <option value="ru">Russian</option>
                        <option value="pt">Portuguese</option>
                    </select>
                    <label for="target_lang">Target Language:</label>
                    <select id="target_lang" name="target_lang">
                        <option value="en">English</option>
                        <option value="zh">Simplified Chinese</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                        <option value="el">Greek</option>
                        <option value="ja">Japanese</option>
                        <option value="ko">Korean</option>
                        <option value="it">Italian</option>
                        <option value="pl">Polish</option>
                        <option value="ru">Russian</option>
                        <option value="pt">Portuguese</option>
                    </select>
                    <button type="submit">Translate</button>
                </form>
                <div id="result"></div>
            </div>
            <script>
                const toggleButton = document.getElementById('toggleButton');
                const result = document.getElementById('result');
                const textArea = document.getElementById('text');
                let mediaRecorder;
                let audioChunks = [];
                let isRecording = false;
  
                toggleButton.addEventListener('click', async () => {
                    if (!isRecording) {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.start();
                        isRecording = true;
                        toggleButton.textContent = 'Stop Recording';
  
                        mediaRecorder.addEventListener('dataavailable', event => {
                            audioChunks.push(event.data);
                        });
  
                        mediaRecorder.addEventListener('stop', async () => {
                            const audioBlob = new Blob(audioChunks);
                            const arrayBuffer = await audioBlob.arrayBuffer();
                            const uint8Array = new Uint8Array(arrayBuffer);
  
                            const response = await fetch('/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ audio: [...uint8Array] })
                            });
  
                            const data = await response.json();
                            textArea.value = data.response.text;
                            audioChunks = [];
                        });
                    } else {
                        mediaRecorder.stop();
                        isRecording = false;
                        toggleButton.textContent = 'Start Recording';
                    }
                });
  
                document.getElementById('translationForm').addEventListener('submit', async (event) => {
                    event.preventDefault();
  
                    const text = document.getElementById('text').value;
                    const sourceLang = document.getElementById('source_lang').value;
                    const targetLang = document.getElementById('target_lang').value;
  
                    const response = await fetch('/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang })
                    });
  
                    const result = await response.json();
                    document.getElementById('result').innerText = result.response.translated_text;
                });
            </script>
        </body>
        </html>
      `;
  
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  };
  

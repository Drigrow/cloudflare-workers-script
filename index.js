export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const { audio } = await request.json();
      const inputs = { audio };
      const response = await env.AI.run('@cf/openai/whisper', inputs);
      return new Response(JSON.stringify({ inputs, response }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Speech to Text</title>
      </head>
      <body>
          <h1>Speech to Text</h1>
          <button id="toggleButton">Start Recording</button>
          <p id="result"></p>

          <script>
              const toggleButton = document.getElementById('toggleButton');
              const result = document.getElementById('result');
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
                          result.textContent = data.response.text;
                          audioChunks = [];
                      });
                  } else {
                      mediaRecorder.stop();
                      isRecording = false;
                      toggleButton.textContent = 'Start Recording';
                  }
              });
          </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};

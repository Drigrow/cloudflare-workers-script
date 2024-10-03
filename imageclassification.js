export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const formData = await request.formData();
      const imageFile = formData.get('image');
      const blob = await imageFile.arrayBuffer();

      const inputs = {
        image: [...new Uint8Array(blob)],
      };

      // Step 1: Classify the image
      const classificationResponse = await env.AI.run('@cf/microsoft/resnet-50', inputs);
      const labels = classificationResponse.map(item => item.label.toLowerCase()).join(', ');

      // Step 2: Generate descriptive passage
      const chatInput = {
        messages: [
          { role: 'system', content: 'Generate a simple, clear passage using the provided words, focusing primarily on the first label but also covering the first several labels in a concise manner. Keep the description straightforward, no longer than three sentences or 50 words. Ensure the passage prioritizes the first label while incorporating the next few without repetition or unnecessary complexity.' },
          { role: 'user', content: labels }
        ]
      };
      const passageResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', chatInput);

      // Generate varying leading sentences
      const leadingSentences = [
        `Well, well, there must be ${labels} in the image!`,
        `Aha! I see ${labels} in there.`,
        `Looks like we've got ${labels} in the image!`,
        `Hmm, it appears to contain ${labels}.`,
        `Interesting... I think I see ${labels}.`
      ];
      const selectedSentence = leadingSentences[Math.floor(Math.random() * leadingSentences.length)];

      return new Response(JSON.stringify({
        initialMessage: selectedSentence,
        followUpMessage: "Let's describe the image!",
        description: passageResponse.response
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Image Classifier</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            header {
              font-size: 24px;
              margin-bottom: 20px;
              color: #0056b3;
            }
            form {
              display: flex;
              flex-direction: column;
              align-items: center;
              background: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              width: 100%;
              max-width: 600px;
              box-sizing: border-box;
            }
            input[type="file"] {
              display: none;
            }
            label {
              padding: 10px 20px;
              background-color: #0056b3;
              color: #fff;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              width: 100%;
              text-align: center;
              box-sizing: border-box;
            }
            label:hover {
              background-color: #004494;
            }
            img {
              width: 100%;
              max-width: 600px;
              margin-top: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            pre {
              text-align: left;
              background: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              margin-top: 20px;
              width: 100%;
              max-width: 600px;
              overflow: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
              box-sizing: border-box;
            }
            #result {
              white-space: pre-wrap;
              word-wrap: break-word;
              text-align: left;
              background: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              margin-top: 20px;
              width: 100%;
              max-width: 600px;
              overflow: auto;
              box-sizing: border-box;
            }
          </style>
          <link rel="icon" href="https://drigrowpersonal.eu.org/favicon.ico" type="image/x-icon">
        </head>
        <body>
          <header>Image Classifier</header>
          <p>Upload an image to see what's in it!</p>
          <p>*Just for fun lol</p>
          <form id="uploadForm" method="post" enctype="multipart/form-data">
            <label for="imageUpload">Choose File</label>
            <input type="file" id="imageUpload" name="image" accept="image/*" required>
          </form>
          <img id="uploadedImage" src="" alt="">
          <div id="result"></div>
          <script>
            document.getElementById('imageUpload').onchange = async function (e) {
              e.preventDefault();
              const formData = new FormData(e.target.form);
              const imageFile = formData.get('image');
              const imageUrl = URL.createObjectURL(imageFile);
              document.getElementById('uploadedImage').src = imageUrl;
              const resultDiv = document.getElementById('result');
              resultDiv.innerHTML = ''; // Clear previous output
              const response = await fetch('', {
                method: 'POST',
                body: formData,
              });
              const result = await response.json();
              resultDiv.innerHTML = \`<p>\${result.initialMessage}</p>\`;
              setTimeout(() => {
                resultDiv.innerHTML += \`<p>\${result.followUpMessage}</p>\`;
                setTimeout(() => {
                  resultDiv.innerHTML += \`<p>\${result.description}</p>\`;
                }, 500);
              }, 500);
            };
          </script>
          <footer>This site uses AI, it may display inaccurate info, so double-check its responses.</footer>
        </body>
        </html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  },
};

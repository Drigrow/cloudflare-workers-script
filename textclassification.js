export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const query = url.searchParams.get("resultfor");
    let text = query || "Enter text here";

    if (request.method === "POST") {
      const formData = await request.formData();
      text = formData.get("text") || text;
    }

    const inputs = { text };

    const response = await env.AI.run("@cf/huggingface/distilbert-sst-2-int8", inputs);
    const positiveScore = response.find(res => res.label === "POSITIVE").score;
    const sentiment = positiveScore > 0.5 ? "Positive" : "Negative";

    if (query) {
      return new Response(
        JSON.stringify({ inputs, result: sentiment, score: positiveScore.toFixed(4) }),
        { headers: { "content-type": "application/json" } }
      );
    } else {
      return new Response(html(inputs, sentiment, positiveScore), {
        headers: { "content-type": "text/html" },
      });
    }
  },
};

function html(inputs, result, score) {
  let classification;
  if (score > 0.75) {
    classification = "Extremely Positive";
  } else if (score > 0.5) {
    classification = "Positive";
  } else if (score > 0.25) {
    classification = "Neutral";
  } else {
    classification = "Negative";
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sentiment Analysis</title>
      <link rel="icon" href="https://drigrowpersonal.eu.org/favicon.ico" type="image/x-icon">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        textarea { width: 100%; height: 100px; padding: 8px; resize: vertical; } /* Allows vertical resizing */
        button { padding: 8px 12px; margin-top: 10px; }
        .result { margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>Sentiment Analysis</h1>
      <form method="POST">
        <textarea name="text" placeholder="Enter text here">${inputs.text}</textarea>
        <button type="submit">Check</button>
      </form>
      <div class="result">
        <h2>Result: ${classification}</h2>
        <p>Score: ${score.toFixed(5)}</p>
      </div>
    </body>
    </html>
  `;
}

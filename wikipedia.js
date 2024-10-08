addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
  const url = new URL(request.url);
  const goto = url.searchParams.get('goto');
  const lang = url.searchParams.get('lang') || 'en';

  if (!goto) {
    // Show a simple search page if no 'goto' query is provided (root domain case)
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wiki PDF Fetcher</title>
      </head>
      <body>
        <h1>Wikipedia PDF Fetcher</h1>
        <form action="/" method="get">
          <label for="goto">Enter Wikipedia Entry: </label>
          <input type="text" id="goto" name="goto" required />
          <br><br>
          <label for="lang">Language (optional, default: en): </label>
          <input type="text" id="lang" name="lang" placeholder="en">
          <br><br>
          <button type="submit">Fetch PDF</button>
        </form>
      </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }

  try {
    // Wikipedia API endpoint for fetching PDF
    const wikipediaPdfUrl = `https://${lang}.wikipedia.org/api/rest_v1/page/pdf/${encodeURIComponent(goto)}`;
    const pdfResponse = await fetch(wikipediaPdfUrl);

    if (!pdfResponse.ok) {
      // If the PDF fetch fails, fall back to fetching the Wikipedia page
      return await fetchWikipediaPage(goto, lang);
    }

    const pdfBlob = await pdfResponse.blob();

    // Return the PDF response
    return new Response(pdfBlob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${goto}.pdf"`
      }
    });

  } catch (error) {
    // If there's any other error, also fall back to showing the Wikipedia page
    return await fetchWikipediaPage(goto, lang);
  }
}

async function fetchWikipediaPage(goto, lang) {
  try {
    const wikipediaPageUrl = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(goto)}`;
    const pageResponse = await fetch(wikipediaPageUrl);

    if (!pageResponse.ok) {
      throw new Error('Failed to fetch Wikipedia page.');
    }

    // Return the Wikipedia page HTML
    return new Response(await pageResponse.text(), {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    // If everything fails, show an error message
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

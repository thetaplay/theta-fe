function withValidProperties(properties: Record<string, undefined | string | string[]>) {
return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
);
}

export async function GET() {
const URL = process.env.NEXT_PUBLIC_URL as string;
return Response.json({
  "accountAssociation": {  // these will be added in step 5
    "header": "eyJmaWQiOjIzMTM5MDEsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgxM0YyNTBlOGI4OGI4MTQzQ2IzNzc1OTcyOTQ2YkQ0MDMzMEM5MTFBIn0",
    "payload": "eyJkb21haW4iOiJuYXdhc2VuYWJhc2UubmV0bGlmeS5hcHAifQ",
    "signature": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEHilzcRoYatOp81FmgsmBy0C0ecZkUnI1nxAgFQRC60sncjfpQbhHv34Skc2rL1pEVlPRaSAmrxgz5Mw3F-PWtXHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  },
  "miniapp": {
    "version": "1",
    "name": "Nawasena",
    "homeUrl": `${URL}/home`,
    "iconUrl": `${URL}/logo/Logo-Nawasena.png`,
    "splashImageUrl": `${URL}/logo/Logo-Nawasena.png`,
    "splashBackgroundColor": "#000000",
    "webhookUrl": `${URL}/webhook`,
    "subtitle": "option trade simple and gamefi",
    "description": "option trade simple and gamefi",
    "screenshotUrls": [
      `${URL}/logo/Logo-Nawasena.png`
    ],
    "primaryCategory": "finance",
    "tags": ["finance"],
    "heroImageUrl": `${URL}/logo/Logo-Nawasena.png`,
    "tagline": "option trade simple and gamefi",
    "ogTitle": "Nawasena",
    "ogDescription": "option trade simple and gamefi",
    "ogImageUrl": `${URL}/logo/Logo-Nawasena.png`,
    "noindex": true
  }
}); // see the next step for the manifest_json_object
}
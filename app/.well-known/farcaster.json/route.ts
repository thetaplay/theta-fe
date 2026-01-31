function withValidProperties(properties: Record<string, undefined | string | string[]>) {
return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
);
}

export async function GET() {
const URL = process.env.NEXT_PUBLIC_URL as string;
return Response.json({
  "accountAssociation": {  // these will be added in step 5
    "header": "",
    "payload": "",
    "signature": ""
  },
  "miniapp": {
    "version": "1",
    "name": "Nawasena",
    "homeUrl": "https://697dc8d9404c6541f7202091--nawasenabase.netlify.app",
    "iconUrl": `${URL}/logo/Logo-Nawasena.png`,
    "splashImageUrl": `${URL}/logo/Logo-Nawasena.png`,
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://697dc8d9404c6541f7202091--nawasenabase.netlify.app/webhook",
    "subtitle": "option trade simple and gamefi",
    "description": "option trade simple and gamefi",
    "screenshotUrls": [
      `${URL}/logo/Logo-Nawasena.png`
    ],
    "primaryCategory": "defi",
    "tags": ["option", "simple", "baseapp"],
    "heroImageUrl": `${URL}/logo/Logo-Nawasena.png`,
    "tagline": "option trade simple and gamefi",
    "ogTitle": "Nawasena",
    "ogDescription": "option trade simple and gamefi",
    "ogImageUrl": `${URL}/logo/Logo-Nawasena.png`,
    "noindex": true
  }
}); // see the next step for the manifest_json_object
}
interface ArcgisTokenResponse {
  access_token: string;
}

export default function getArcgisToken(): Promise<ArcgisTokenResponse> {
  const ClientID = 'L0vD9F1TdVIFnKp1';
  const ClientSecret = '15edb2f979e4413da365015f1fab2c75';

  return fetch(
    `https://www.arcgis.com/sharing/oauth2/token?client_id=${ClientID}&grant_type=client_credentials&client_secret=${ClientSecret}&f=pjson`
  )
    .then((r) => r.json())
    .catch(() => {
      throw new Error('ArcgisToken nicht verfügbar');
    });
}

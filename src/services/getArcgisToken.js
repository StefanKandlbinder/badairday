export default function getArcgisToken() {
    // https://developers.arcgis.com/applications/6441699771ee406cab4720292beb112d/authentication
    
    const ClientID = "L0vD9F1TdVIFnKp1";
    const ClientSecret = "15edb2f979e4413da365015f1fab2c75";

    return new Promise(function (resolve, reject) {
        fetch(`https://www.arcgis.com/sharing/oauth2/token?client_id=${ClientID}&grant_type=client_credentials&client_secret=${ClientSecret}&f=pjson`)
            .then(function(response) {
                return resolve(response.json());
            })
            .catch(function(error) {
                reject(Error("ArcgisToken nicht verfügbar"));
            });
    });
}
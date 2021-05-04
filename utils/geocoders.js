const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEO_CODER_PROVIDER,

    // Optional depending on the providers
    //   fetch: customFetchImplementation,
    httpAdapter: 'https',
    apiKey: process.env.GEO_CODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// Using callback
// const res = await geocoder.geocode('29 champs elysée paris');
module.exports = geocoder;
const axios = require('axios');

async function geocodeAddress(address) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    // fallback: log and return null to indicate we couldn't geocode
    console.log('GOOGLE_MAPS_API_KEY not set — geocode fallback for', address);
    return null;
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const res = await axios.get(url, { params: { address, key } });
  if (res.data.status !== 'OK' || !res.data.results || !res.data.results.length) return null;
  const loc = res.data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
}

module.exports = { geocodeAddress };

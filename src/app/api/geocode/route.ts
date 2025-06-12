// In an API route file (app/api/geocode/route.ts)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&format=json`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "YourApp/1.0",
    },
  });

  const data = await response.json();
  return Response.json(data);
}

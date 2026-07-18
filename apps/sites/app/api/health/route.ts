export function GET() { return Response.json({ status: 'ok', service: 'sites', timestamp: new Date().toISOString() }); }

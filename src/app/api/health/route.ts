// Liveness only: deliberately does not touch the database, so a DB blip
// cannot make the platform or Docker kill a healthy web process.
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json(
    { status: 'ok' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

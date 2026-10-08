// Liveness only: deliberately does not touch the database, so a DB blip
// cannot make the platform or Docker kill a healthy web process.
export const dynamic = 'force-dynamic';

/**
 * Liveness probe for the platform and Docker.
 *
 * @authorization none Reports only that the process answers; it reads no data.
 */
export function GET() {
  return Response.json(
    { status: 'ok' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

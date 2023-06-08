import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/api/v1/cron/:job', '/api/v1/wh/:hook'],
});

export const config = {
  matcher: ['/(api|trpc)(.*)'],
};

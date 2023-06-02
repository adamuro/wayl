import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/api/v1/cron/:job'],
});

export const config = {
  matcher: ['/(api|trpc)(.*)'],
};

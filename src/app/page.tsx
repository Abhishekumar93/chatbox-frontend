import { ROUTE_URLS } from '@/constants/routeUrls';
import { redirect } from 'next/navigation';

export default async function Home() {
  redirect(ROUTE_URLS.MESSAGES);
}

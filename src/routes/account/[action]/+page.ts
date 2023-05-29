import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  if (!['login', 'register', 'recover'].includes(params.action)) {
    throw redirect(301, '/account/login');
  }
}) satisfies PageLoad;

import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (() => {
  throw redirect(301, '/vendor/signin');
}) satisfies PageLoad;

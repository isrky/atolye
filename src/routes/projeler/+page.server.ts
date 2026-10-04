import { projeler } from '#lib/server/icerik.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ projeler });

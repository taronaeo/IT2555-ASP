import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
export const component = async () => (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.f4d512a7.js","_app/immutable/chunks/index.81aa6c8c.js"];
export const stylesheets = [];
export const fonts = [];

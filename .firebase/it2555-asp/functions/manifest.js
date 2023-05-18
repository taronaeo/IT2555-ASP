export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.43c91a27.js","app":"_app/immutable/entry/app.ad859616.js","imports":["_app/immutable/entry/start.43c91a27.js","_app/immutable/chunks/index.81aa6c8c.js","_app/immutable/chunks/singletons.e268afab.js","_app/immutable/entry/app.ad859616.js","_app/immutable/chunks/index.81aa6c8c.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js')
		],
		routes: [
			{
				id: "/api",
				pattern: /^\/api\/?$/,
				params: [],
				page: null,
				endpoint: () => import('./entries/endpoints/api/_server.ts.js')
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

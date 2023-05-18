const sample_response = {
	status: 200,
	message: 'API backend is ready and listening'
};

export const GET = async () => new Response(JSON.stringify(sample_response));

import server from '../../dist/server/server.js';

export default async (request, context) => {
  return server.fetch(request, process.env, context);
};

export const config = {
  path: "/*"
};

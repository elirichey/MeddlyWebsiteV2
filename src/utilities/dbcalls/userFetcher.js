const { Client } = require('pg');

export const postFetcher = async (uuid) => {
	const client = new Client();

	try {
		await client.connect();
		const res = await client.query(
			`SELECT id,
              src,
              orientation,
              duration,
              type,
              preview
       FROM "Post"
       WHERE "eventId" = '${uuid}'
       AND type NOT LIKE '%audio%'
       ORDER BY type DESC
       `,
		);
		await client.end();
		return res.rows;
	} catch (e) {
		// console.error(e.stack);
		await client.end();
	}
};

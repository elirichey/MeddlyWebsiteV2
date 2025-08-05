const { Client } = require('pg');

export const orgFetcher = async (uuid) => {
	const client = new Client();

	try {
		await client.connect();
		const res = await client.query(
			`SELECT id,
              avatar,
              name
       FROM "Organization"
       WHERE id = '${uuid}'`,
		);
		await client.end();
		return res.rows[0];
	} catch (e) {
		// console.error(e.stack);
		await client.end();
	}
};

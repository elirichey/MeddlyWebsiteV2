const { Client } = require('pg');

export const packagesFetcher = async (uuid) => {
	const client = new Client();

	try {
		await client.connect();
		const res = await client.query(
			`SELECT id,
              title,
              "priceAttendees",
              "priceNonAttendees"
       FROM "Package"
       WHERE "eventId" = '${uuid}'`,
		);
		await client.end();
		return res.rows;
	} catch (e) {
		// console.error(e.stack);
		await client.end();
	}
};

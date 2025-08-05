const { Client } = require('pg');

export const eventFetcher = async (uuid) => {
	const client = new Client();

	try {
		await client.connect();
		const q = `SELECT
                id,
                title,
                status,
                "coverImg",
                "dateTime",
                "timestampStart",
                "timestampEnd",
                "orgOwnerId",
                "managerId"
            FROM "Event"
            WHERE id = '${uuid}'`;
		// console.log(q);

		const res = await client.query(q);

		// console.log(res.rows);
		await client.end();
		return res.rows[0];
	} catch (e) {
		// console.error(e.stack);
		await client.end();
	}
};

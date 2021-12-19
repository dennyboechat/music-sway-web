import { query } from '@/lib/db';

const handler = async (req, res) => {
    const { title, artist, category, observation, entries } = req.body
    try {
        if (!title) {
            return res.status(400).json({ message: '`Title` is required' });
        }

        let results = await query(`
        INSERT INTO 
            song (title, artist, category, observation)
        VALUES 
            (?, ?, ?, ?)
        `,
            [title, artist, category, observation]
        );

        const songIdResults = await query(`
        SELECT 
            LAST_INSERT_ID() as songId
      `
        );
        const songId = songIdResults[0].songId;

        if (entries && entries.length > 0) {
            const entryRows = entries.map(entry => [entry.title, entry.content, songId]);
            results = await query(`
                INSERT INTO 
                    song_entry (title, content, song_id)
                VALUES 
                    ?
                `,
                [entryRows]
            );
        }

        return res.json(results);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export default handler;

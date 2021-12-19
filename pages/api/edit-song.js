import { query } from '@/lib/db';

const handler = async (req, res) => {
    const { id, title, artist, category, observation, entries } = req.body;
    try {
        if (!id || !title) {
            return res.status(400).json({ message: '`id` and `title` are required.' })
        }

        let results = await query(`
            UPDATE 
                song 
            SET 
                title = ?, 
                artist = ?, 
                category = ?, 
                observation = ?
            WHERE 
                id = ?
            `,
            [title, artist, category, observation, id]
        );

        results = await query(`
            DELETE FROM 
                song_entry
            WHERE 
                song_id = ?
            `,
            [id]
        );

        if (entries && entries.length > 0) {
            const entryRows = entries.map(entry => [entry.title, entry.content, id]);
            results = await query(`
                INSERT INTO 
                    song_entry (title, content, song_id)
                VALUES ?
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
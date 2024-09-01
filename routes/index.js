const express = require('express');
const router = express.Router();
const db = require('../db/config');

router.post('/', async (req, res) => {
    try {
        const {content, author_id, post_id, parent_comment_id} = req.body;
        const [result] = await db.query('INSERT INTO comments (content, author_id, post_id, parent_comment_id) VALUES (?, ?, ?, ?)', [content, author_id, post_id, parent_comment_id]);
        res.status(201).json({
            id: result.insertId,
            message: 'Comment created successfully',
            ...req.body
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(400).json({
            message: 'Error creating comment',
            error: error.message
        });
    }
});

router.get('/post/:postId', async (req, res) => {
    try {
        const [comments] = await db.execute(`
            WITH RECURSIVE comment_tree AS (
                SELECT id, content, author_id, post_id, parent_comment_id, is_approved, created_at, updated_at, 0 AS level
                FROM comments
                WHERE post_id = ? AND parent_comment_id IS NULL AND is_approved = TRUE
                UNION ALL
                SELECT c.id, c.content, c.author_id, c.post_id, c.parent_comment_id, c.is_approved, c.created_at, c.updated_at, ct.level + 1
                FROM comments c
                INNER JOIN comment_tree ct ON c.parent_comment_id = ct.id
                WHERE c.is_approved = TRUE
            )
            SELECT * FROM comment_tree ORDER BY parent_comment_id, id
        `, [req.params.postId]);

        // Función para construir el árbol de comentarios
        function buildCommentTree(comments, parentId = null) {
            return comments
                .filter(comment => comment.parent_comment_id === parentId)
                .map(comment => ({
                    ...comment,
                    replies: buildCommentTree(comments, comment.id)
                }));
        }

        const nestedComments = buildCommentTree(comments);
        res.json(nestedComments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/:id/approve', async (req, res) => {
    try {
        await db.execute('UPDATE comments SET is_approved = TRUE WHERE id = ?', [req.params.id]);
        const [[comment]] = await db.execute('SELECT * FROM comments WHERE id = ?', [req.params.id]);
        res.json({
            message: 'Comment approved successfully',
            ...comment
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error approving comment',
            error: error.message
        });
    }
});

module.exports = router;

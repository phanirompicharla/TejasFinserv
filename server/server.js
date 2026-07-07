import './config/env.js';
import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.set('trust proxy', 1);

const distPath = path.join(__dirname, '../dist');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://tejasfinserv.com',
        'https://www.tejasfinserv.com'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
    }
}));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH API ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- CONTACT API ---
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        await db.query(
            'INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]
        );
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: error.message });
    }
});

// Admin Route to view contacts
app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/contacts/:id', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- INSIGHTS API ---
app.get('/api/insights', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, title, slug, image_url, published_at, updated_at FROM insights ORDER BY published_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/insights/:slug', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM insights WHERE slug = ?', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ error: 'Insight not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/insights', authenticateToken, async (req, res) => {
    try {
        const { title, slug, content, image_url } = req.body;
        const [result] = await db.query(
            'INSERT INTO insights (title, slug, content, image_url) VALUES (?, ?, ?, ?)',
            [title, slug || title.toLowerCase().replace(/ /g, '-'), content, image_url || null]
        );
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Error adding insight:', error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/insights/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
        const { title, slug, content, image_url } = req.body;
        await db.query(
            'UPDATE insights SET title=?, slug=?, content=?, image_url=? WHERE id=?',
            [title, slug, content, image_url || null, id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/insights/:id', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('DELETE FROM insights WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- REVIEWS API ---
app.post('/api/reviews', async (req, res) => {
    try {
        const { name, city, review_text } = req.body;
        if (!name || !city || !review_text) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        await db.query(
            'INSERT INTO client_reviews (name, city, review_text, status) VALUES (?, ?, ?, ?)',
            [name, city, review_text, 'pending']
        );
        res.json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT name, city, review_text, created_at FROM client_reviews WHERE status = "approved" ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/reviews', authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM client_reviews WHERE status = "pending" ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/admin/reviews/:id/approve', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('UPDATE client_reviews SET status = "approved" WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/admin/reviews/:id', authenticateToken, async (req, res) => {
    try {
        if (isNaN(req.params.id)) return res.status(400).json({ error: 'Invalid ID' });
        await db.query('DELETE FROM client_reviews WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- CATCH ALL FOR REACT ROUTER ---
app.get(/.*/, (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server if not imported
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;

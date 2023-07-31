import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/pub', express.static(path.join(__dirname, 'client', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/users', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        if (err) throw err;
        const users = JSON.parse(data).users;
        res.send(users);
    });
});

app.get('/users/:userId', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
        if (err) throw err;
        const { users } = JSON.parse(data);
        const userId = parseInt(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (user) {
            res.send(user);
        } else {
            res.status(404).send({ state: 'User not found' });
        }
    });
});

app.listen(3000, () => {
    console.log(`Open this link in your browser: http://127.0.0.1:3000`);
});
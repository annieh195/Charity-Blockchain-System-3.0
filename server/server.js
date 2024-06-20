const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const users = JSON.parse(await fs.promises.readFile('users.json', 'utf8'));

        if (users[username]) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users[username] = hashedPassword;
        await fs.promises.writeFile('users.json', JSON.stringify(users, null, 2));
        res.send('Registration successful');
    } catch (error) {
        console.error('Error handling registration:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    
    if (!users[username]) {
        return res.status(401).send('User does not exist');
    }

    const match = await bcrypt.compare(password, users[username]);
    if (match) {
        res.send('Login successful');
    } else {
        res.status(401).send('Password is incorrect');
    }
});

// Shuhao adds
app.post('/saveProfile', async (req, res) => {
    const { username, profile } = req.body;
    try {
        const users = JSON.parse(await fs.promises.readFile('users.json', 'utf8'));
        if (!users[username]) {
            return res.status(401).send('User does not exist');
        }

        users[username].profile = profile;
        await fs.promises.writeFile('users.json', JSON.stringify(users, null, 2));
        res.send('Profile saved successfully');
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/getProfile', async (req, res) => {
    const { username } = req.body;
    try {
        const users = JSON.parse(await fs.promises.readFile('users.json', 'utf8'));
        if (!users[username]) {
            return res.status(401).send('User does not exist');
        }

        res.send(users[username].profile);
    } catch (error) {
        console.error('Error retrieving profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

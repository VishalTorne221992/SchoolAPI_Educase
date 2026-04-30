import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db/DbConnect.js';


dotenv.config();

const app = express();
const port = process.env.DB_PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Express server is running' });
});

function connectToDatabase() {
    pool.getConnection()
        .then(connection => {
            console.log('Connected to MySQL database');
            connection.release();
        })
        .catch(error => {
            console.error('Error connecting to MySQL database:', error);
        });
}

connectToDatabase();


app.get('/getSchools', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM School');
        res.json({ result: rows });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});


app.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    try {
        const schoolId = await pool.execute('SELECT LAST_INSERT_ID() AS id');   
        await pool.query('SET @count = 0;');
        await pool.query('UPDATE School SET id = (@count := @count + 1);');
    
        // 2. Reset the AUTO_INCREMENT counter to the new maximum + 1
        await pool.query(`ALTER TABLE School AUTO_INCREMENT = ${schoolId[0][0].id + 1};`);
        const [result] = 
        await pool.query(
            'INSERT INTO School (name, address, latitude, longitude, location) VALUES (?, ?, ?, ?, ST_GeomFromText(?,4326))', 
            [name, address, latitude, longitude, `POINT(${longitude} ${latitude}) `]);
        res.json({ status: 'success', message: 'School added successfully', schoolId: result.insertId });

    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.get('/listSchools', async (req, res) => {
     
    const { latitude, longitude } = req.body;

    try {
        const [rows] = await pool.query(
            `SELECT id, name, address, ST_X(location) AS longitude, ST_Y(location) AS latitude,
            ROUND(ST_Distance_Sphere(location, ST_GeomFromText(?, 4326)), 2) AS distance
            FROM School
            ORDER BY distance ASC`,
            [`POINT(${longitude} ${latitude})`]
        );
        res.json({ result: rows });
    } catch (error) {
        console.error('Error fetching nearest schools:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }                                           

});



app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

require('dotenv').config();

const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

app.use(express.json())
app.use(cors()) //cross-origin starting

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_DATABASE;

const db = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
})

db.connect((err) => {
    if(!err) {
        console.log('Connected to database successfully')
    } else {
        console.log(err)
    }
})

app.post('/new-task', (req, res) => {
    console.log("Request Body:", req.body);  // Log the request body

    const q = 'INSERT INTO todos (task, description, createdAt, status) VALUES (?, ?, ?, ?)';
    db.query(q, [req.body.task, req.body.description, new Date(), 'active'], (err, result) => {
        if (err) {
            console.error("Failed to store task", err); // Log the error
            return res.status(500).json({ error: "Failed to store task" }); // Respond with an error
        }

        console.log("Todo saved successfully");
        const updatedTasks = 'SELECT * FROM todos';
        db.query(updatedTasks, (error, newList) => {
            if (error) {
                console.error("Failed to fetch updated tasks", error);
                return res.status(500).json({ error: "Failed to fetch updated tasks" });
            }
            res.json(newList);  // Use res.json for proper content-type
        });
    });
});


app.get('/read-tasks', (req, res) => {
    const q = 'select * from todos';
    db.query(q, (err, result) => {
        if (err) {
            console.log("failed to read tasks");
        } else {
            console.log("got tasks successfully");
            // console.log(result);
            res.send(result);
        }
    })
})

app.post('/update-task', (req, res) => {
    console.log(req.body);
    const q = 'update todos set task = ?, description = ? where id = ?';
    db.query(q, [req.body.task, req.body.description, req.body.updatedId], (err, result) => {
        if (err) {
            console.log("Failed to update task", err);
        } else {
            console.log("task updated");
            const updatedTasks = 'select * from todos where id = ?';
            db.query(updatedTasks, [req.body.updatedId], (err, result) => {
                if(err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            })
        }
    })
});

app.post('/delete-task', (req, res) => {
    console.log(req.body);
    const q = 'delete from todos where id = ?';
    db.query(q, [req.body.id], (err, result) => {
        if (err) {
            console.log("Failed to delete task");
        } else {
            console.log("task deleted");
            const updatedTasks = 'select * from todos';
            db.query(updatedTasks, (err, newList) => {
                if(err) {
                    console.log(err);
                } else {
                    res.send(newList);
                }
            })
        }
    })
})

app.post('/complete-task', (req, res) => {
    console.log(req.body);
    const q = 'update todos set status = ? where id = ?';
    db.query(q, ['completed', req.body.id], (err, result) => {
        if (err) {
            console.log("Failed to complete task");
        } else {
            console.log("task completed");
            const updatedTasks = 'select * from todos';
            db.query(updatedTasks, (err, newList) => {
                if(err) {
                    console.log(err);
                } else {
                    res.send(newList);
                }
            })
        }
    })
});


app.listen(process.env.PORT, () => {console.log('server started')})
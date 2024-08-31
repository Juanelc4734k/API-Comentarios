const express = require('express');
const app = express();
const port = 3000;
const db = require('./db/config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/comments', require('./routes/index'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

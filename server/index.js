const keys = require('./keys')

const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//postgres client setup

const {Pool} = require('pg');

const pgClient = new Pool ({
    user: keys.pgUser,
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabse,
    password: keys.pgPassword
});

pgClient.on('connect', () => {
    pgClient.query('CREATE TABLE IF NOT EXISTS values (number int)')
    .catch((error) => {console.error(error)});
});


// Redis client setup

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, resp) => {
    resp.send('Hi all !!!')
})

app.get('/values/all', async (req, res) => {

    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);

})


app.get('/values/current', async (req, resp) => {
    redisClient.hgetall('values', (err, values) =>{
        resp.send(values);
    })
});

app.post('/values', (req, resp) => {
    const index = req.body.index;

    if(parseInt(index) > 40){
        return resp.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    
    resp.send({working: true});
})

app.listen(5000, (err) => {
    console.log('listening on port 5000');
})
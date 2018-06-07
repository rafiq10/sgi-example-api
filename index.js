const express = require('express'); // Web Framework
var sql = require("mssql");
const cors  = require('cors');

var dbConfig = {
    server: "sqi-back.database.windows.net", // Use your SQL server name
    database: "sample", // Database to connect to
    user: "rafa", // Use your username
    password: "SGIexample1", // Use your password
    port: 1433,
    // Since we're on Windows Azure, we need to set the following options
    options: {
        encrypt: true
    }
    };

var app = express();

app.use([express.json(),
  cors()
]);

var server = app.listen(process.env.PORT || 80, () => {
        var host = server.address().address
        var port = server.address().port
    });


app.get('/people/',
    (req, res) => {
     const myPool = new sql.ConnectionPool(dbConfig)
     myPool.connect()
       .then((pool)=>{
       const mySQL = "select * from people";
       const myRequest = pool.request()
       
       return myRequest.query(mySQL)
         .then((result) => {
           let rows = result.recordset;
           // res.setHeader('Access-Control-Allow-Origin', '*')
           res.status(200).json(rows);
           sql.close()
         })
         .catch((err) =>{
           res.status(500).send({message: "${err}"})
           sql.close();
         })
     }) 
   })


   app.get('/people/:name',
   (req, res) => {
   new sql.ConnectionPool(dbConfig).connect()
   .then((pool) => {
     return pool.request().query("select * from people where name ='" + req.params.name+ "'")
     .then( result =>{
       let rows = result.recordset
       res.setHeader('Access-Control-Allow-Origin', '*')
       res.status(200).json(rows)
       sql.close();
     })
     .catch( (err) =>{
       res.status(500).send('request error: ' + err)
       sql.close();
     });
   })
   .catch((err)=>{
     res.status(500).send('connection error: ' + err)
   });
   })
 
   app.post('/post/person/',
     (req,res) => {
       const myPool = new sql.ConnectionPool(dbConfig).connect()
         .then((pool) => {
           const sqlStr = "insert into people(name, age) values ('" + req.body.name + "', " + req.body.age +")"
           const myReq = pool.request();
         
           return myReq.query(sqlStr)
           .then((result)=>{
             res.send(result.body);
             sql.close();
           })
           .catch((err) => {
             // res.end(JSON.stringify(req.body))
             res.send('request error: ' + err + ' ' + sqlStr + ' ' + req.body)
             sql.close()
           })
         })
         .catch((err) => {
           res.send('connection error: ' + err)
           sql.close();
         })
     })
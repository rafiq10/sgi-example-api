const express = require('express'); // Web Framework
const bparser = require('body-parser')
const cors  = require('cors');
const sql = require('mssql'); // MS Sql Server client


var app = express();
app.use([express.json(),
        cors()
]);

// Connection string parameters.
var sqlConfig = {
    userID: 'rafa',
    password: 'SGIexample1',
    server: 'sqi-back.database.windows.net',
    options: {
      database: 'sample',
      encrypt: true
    }
    }

// Start server and listen on http://localhost:8081/
var server = app.listen(1433, () => {
    var host = server.address().address
    var port = server.address().port
});

app.get('/people/',
 (req, res) => {
  const myPool = new sql.ConnectionPool(sqlConfig)
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
  new sql.ConnectionPool(sqlConfig).connect()
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
      const myPool = new sql.ConnectionPool(sqlConfig).connect()
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
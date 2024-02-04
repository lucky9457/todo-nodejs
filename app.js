const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const dbpath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let db;
const initialize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server started");
    });
  } catch (e) {
    console.log(e.message);
  }
};
initialize();
/*
app.post("/todos/", async (request, response) => {
  const qc = `
    CREATE TABLE todo(
        id INT,
        todo TEXT,
        priority TEXT,
        status TEXT
    );
   
    `;
  await db.run(qc);
  response.send("Succesfull");
});
*/
/*
app.post("/todos/", async (request, response) => {
  const qc = ` INSERT INTO todo(id,todo,priority,status)
    VALUES(1,"Watch Movie","LOW","TO DO"),
    (2,"Learn Node JS","HIGH","IN PROGRESS"),
    (3,"Play cricket","MEDIUM","DONE"),
    (4,"Play volleyball","MEDIUM","DONE");
   m
    `;
  await db.run(qc);
  response.send("Succesfull done");
});
*/
app.get("/todos/", async (request, response) => {
  const { search_q = "", priority = "", status = "" } = request.query;
  const qcc = `
    SELECT *
    FROM 
    todo
    WHERE
    todo like "%${search_q}%" and
    priority like "%${priority}%" and
    status like "%${status}%";
 `;
  const getlst = await db.all(qcc);
  response.send(getlst);
});

//api2

app.get("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const gettodo = `
    SELECT *
    FROM 
    todo
    WHERE
    id = ${todoId};
    `;
  const gettodolst = await db.get(gettodo);
  response.send(gettodolst);
});

//api3

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const qqq = `
    INSERT INTO todo(id,todo,priority,status)
    VALUES(${id},'${todo}','${priority}','${status}');
    
    
    `;
  await db.run(qqq);
  response.send("Todo Successfully Added");
});

app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const { todo = "", status = "", priority = "" } = request.body;
  console.log(todo);
  let getlist;
  if (todo == "" && priority == "") {
    getlist = `
        UPDATE 
        todo
        SET
        status='${status}';


        `;
    await db.run(getlist);
    response.send("Status Updated");
  } else if (todo == "" && status == "") {
    getlist = `
      UPDATE 
        todo
        SET
        priority='${priority}';
    
      
      `;
    await db.run(getlist);
    response.send("Priority Updated");
  } else if (status == "" && priority == "") {
    getlist = `
      UPDATE 
        todo
        SET
        todo='${todo}';
      
      `;
    await db.run(getlist);
    response.send("Todo Updated");
  }
});

//api5

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const del_query = `
    DELETE
    FROM todo
    WHERE
    id = ${todoId};
    
    
    `;
  await db.run(del_query);
  response.send("Todo Deleted");
});

module.exports = app;

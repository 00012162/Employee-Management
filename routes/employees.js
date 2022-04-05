const express = require('express')
const app = express()
var uuid = require('uuid');

const path = require('path')
const fs = require('fs')
const isNullOrEmpty = require('check-is-empty-js');

app.get('/', (req, res) => {
    fs.readFile("./data/db.json", (err, data) => {
        if (err) throw err;
    
        const employees = JSON.parse(data);
        res.render("employees", { employees: employees });
      });
})

app.get('/create', (req, res) => {
    res.render('create', {
        item: null
    })
})

app.post('/create', (req, res) => {
    const form = req.body;

    if ((isNullOrEmpty(form.name) == true) ||
        (isNullOrEmpty(form.position) == true) ||
        (isNullOrEmpty(form.hours) == true) ||
        (isNullOrEmpty(form.rate) == true)
    ) {
        fs.readFile("./data/db.json", (err, data) => {
            if (err) throw(err);
      
            res.render("create", {
                error: true,
                employee: null
            });
          });
    } else {
        fs.readFile("./data/db.json", (err, data) => {
            if (err) throw err;

            const employees = JSON.parse(data);
            
            const employee = {
                id: uuid.v1(),
                name: form.name,
                position: form.position,
                hours: form.hours,
                rate: form.rate
            };
            employees.push(employee);
            
            fs.writeFile("./data/db.json", JSON.stringify(employees), (err) => {
                if (err) throw err;
                
                res.redirect('/employees');
            });
        });
    }
})

app.get('/:id/update', (req, res) => {
    fs.readFile("./data/db.json", (err, data) => {
        if(err) throw error
        
        const employees = JSON.parse(data)
        const employee = employees.filter(employee => employee.id == req.params.id)[0]
        res.render('create', {employee: employee})
    })
})

app.post("/:id/update", (req, res) => {
    
    const form = req.body;
    console.log()
    
    if (isNullOrEmpty(form.name) ||
    isNullOrEmpty(form.position) ||
    isNullOrEmpty(form.hours) ||
    isNullOrEmpty(form.rate)
    ) {
        fs.readFile("./data/db.json", (err, data) => {
            if (err) throw(err);
            
            res.render("create", {
                error: true,
                employee: null
            });
        })
    } else {
        const id = req.params.id;
        fs.readFile("./data/db.json", (err, data) => {
            if (err) throw err;
            
            const employees = JSON.parse(data);
            const updated = employees.filter(employee => employee.id != id) || []
            
            let employee = employees.filter(employee => employee.id == id)[0]
            
            updated.push(employee = {
                id: id,
                name: form.name,
                position: form.position,
                hours: form.hours,
                rate: form.rate
            });
            
            fs.writeFile("./data/db.json", JSON.stringify(updated), (err) => {
                if (err) throw err;
                
                fs.readFile("./data/db.json", (err, data) => {
                    if (err) throw err;
                    
                    res.render("employees");
                });
                res.redirect('/employees');
            });
        });
    }
});

//app.get('/api/employees', (req, res) => {
//    fs.readFile('./data/db.json', (err, data) => {
//        if(err) throw err
//
//        const employees = JSON.parse(data)
//        res.json(employees)
//    })
//})

app.get('/:id/delete', (req, res) => {
    const id = req.params.id;

  fs.readFile("./data/db.json", (err, data) => {
    if (err) throw err;

    const employees = JSON.parse(data);
    const filteredEmployee = employees.filter((employee) => employee.id != id);

    fs.writeFile("./data/db.json", JSON.stringify(filteredEmployee), (err) => {
      if (err) throw err;
      res.render('employees', { employees: employees, deleted: true });
    });
    res.redirect('/employees');
  });
})

function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

module.exports = app
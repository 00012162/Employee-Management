const express = require('express')
const app = express()
var uuid = require('uuid');

const fs = require('fs')
const isNullOrEmpty = require('check-is-empty-js');

let authorized = false

app.get('/login', (req,res) => {
    res.render('login')
  })
  
app.post("/login", (req, res) => {
    let form = req.body

    if(isNullOrEmpty(form.username)) {
        res.render('login', {errorUsernameEmpty: true})
    }
    else if(isNullOrEmpty(form.password)) {
        res.render('login', {errorPasswordEmpty: true})
    }
    else if(form.username != "admin") {
        res.render('login', {errorUsernameInvalid: true})
    }
    else if(form.password != "admin") {
        res.render('login', {errorUsernameInvalid: true})
    }
    else {
        authorized = true
        res.redirect('/')
    }
})

app.get('/', (req, res) => {
    if(authorized)
        fs.readFile("./data/db.json", (err, data) => {
            if (err) throw err;
        
            const employees = JSON.parse(data);
            res.render("employees", { employees: employees });
        });
    else
        res.redirect('/employees/login')
})

app.get('/create', (req, res) => {
    if(authorized)
        res.render('create', {
            item: null
        })
    else
        res.redirect('/employees/login')
})

app.post('/create', (req, res) => {
    if(authorized){
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
    }else
        res.redirect('/employees/login')   
    })
    
app.get('/:id/update', (req, res) => {
    if(authorized) {
        fs.readFile("./data/db.json", (err, data) => {
            if(err) throw error
            
            const employees = JSON.parse(data)
            const employee = employees.filter(employee => employee.id == req.params.id)[0]
            res.render('create', {employee: employee})
        })
    }else {
        res.redirect('/employees/login')   
    } 
})

app.post("/:id/update", (req, res) => {
    if(authorized) {
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

    }else {
        res.redirect('/employees/login')       
    }
});

app.get('/:id/delete', (req, res) => {
    if(authorized) {
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
    }else {
        res.redirect('/employees/login')
    }
})

module.exports = app
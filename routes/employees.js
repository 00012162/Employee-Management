const express = require('express')
const app = express()

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
                id: id(),
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

app.get('/:id/edit', (req, res) => {
    blogDatabase.getBlog(
        req.params.id,
        blog => res.render('create', {item: blog})
    )
})

app.post('/:id/edit', (req, res) => {
    if(Validator(req.body)) {
        blogDatabase.update(req.body, req.params.id, () => res.render('create', {success: true, item: !null}))
    } else res.render('create' , {success: false, error: true})
})

app.get('/:id/delete', (req, res) => {
    blogDatabase.delete(
        req.params.id, () => res.redirect('/blogs'))
})

function id() {
    return "_" + Math.random().toString(36).substr(2, 9);
}

module.exports = app
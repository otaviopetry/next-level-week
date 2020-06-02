import express from 'express';

const app = express();

app.use(express.json());

let users = [
        'Otavio',
        'Lucão',
        'Jamile'
    ];

app.get('/users', function (req, res) {
    console.log('Listagem de usuários');

    const search = String(req.query.search);

    const filteredUsers = search ? users.filter( user => user.includes(search) ) : users;

    return res.json(filteredUsers)
})

app.get('/users/:id', function (req, res) {
    const userId = Number(req.params.id);

    return res.send(users[userId]);
})


app.post('/users', function (req, res) {

    const data = req.body;

    console.log(data)

    const user = {
        name: "Otavio",
        email: "otaviopetry@gmail.com"
    }

    return res.json(user);

})

app.listen(3333);


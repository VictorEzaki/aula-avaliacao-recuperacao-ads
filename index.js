const express = require('express')
const database = require('./src/database')
const pessoaRouter = require('./src/routes/pessoa')
const filialRouter = require('./src/routes/filial')
const apiPessoa = require('./src/api/pessoa')

const port = 3000
const app = express()

app.use(express.json())

app.post('/api/v1/login', apiPessoa.Login)

app.use('/api/v1/filial', filialRouter)
app.use('/api/v1/pessoa', pessoaRouter)

database.db
    .sync({ force: false })
    .then((_) => {
        // adicionado if para conseguir rodar mais de uma suíte de testes de api
        if (process.env.NODE_ENV !== "test") {
            app.listen(3000, () => {
                console.log("Servidor rodando na porta 3000");
            });
        }
    })
    .catch((e) => {
        console.error(`Não foi possivel conectar com o banco: ${e}`)
    })

module.exports = app;
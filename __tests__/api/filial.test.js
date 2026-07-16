const app = require('../../index');
const request = require('supertest');
const database = require('../../src/database');
const crypto = require('crypto');

describe('Teste de api para filial', () => {
    let filial;
    let pessoa;

    beforeAll(async () => {
        const body = {
            name: 'Teste api filial',
            address: 'Rua das apis',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '12341234',
        }

        const res = await request(app)
        .post('/api/v1/filial')
        .send(body);
        pessoa = res.body.filial.pessoa;
        filial = res.body.filial.filial;
        
        const resLogin = await request(app)
        .post('/api/v1/login')
        .send({ email: pessoa.email, password: pessoa.password })
        
        expect(resLogin.statusCode).toBe(200);
        expect(resLogin.body.token).toBeDefined();
        
        token = resLogin.body.token;
    })

    // afterAll(async () => {
    //     await transaction.rollback();
    //     await sequelize.db.close();
    // });

    test('Criar uma filial nova com todos os campos', async () => {
        const body = {
            name: 'Teste filial',
            address: 'Rua das filial',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
        }
        
        const res = await request(app)
        .post('/api/v1/filial')
        .send(body);
        
        expect(res.statusCode).toBe(200);
        
        expect(res.body.filial.filial.name).toBe(body.name);
        expect(res.body.filial.filial.address).toBe(body.address);
        expect(res.body.filial.filial.email).toBe(body.email);
        expect(res.body.filial.filial.phone).toBe(body.phone);
        expect(res.body.filial.pessoa.name).toBe(`Admin ${body.name}`);
        expect(res.body.filial.pessoa.email).toBe(body.email);
        expect(res.body.filial.pessoa.role).toBe('admin');
    });

    test('Criar uma filial nova sem o name', async () => {
        const body = {
            name: null,
            address: 'Rua das filial',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
        }
        
        const res = await request(app)
        .post('/api/v1/filial')
        .send(body);
        
        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Favor informar o campo nome');
    });

    test('Criar uma filial nova sem o address', async () => {
        const body = {
            name: 'Teste create incompleto',
            address: null,
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
        }
        
        const res = await request(app)
        .post('/api/v1/filial')
        .send(body);
        
        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Favor informar o campo endereço');
    });

    test('Criar uma filial nova sem o telefone', async () => {
        const body = {
            name: 'Teste create incompleto',
            address: 'Rua dos testes',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: null,
        }
        
        const res = await request(app)
        .post('/api/v1/filial')
        .send(body);
        
        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Favor informar o campo telefone');
    });

    test('Criar uma filial nova sem o email', async () => {
        const body = {
            name: 'Teste create incompleto',
            address: 'Rua dos testes',
            email: null,
            phone: '4712341234',
        }
        
        const res = await request(app)
        .post('/api/v1/filial')
        .send(body);
        
        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Favor informar o campo email');
    });

    test('Editar uma filial com todos os campos e uma filial existente', async () => {
        const body = {
            name: 'Teste create incompleto',
            address: 'Rua dos testes',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
        }
        const id = filial.id; // id da filial criada no beforeAll
        
        const res = await request(app)
        .put(`/api/v1/filial/${id}`)
        .set('Authorization', token)
        .send(body);

        expect(res.statusCode).toBe(200);
        
        expect(res.body.filial.name).toBe(body.name);
        expect(res.body.filial.address).toBe(body.address);
        expect(res.body.filial.email).toBe(body.email);
        expect(res.body.filial.phone).toBe(body.phone);
    });

    test('Editar uma filial com todos os campos e uma filial inexistente', async () => {
        const body = {
            name: 'Teste create incompleto',
            address: 'Rua dos testes',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
        }
        const id = 10000000000;
        
        const res = await request(app)
        .put(`/api/v1/filial/${id}`)
        .set('Authorization', token)
        .send(body);

        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Filial não encontrada');
    });

    test('Editar sem enviar o token', async () => {
        const body = {
            name: 'Teste create incompleto',
            address: 'Rua dos testes',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
        }

        const id = filial.id; // id da filial criada no beforeAll
        
        const res = await request(app)
        .put(`/api/v1/filial/${id}`)
        .send(body);

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Token inválido ou não fornecido');
    });

});
const app = require('../../index');
const request = require('supertest');
const database = require('../../src/database');
const crypto = require('crypto');

describe('Teste de api para pessoa', () => {
    let token;
    let filial;
    let pessoa;
    let employee;
    
    beforeAll(async () => {
        const body = {
            name: 'Teste API',
            address: 'Rua das APIs',
            email: `api_${crypto.randomUUID()}@teste.com`,
            phone: '4712341234',
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
    });
    
    afterAll(async () => {
        await database.db.close();
    });
    
    test('Criar uma pessoa nova', async () => {
        const body = {
            name: 'victor',
            email: `api_${crypto.randomUUID()}@teste.com`,
            password: '123123',
            role: 'admin'
        };
        
        const res = await request(app)
        .post('/api/v1/pessoa')
        .set('Authorization', token)
        .send(body);
        
        expect(res.statusCode).toBe(200);
        
        expect(res.body.pessoa).toBeDefined();
        expect(res.body.pessoa.id).toBeDefined();
        expect(res.body.pessoa.name).toBe(body.name);
        expect(res.body.pessoa.email).toBe(body.email);
        expect(res.body.pessoa.role).toBe(body.role);
    });
    
    test('Criar uma pessoa sem name', async () => {
        const body = {
            name: null,
            email: `api_${crypto.randomUUID()}@teste.com`,
            password: '123123',
            role: 'admin'
        };
        
        const res = await request(app)
        .post('/api/v1/pessoa')
        .set('Authorization', token)
        .send(body);
        
        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Favor informar o nome');
    });
    
    test('Buscar uma pessoa (busca pelo pessoa criado no beforeAll)', async () => {
        const res = await request(app)
        .get(`/api/v1/pessoa/${pessoa.id}`)
        .set('Authorization', token)
        
        expect(res.statusCode).toBe(200);
        
        expect(res.body.pessoa.id).toBe(pessoa.id);
        expect(res.body.pessoa.name).toBe(pessoa.name);
        expect(res.body.pessoa.email).toBe(pessoa.email);
        expect(res.body.pessoa.role).toBe(pessoa.role);
    });
    
    test('Editar uma pessoa existente', async () => {
        const body = {
            name: 'pessoa_editado',
            email: `api_${crypto.randomUUID()}@teste.com`,
            password: '123123',
            role: 'admin'
        };
        
        const res = await request(app)
        .put(`/api/v1/pessoa/${pessoa.id}`)
        .set('Authorization', token)
        .send(body);
        
        expect(res.statusCode).toBe(200);
        
        // Sobrescreve o pessoa criado no beforeAll pela rota de filial
        pessoa = res.body.pessoa;
        
        expect(res.body.pessoa).toBeDefined();
        expect(res.body.pessoa.id).toBe(pessoa.id);
        expect(res.body.pessoa.name).toBe(body.name);
        expect(res.body.pessoa.email).toBe(body.email);
        expect(res.body.pessoa.role).toBe(body.role);
    });
    
    test('Criar uma pessoa nova com role employee', async () => {
        const body = {
            name: 'employee',
            email: `api_${crypto.randomUUID()}@teste.com`,
            password: '123123',
            role: 'employee'
        };
        
        const res = await request(app)
        .post('/api/v1/pessoa')
        .set('Authorization', token)
        .send(body);
        
        expect(res.statusCode).toBe(200);
        
        employee = res.body.pessoa;
        
        expect(res.body.pessoa).toBeDefined();
        expect(res.body.pessoa.id).toBeDefined();
        expect(res.body.pessoa.name).toBe(body.name);
        expect(res.body.pessoa.email).toBe(body.email);
        expect(res.body.pessoa.role).toBe(body.role);
    });
    
    test('Deleta uma employee', async () => {
        const res = await request(app)
        .delete(`/api/v1/pessoa/${employee.id}`)
        .set('Authorization', token)
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
    });
    
    // Precisa ser o último, pois deleta a pessoa criado no beforeAll
    test('Deleta uma pessoa admin', async () => {
        const res = await request(app)
        .delete(`/api/v1/pessoa/${pessoa.id}`)
        .set('Authorization', token)
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
    });
});
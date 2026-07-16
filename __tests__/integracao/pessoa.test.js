const { describe, teste, expect, beforeAll } = require('@jest/globals');
const ServicePessoa = require('../../src/service/pessoa');
const ServiceFilial = require('../../src/service/filial');
const sequelize = require('../../src/database');

const crypto = require('crypto');

describe('Teste de integração de filial', () => {
    let transaction;
    let filial;
    let pessoa;
    
    beforeAll(async () => {
        transaction = await sequelize.db.transaction();
        
        const name = 'Teste empada';
        const address = 'Rua das batatas';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = '12341234';

        const res = await ServiceFilial.Create(name, address, phone, email);
        filial = res.filial;
        pessoa = res.pessoa;
    })
    
    afterAll(async () => {
        await transaction.rollback();
        await sequelize.db.close();
    });

    test("Criar uma pessoa com todos os campos", async () => {
        const name = 'Teste Victor';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = 'admin';
        const filialId = filial.id;

        const pessoa = await ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoa.id).toBeDefined();
        expect(pessoa.name).toBe(name);
        expect(pessoa.email).toBe(email);
        expect(pessoa.role).toBe(role);
        expect(pessoa.filialId).toBe(filialId);
    });

    test("Criar uma pessoa sem enviar o name", async () => {
        const name = null;
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = 'admin';
        const filialId = filial.id;

        const pessoaCreated = () => ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoaCreated).rejects.toThrow('Favor informar o nome');
    });

    test("Criar uma pessoa sem enviar a filial", async () => {
        const name = 'Teste create sem filial';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = 'admin';
        const filialId = null;

        const pessoaCreated = () => ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoaCreated).rejects.toThrow('Favor informar a filial');
    });

    test("Criar uma pessoa sem enviar o email", async () => {
        const name = 'Teste create incompleto';
        const email = null;
        const password = '123123';
        const role = 'admin';
        const filialId = filial.id;

        const pessoaCreated = () => ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoaCreated).rejects.toThrow('Favor informar o email');
    });

    test("Criar uma pessoa sem enviar a senha", async () => {
        const name = 'Teste create incompleto';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = null;
        const role = 'admin';
        const filialId = filial.id;

        const pessoaCreated = () => ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoaCreated).rejects.toThrow('Favor informar a senha');
    });

    test("Criar uma pessoa sem enviar a role", async () => {
        const name = 'Teste create incompleto';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = null;
        const filialId = filial.id;

        const pessoaCreated = () => ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoaCreated).rejects.toThrow('Favor informar a permissão corretamente');
    });

    test("Criar uma pessoa enviando uma role inexistente", async () => {
        const name = 'Teste create incompleto';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = 'batata';
        const filialId = filial.id;

        const pessoaCreated = () => ServicePessoa.Create(filialId, name, email, password, role, transaction);
        
        expect(pessoaCreated).rejects.toThrow('Favor informar a permissão corretamente');
    });

    test("Editar uma pessoa com todos os campos e existente", async () => {
        const name = 'Teste edição';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = 'admin';
        const filialId = filial.id;
        const pessoaId = pessoa.id;

        const pessoaUpdated = await ServicePessoa.Update(filialId, pessoaId, name, email, password, role, transaction);
        
        expect(pessoaUpdated.id).toBe(pessoaId);
        expect(pessoaUpdated.name).toBe(name);
        expect(pessoaUpdated.email).toBe(email);
        expect(pessoaUpdated.role).toBe(role);
        expect(pessoaUpdated.filialId).toBe(filialId);
    });

    test("Editar uma pessoa informando uma role inexistente", async () => {
        const name = 'Teste edição';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const password = '123123';
        const role = 'batata';
        const filialId = filial.id;
        const pessoaId = pessoa.id;

        const pessoaUpdated = () => ServicePessoa.Update(filialId, pessoaId, name, email, password, role, transaction);
        
        expect(pessoaUpdated).rejects.toThrow('Favor informar a permissão corretamente');
    });

    test("Deletar uma pessoa inexistente", async () => {
        const filialId = filial.id;
        const pessoaId = pessoa.id;

        const pessoaDeleted = await ServicePessoa.Delete(filialId, pessoaId, transaction);
        
        expect(pessoaDeleted).toBeUndefined();
    });

    test("Deve tentar logar sem e-mail", async () => {
        const email = null;
        const password = '123123';

        const pessoaLogin = () => ServicePessoa.Login(email, password, transaction);
        
        expect(pessoaLogin).rejects.toThrow('Favor informar email e senha');
    });
});
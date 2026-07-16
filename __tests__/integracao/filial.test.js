const { describe, teste, expect, beforeAll } = require('@jest/globals');
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

    test("Criar uma filial com todos os campos", async () => {
        const name = 'Teste empada';
        const address = 'Rua das batatas';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = '12341234';

        const filial = await ServiceFilial.Create(name, address, phone, email, transaction);

        expect(filial.filial.id).toBeDefined();
        expect(filial.filial.name).toBe(name);
        expect(filial.filial.address).toBe(address);
        expect(filial.filial.email).toBe(email);
        expect(filial.filial.phone).toBe(phone);
        expect(filial.pessoa.name).toBe(`Admin ${name}`);
        expect(filial.pessoa.email).toBe(email);
        expect(filial.pessoa.role).toBe('admin');
    });

    test("Criar uma filial sem enviar o name", async () => {
        const name = null;
        const address = 'Rua das batatas';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = '12341234';

        const filial = () => ServiceFilial.Create(name, address, phone, email, transaction);

        expect(filial).rejects.toThrow('Favor informar o campo nome');
    });

    test("Criar uma filial sem enviar o endereço", async () => {
        const name = 'Teste empada';
        const address = null;
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = '12341234';

        const filial = () => ServiceFilial.Create(name, address, phone, email, transaction);

        expect(filial).rejects.toThrow('Favor informar o campo endereço');
    });

    test("Criar uma filial sem enviar o telefone", async () => {
        const name = 'Teste empada';
        const address = 'Rua das batatas';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = null;

        const filial = () => ServiceFilial.Create(name, address, phone, email, transaction);

        expect(filial).rejects.toThrow('Favor informar o campo telefone');
    });

    test("Criar uma filial sem enviar o email", async () => {
        const name = 'Teste empada';
        const address = 'Rua das batatas';
        const email = null;
        const phone = '12341234';

        const filial = () => ServiceFilial.Create(name, address, phone, email, transaction);

        expect(filial).rejects.toThrow('Favor informar o campo email');
    });

    // Busca a filial criada no beforeAll
    test("Buscar uma filial", async () => {
        const id = filial.id;
        const filialFounded = await ServiceFilial.FindById(id, transaction);

        expect(filialFounded.id).toBe(id);
        expect(filialFounded.name).toBe(filial.name);
        expect(filialFounded.address).toBe(filial.address);
        expect(filialFounded.email).toBe(filial.email);
        expect(filialFounded.phone).toBe(filial.phone);
    });

    test("Editar uma filial existente", async () => {
        const name = 'Filial editada';
        const address = 'Rua das batatas editada';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = '12341235';
        const id = filial.id;

        const filialUpdated = await ServiceFilial.Update(id, name, address, phone, email, transaction);

        expect(filialUpdated.id).toBe(id);
        expect(filialUpdated.name).toBe(name);
        expect(filialUpdated.address).toBe(address);
        expect(filialUpdated.email).toBe(email);
        expect(filialUpdated.phone).toBe(phone);
    });

    test("Editar uma filial inexistente", async () => {
        const name = 'Filial editada';
        const address = 'Rua das batatas editada';
        const email = `integracao_${crypto.randomUUID()}@teste.com`;
        const phone = '12341235';
        const id = 10000000;

        const filialUpdated = () => ServiceFilial.Update(id, name, address, phone, email, transaction);

        expect(filialUpdated).rejects.toThrow('Filial não encontrada');
    });

    test("Deleta uma filial inexistente", async () => {
        const id = 1000000000;

        const filialFounded = () => ServiceFilial.Delete(id, transaction);

        expect(filialFounded).rejects.toThrow('Filial não encontrada');
    });

});
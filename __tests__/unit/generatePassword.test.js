const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
const generatePassword = require('../../src/fns/generate-password');

describe('Teste unitário da função de gerar senha', () => {
    let salt = 18;

    test('Gerar senha nova', async () => {
        const senha = await generatePassword(salt);

        // console.log('Senha aqui >>>>>>>>>>>>>>>>>>>>>', senha);
        expect(senha).not.toBeNull;
    });

    test('Gerar senha diferentes a cada execução', async () => {
        const senha1 = await generatePassword(salt);
        const senha2 = await generatePassword(salt);

        // console.log('Senha aqui >>>>>>>>>>>>>>>>>>>>>', senha);
        expect(senha1).not.toBe(senha2);
    });

    test('Gerar senha com 36 caracteres', async () => {
        const senha = await generatePassword(salt);

        // console.log('Senha aqui >>>>>>>>>>>>>>>>>>>>>', senha);
        expect(senha).toHaveLength(36);
    });

    test('Gerar senha deve conter caracteres hexadecimais', async () => {
        const senha = await generatePassword(salt);

        // console.log('Senha aqui >>>>>>>>>>>>>>>>>>>>>', senha);
        expect(senha).toMatch(/^[0-9a-f]+$/);
    });

    // test('Gerar senha sem enviar o salt', async () => {
    //     const senha = await generatePassword();

    //     // console.log('Senha aqui >>>>>>>>>>>>>>>>>>>>>', senha);
    //     expect(senha).tobe();
    // });

});
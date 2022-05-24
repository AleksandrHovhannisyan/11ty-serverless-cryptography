const alphabets = require('../../../src/_data/alphabets');
const generateVigenereCipher = require('./vigenereCipher');

describe('vigenere cipher', () => {
  it('correctly enciphers a plaintext message and deciphers it back to the original', () => {
    // From The Code Book pages 68-69
    const vigenere = generateVigenereCipher(alphabets.english.split(''), 'KING');
    const ciphertext = vigenere.encipher('The Sun and the Man in the Moon');
    expect(ciphertext).toStrictEqual('DPRYEVNTNBUKWIAOXBUKWWBT');
    expect(vigenere.decipher(ciphertext)).toStrictEqual('thesunandthemaninthemoon');
  });
});

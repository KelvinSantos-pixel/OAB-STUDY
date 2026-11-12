/* Gera a linha de usuário para a lista USUARIOS, em src/parte2.js.
   Uso:  node gerar-hash.js joao.silva SenhaDele123                       */

const crypto = require('crypto');
const SAL = 'prepoab.2026.';   // precisa ser idêntico ao SAL em src/parte2.js

const [usuario, senha] = process.argv.slice(2);

if (!usuario || !senha) {
  console.log('Uso: node gerar-hash.js <usuario> <senha>');
  console.log('Ex.: node gerar-hash.js joao.silva SenhaDele123');
  process.exit(1);
}

const u = usuario.trim().toLowerCase();
const h = crypto.createHash('sha256').update(SAL + u + ':' + senha, 'utf8').digest('hex');

console.log('\nAcrescente esta linha ao array USUARIOS, em src/parte2.js:\n');
console.log(`  {u:'${u}', h:'${h}'},`);
console.log('\nDepois rode:  python3 build.py\n');
console.log('Lembre: esta lista é uma porta, não um cofre. Para controlar de verdade');
console.log('quem comprou, use a área de membros da plataforma de checkout.\n');

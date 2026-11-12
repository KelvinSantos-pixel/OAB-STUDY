const {chromium} = require('playwright');
(async()=>{
  const b = await chromium.launch({executablePath:'/usr/bin/google-chrome', args:['--no-sandbox']});
  const p = await b.newPage({viewport:{width:1280,height:900}});
  const erros=[];
  p.on('console', m=>{ if(m.type()==='error') erros.push('console: '+m.text()); });
  p.on('pageerror', e=>erros.push('pageerror: '+e.message));
  await p.goto('file:///home/claude/projeto/dist/index.html');
  await p.waitForTimeout(600);

  // 1. herói: a questão aparece e é respondível
  const temHeroi = await p.locator('#heroiQ .alt').count();
  console.log('1. Alternativas no herói:', temHeroi);
  await p.locator('#heroiQ .alt').first().click();
  await p.waitForTimeout(300);
  const devolutiva = await p.locator('#heroiQ .devolutiva').count();
  console.log('2. Devolutiva do herói apareceu:', devolutiva>0);
  await p.screenshot({path:'/home/claude/shot-vendas.png', fullPage:false});

  // 2. entrar na aplicação
  await p.locator('#btEntrar').click();
  await p.waitForTimeout(250);
  /* As credenciais vem do ambiente: nunca escreva senha dentro do repositorio.
     Uso:  TESTE_USUARIO=isa.bella TESTE_SENHA=... node teste.js            */
  const USUARIO = process.env.TESTE_USUARIO;
  const SENHA   = process.env.TESTE_SENHA;
  if(!USUARIO || !SENHA){
    console.error('Defina TESTE_USUARIO e TESTE_SENHA antes de rodar.');
    console.error('Ex.: TESTE_USUARIO=aluno TESTE_SENHA=suasenha node teste.js');
    await b.close(); process.exit(1);
  }
  await p.fill('#lUser',USUARIO); await p.fill('#lSenha',SENHA);
  await p.locator('#formLogin button[type=submit]').click();
  await p.waitForTimeout(400);
  console.log('3. Painel visível:', await p.locator('#app').isVisible());
  await p.screenshot({path:'/home/claude/shot-painel.png'});

  // 3. percorrer todas as views
  const views = ['simulado','questoes','erros','flashcards','resumos','trilhaoab','trilhagrad','atualizacoes','medalhas','ajustes','painel'];
  for(const v of views){
    await p.locator(`.item[data-v="${v}"]`).click();
    await p.waitForTimeout(220);
    const vazio = (await p.locator('#tela').innerText()).trim().length;
    console.log(`   view ${v}: ${vazio} caracteres renderizados`);
  }

  // 4. treinar uma questão
  await p.locator('.item[data-v="questoes"]').click(); await p.waitForTimeout(300);
  await p.locator('#tela .questao .alt').first().click(); await p.waitForTimeout(350);
  console.log('4. Treino: devolutiva =', await p.locator('#tela .devolutiva').count(), '| tutor =', await p.locator('#tela .tutor').count());
  await p.screenshot({path:'/home/claude/shot-questao.png', fullPage:true});

  // 5. simulado rápido completo, respondendo tudo
  await p.locator('.item[data-v="simulado"]').click(); await p.waitForTimeout(250);
  await p.locator('[data-sim="rapido"]').click(); await p.waitForTimeout(400);
  console.log('5. Relógio:', await p.locator('#relogio').innerText());
  for(let i=0;i<20;i++){
    const alts = p.locator('#tela .questao .alt');
    if(await alts.count()===0) break;
    await alts.nth(i%4).click();
    await p.waitForTimeout(70);
  }
  await p.screenshot({path:'/home/claude/shot-simulado.png'});
  p.once('dialog', d=>d.accept());
  await p.locator('#btEncerrar').click();
  await p.waitForTimeout(600);
  const temNota = await p.locator('.notao .n').count();
  console.log('6. Resultado exibido:', temNota>0, temNota? '| nota: '+(await p.locator('.notao .n').innerText()):'');
  await p.screenshot({path:'/home/claude/shot-resultado.png', fullPage:true});

  // 6. um segundo simulado, para checar o comparativo e o gráfico
  await p.locator('#btNovo').click(); await p.waitForTimeout(250);
  await p.locator('[data-sim="rapido"]').click(); await p.waitForTimeout(350);
  for(let i=0;i<20;i++){ const a=p.locator('#tela .questao .alt'); if(await a.count()===0) break; await a.nth(1).click(); await p.waitForTimeout(60); }
  p.once('dialog', d=>d.accept());
  await p.locator('#btEncerrar').click(); await p.waitForTimeout(500);
  await p.locator('.item[data-v="painel"]').click(); await p.waitForTimeout(350);
  console.log('7. Gráfico de evolução:', await p.locator('.grafico svg').count()>0, '| tabela comparativa:', await p.locator('.tabwrap table').count()>0);
  await p.screenshot({path:'/home/claude/shot-evolucao.png', fullPage:true});

  // 7. caderno de erros
  await p.locator('.item[data-v="erros"]').click(); await p.waitForTimeout(300);
  console.log('8. Caderno de erros tem questão:', await p.locator('#tela .questao').count()>0);

  // 8. flashcard virando
  await p.locator('.item[data-v="flashcards"]').click(); await p.waitForTimeout(250);
  await p.locator('#fcVirar').click(); await p.waitForTimeout(200);
  console.log('9. Flashcard virou:', await p.locator('.flashverso').count()>0);

  // 9. resumo abrindo
  await p.locator('.item[data-v="resumos"]').click(); await p.waitForTimeout(250);
  await p.locator('.lr').first().click(); await p.waitForTimeout(250);
  console.log('10. Resumo aberto com tabela:', await p.locator('.leitura table').count()>0);

  // 10. mobile
  await p.setViewportSize({width:390,height:844});
  await p.locator('.item[data-v="painel"]').click(); await p.waitForTimeout(350);
  const scrollX = await p.evaluate(()=>document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('11. Transbordo horizontal no celular:', scrollX, 'px');
  await p.screenshot({path:'/home/claude/shot-mobile.png'});

  console.log('\n=== ERROS DE EXECUÇÃO ===');
  console.log(erros.length? erros.join('\n') : 'nenhum');
  await b.close();
})();

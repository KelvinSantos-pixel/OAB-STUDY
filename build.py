#!/usr/bin/env python3
"""Junta conteúdo, marcação e lógica em dist/index.html.

A lista de alunos vem de usuarios.json, que fica fora do controle de versão.
Sem esse arquivo, usa usuarios.exemplo.json e avisa.

Uso:  python3 build.py
"""
import io, json, os, sys

PARTES = [
    'conteudo/questoes-1.js', 'conteudo/questoes-2.js',
    'conteudo/questoes-3.js', 'conteudo/questoes-4.js',
    'conteudo/flashcards.js', 'conteudo/resumos.js',
    'conteudo/trilhas.js', 'conteudo/grade-una.js', 'src/parte2.js',
]
MARCA = '/*__USUARIOS__*/'


def carregar_usuarios():
    if os.path.exists('usuarios.json'):
        with io.open('usuarios.json', encoding='utf-8') as f:
            dados = json.load(f)
        return dados, 'usuarios.json'
    if os.path.exists('usuarios.exemplo.json'):
        with io.open('usuarios.exemplo.json', encoding='utf-8') as f:
            dados = json.load(f)
        print('AVISO: usuarios.json não encontrado. Usando usuarios.exemplo.json.')
        print('       Crie o seu com:  node gerar-hash.js <usuario> <senha>')
        return dados, 'usuarios.exemplo.json'
    print('AVISO: nenhuma lista de alunos encontrada. Ninguém vai conseguir entrar.')
    return [], '(nenhuma)'


def main():
    usuarios, origem = carregar_usuarios()
    for item in usuarios:
        if 'u' not in item or 'h' not in item:
            sys.exit('ERRO: cada entrada precisa ter "u" e "h". Veja usuarios.exemplo.json.')

    partes = [io.open('src/parte1.html', encoding='utf-8').read(), '\n<script>\n']
    for caminho in PARTES:
        texto = io.open(caminho, encoding='utf-8').read()
        if caminho.endswith('parte2.js'):
            if MARCA not in texto:
                sys.exit('ERRO: a marca %s sumiu de src/parte2.js.' % MARCA)
            texto = texto.replace(MARCA + '[]', json.dumps(usuarios, ensure_ascii=False))
        partes.append('/* ===== %s ===== */\n' % os.path.basename(caminho))
        partes.append(texto)
        partes.append('\n')
    partes.append('</script>\n</body>\n</html>\n')

    os.makedirs('dist', exist_ok=True)
    saida = 'dist/index.html'
    io.open(saida, 'w', encoding='utf-8').write(''.join(partes))

    tamanho = os.path.getsize(saida)
    print('%s gerado — %.0f KB, %d %s de %s'
          % (saida, tamanho / 1024, len(usuarios),
             'aluno' if len(usuarios) == 1 else 'alunos', origem))


if __name__ == '__main__':
    main()

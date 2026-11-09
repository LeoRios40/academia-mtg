"""Teste automático da Academia do Planeswalker.

Abre o arquivo HTML no Chromium (Playwright), passa por todas as telas e abas,
abre o jogo e joga 30 segundos simulados, e lista qualquer erro encontrado.
Uso:  python3 teste_automatico.py caminho/para/Academia_do_Planeswalker.html
"""
import asyncio, sys, json
from playwright.async_api import async_playwright

ARQ = sys.argv[1] if len(sys.argv) > 1 else 'out/Academia_do_Planeswalker.html'
IGNORAR = ('net::', 'Failed to load resource', 'ERR_', 'favicon')

async def rodar(largura, altura, nome):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': largura, 'height': altura})
        erros = []
        pg.on('pageerror', lambda e: erros.append(f'[{nome}] erro: {e}'))
        pg.on('console', lambda m: erros.append(f'[{nome}] console: {m.text}') if m.type == 'error' and not any(x in m.text for x in IGNORAR) else None)
        # sem internet de verdade: as consultas ao Scryfall falham, e a Academia precisa continuar funcionando
        await pg.route('**/api.scryfall.com/**', lambda r: r.abort())
        await pg.route('**/cards.scryfall.io/**', lambda r: r.abort())
        await pg.route('**/version.json*', lambda r: r.abort())
        await pg.add_init_script("localStorage.setItem('academiaPlaneswalker.v2', JSON.stringify({tourAsked:1, xp:10, done:{}, seen:{}, ach:[], firstTry:{}}))")
        url = 'file://' + __import__('os').path.abspath(ARQ)
        await pg.goto(url); await pg.wait_for_timeout(500)
        await pg.evaluate("S.seenVer = CUR_VER; save()")  # não abre o aviso de novidades
        await pg.goto(url); await pg.wait_for_timeout(800)
        await pg.evaluate("const c=document.getElementById('cvStart'); c&&c.click()")
        await pg.wait_for_timeout(500)
        telas = await pg.evaluate("VIEWS.slice()")
        for v in telas:
            await pg.evaluate(f"show({json.dumps(v)})"); await pg.wait_for_timeout(120)
        abas = await pg.evaluate("Object.entries(SECTIONS).flatMap(([v,D]) => D.tabs.map(([k]) => [v, D.kind, k]))")
        for v, kind, k in abas:
            if k == 'surv':
                continue
            var = 'deckTab' if kind == 'deck' else 'trTab'
            await pg.evaluate(f"{var}={json.dumps(k)}; show({json.dumps(v)})")
            await pg.wait_for_timeout(150)
        # jogo
        await pg.evaluate("trTab='surv'; show('treino')"); await pg.wait_for_timeout(500)
        await pg.evaluate("document.getElementById('g3Go').click()"); await pg.wait_for_timeout(300)
        await pg.evaluate("""(()=>{const D=window.G3D; for(let i=0;i<1800;i++){const R=D.R; if(!R||R.over) break; if(R.modal==='lvl') D.choose(0); else if(R.modal==='chest') document.getElementById('g3Ok').click(); D.update(1/60);} D.render(); D.end(false); D.close();})()""")
        await pg.wait_for_timeout(300)
        rolagem = await pg.evaluate("document.documentElement.scrollWidth > innerWidth")
        if rolagem:
            erros.append(f'[{nome}] a página tem rolagem para o lado')
        await b.close()
        return len(telas), len(abas), erros

async def main():
    total = []
    for w, h, n in [(1366, 800, 'PC'), (360, 800, 'celular')]:
        t, a, e = await rodar(w, h, n)
        print(f'{n}: {t} telas e {a} abas abertas, {len(e)} erro(s)')
        total += e
    for e in total:
        print(' -', e)
    sys.exit(1 if total else 0)

asyncio.run(main())

# Calculadora Simples

Uma calculadora de navegador sem build, sem dependências e sem complicação: HTML + CSS + um `script.js`. Abrir o `index.html` e usar.

## O que ela faz

- As quatro operações, porcentagem (`%`) e inversão de sinal (`±`)
- Preview do resultado enquanto você digita (`25 × 50 = 1.250` aparece antes do `=`)
- Números formatados em pt-BR na tela (`1.250`, `0,5`) — por dentro continua tudo em float com ponto
- Tema claro/escuro automático, seguindo o sistema
- Funciona com mouse, touch e teclado físico (inclusive o numérico, com NumLock ligado)

## Como usar

```bash
git clone https://github.com/tiagouzl/calculadorasimples.git
cd calculadorasimples/Calculadora/src
python3 -m http.server 8099
# abrir http://localhost:8099
```

Ou simplesmente abra o `index.html` direto no navegador. Não precisa instalar nada.

## Estrutura

```
Calculadora/src/
├── index.html        # layout + estilos
├── js/script.js      # lógica (operações, display, teclado)
└── assets/           # imagens
```

## Limites conhecidos

- Entrada limitada a 10 dígitos
- Sem histórico de contas e sem funções científicas — é uma calculadora simples de propósito

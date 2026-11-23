# Cleilson TST — Portal de Segurança do Trabalho (Offshore & Onshore)

Portal editorial de alta conversão focado em **Segurança do Trabalho (TST)** para empresas **Offshore (NR-37)** e **Onshore**, criado para consolidar a autoridade de **Cleilson** e gerar rentabilidade sustentável via **Google AdSense**, **Patrocínio Direto ("Oferecimento")**, **Afiliados** e **Publieditoriais**.

## Principais Funcionalidades

- **Auto-Leitura Inteligente (Text-to-Speech PT-BR)**: Player embutido em cada publicação com opção de ouvir **só o resumo** ou o **artigo completo**, controle de velocidade (`0.85x` a `1.8x`), seleção de voz em português e destaque visual em tempo real do trecho lido.
- **Resumo Executivo (Leitura em 30 Segundos)**: Caixa destacada no topo de cada conteúdo com os pontos-chave + *Aplicação Prática no Campo* para quem tem pouco tempo.
- **Multi-Formato**: Suporte completo para **Artigos em Texto**, **Vídeos Curtos (Pílulas / Shorts)** e **Imagens / Infográficos para DDS**.
- **Arquitetura de Rentabilidade (Alta Conversão)**:
  - Banner **Leaderboard (728x90 / Responsivo)** no topo.
  - Faixa **"Oferecimento Oficial"** (modelo Morning Brew).
  - **Anúncio In-Feed Nativo** no meio da lista de artigos.
  - **Anúncio In-Article** no meio da leitura (maior RPM no Google AdSense).
  - **Sidebar Sticky (300x250)** + Captura de Leads (Newsletter + Kit DDS Grátis).
  - Seção comercial **Mídia Kit / Anuncie Aqui** e **Política de Privacidade** pronta para aprovação no Google AdSense.
- **Área do Editor (Estúdio do Cleilson)**: Interface integrada para criar e testar novas publicações direto no navegador e exportar o JSON atualizado.
- **Modo Claro Editorial + Modo Escuro (Dark Mode)** e responsividade total para celular.

## Como Publicar Novos Conteúdos

1. **Rápido pelo navegador**: Clique em **Área do Editor** no topo ou rodapé do site, preencha título, categoria, resumo em tópicos e texto completo, e publique na hora.
2. **Permanente no repositório**: Edite `scripts/data.js` adicionando novos objetos ao array `DEFAULT_POSTS` (ou usando o botão **Exportar JSON** da Área do Editor) e faça `git push`.

## Como Ativar o Google AdSense

Substitua o conteúdo interno dos containers `.ad-slot` (`ad-leaderboard`, `ad-rectangle`, `ad-infeed` e `ad-in-article`) pelo bloco `<ins class="adsbygoogle">` fornecido pela sua conta Google AdSense e adicione a tag `<script async src="https://pagead2.googlesyndication.com/...">` no `<head>` do `index.html`.

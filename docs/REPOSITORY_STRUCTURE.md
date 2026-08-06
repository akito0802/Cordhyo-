# リポジトリ整理ガイド

## 目的

このリポジトリは、複数の音楽学習ページと過去の試作ファイルが同じルートに置かれています。公開を壊さず段階的に整理するため、現行ファイルと旧実装候補を区別します。

## 現在の公開方式

- GitHub Pages
- Source: `main`
- Folder: `/ (root)`
- `.nojekyll` を使用
- Pages公開用Workflowは使用しない

## 現行MIXラボ

`mix-lab.html` が参照する本番ファイル：

- `mix-lab-eq-rebuild.css`
- `mix-lab-phase2.css`
- `mix-lab-phase2.js`
- `mix-lab-phase3.js`
- `site-nav.css`
- `shared-menu.css`
- `shared-menu.js`
- `neet-note-theme.css`
- `neet-menu-ui.js`

## 旧実装・整理候補

以下は名称上、旧版・試作・ホットフィックスの可能性があります。まだ削除しません。

- `mix-lab.js`
- `mix-lab.css`
- `mix-lab-clean.js`
- `mix-lab-advanced.js`
- `mix-lab-advanced.css`
- `mix-lab-pro.js`
- `mix-lab-pro.css`
- `mix-lab-loop.js`
- `mix-lab-mobile.js`
- `mix-lab-mobile.css`
- `mix-lab-playback-hotfix.js`
- `mix-lab-playback-v2.js`
- `mix-lab-player-v3.js`
- `mix-lab-player-v4.js`
- `mix-lab-eq-rebuild.js`
- `mix-lab-eq-waveform.js`
- `mix-lab-eq-waveform.css`
- `mix-lab-source-ui.js`
- `mix-lab-source-ui.css`
- `mix-lab-sample-library.js`
- `mix-lab-link.js`

## 次の整理手順

1. 全HTMLから各候補ファイルの参照を検索する
2. 参照ゼロのファイルを `archive/mix-lab-legacy/` に移す
3. 公開ページを確認する
4. 問題がなければ別コミットで削除する
5. 本番MIXラボを `assets/mix-lab/` に移す場合は、HTML参照を同一コミットで更新する

## 削除済みの不要ファイル

- 一時的なPages再ビルド用マーカーファイル
- `apply-neet-menu.yml`
- `enhance-theory-lab.yml`
- `reorder-and-expand-theory.yml`
- `apply-mix-lab-phase3.yml`
- 独自PagesデプロイWorkflow

これらは一度きりの自動改修用で、残すと不要なActions実行や自動コミットの原因になるため削除しました。

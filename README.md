# Cordhyo / Music Learning Lab

ギターコード表・コード進行・音楽理論・MIXラボをまとめた、ブラウザだけで動く音楽学習サイトです。

## 公開ページ

- `index.html`：コード表
- `progressions.html`：コード進行
- `theory.html`：音楽理論
- `mix-lab.html`：MIXラボ
- `bass.html`：ベース向けページ
- `ukulele.html`：ウクレレ向けページ

## MIXラボの現行構成

現在の本番ページが直接参照している主要ファイルです。

- `mix-lab.html`
- `mix-lab-eq-rebuild.css`
- `mix-lab-phase2.css`
- `mix-lab-phase2.js`
- `mix-lab-phase3.js`
- `site-nav.css`
- `shared-menu.css`
- `shared-menu.js`
- `neet-note-theme.css`
- `neet-menu-ui.js`

上記以外の `mix-lab-*.js` / `mix-lab-*.css` には、旧版・試作版・差し替え前の実装が含まれています。参照確認が終わるまでは削除せず、段階的に整理します。

## GitHub Pages

このリポジトリは `main` ブランチの `/ (root)` を直接公開します。

- `.nojekyll`：Jekyll処理を無効化
- 公開用のGitHub Actions Workflowは使用しません
- 一度きりの自動改修Workflowは残しません

## 開発ルール

1. 本番HTMLから参照されているファイルを先に確認する
2. 一時的なデプロイトリガーファイルを作らない
3. HTMLを書き換える一度きりのWorkflowを残さない
4. 旧実装を削除するときは、全HTMLの参照を確認してから行う
5. 公開確認はGitHub上のコードではなく、GitHub Pagesの実配信HTMLで行う

詳しい整理方針は `docs/REPOSITORY_STRUCTURE.md` を参照してください。

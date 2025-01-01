# Zennの記事を投稿者がXにポストしたものを検索するTampermonkeyスクリプト

Zennの記事をXで共有する際、自分でポストするのではなく投稿者のポストをRTしたい時等に使用できます。

## 対象のページ

- 記事
- 本のトップページ
- スクラップ

## 使用方法

### Tampermonkeyのインストール

[Tampermonkey - Chrome ウェブストア](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja)

### ユーザースクリプトのインストール

https://github.com/waonpad/zenn-article-x-post-link-monkey/releases

### 対象ページに移動して実行

投稿者がXアカウントを紐つけているページで `command + B` を押すとXの検索結果ページが新しいタブで開く

## 開発

### プロジェクトのセットアップ

```bash
bun install
```

### ローカルサーバーの起動

```bash
bun dev
```

### ビルド

```bash
bun run build
```

### ユーザースクリプトのインストール

```bash
bun run preview
```

### リリース

```bash
bun run release
```

# Zennの記事を投稿者がXにポストしたものを検索するTampermonkeyスクリプト

Zennの記事をXで共有する際、自分でポストするのではなく投稿者のポストをRTしたい時等に使用できます。

## 対象のページ

- 記事
- 本のトップページ
- スクラップ

## 使用方法

### Tampermonkeyのインストール

[Tampermonkey - Chrome ウェブストア](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ja)

### プロジェクトのセットアップ

```bash
bun install
```

### ビルド

```bash
bun run build
```

### ユーザースクリプトのインストール

```bash
bun run preview
```

### 対象ページに移動して実行

投稿者がXアカウントを紐つけているページで `command + B` を押すとXの検索結果ページが新しいタブで開く

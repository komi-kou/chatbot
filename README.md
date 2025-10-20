# チャットワーク返信アシスタント（Gemini 2.5 Pro）

AIを使ってチャットワークのメッセージに対する返信案を自動生成するWebアプリケーションです。

## 機能

- ✅ Chatworkの新着メッセージを一覧表示
- ✅ Gemini 2.5 Proによる高品質な返信文の自動生成
- ✅ あなた専用の口調・文体で返信作成
- ✅ ワンクリックでコピー
- ✅ スマホ・PC両対応

## Vercelデプロイ手順

### 1. GitHubリポジトリの準備

1. GitHubで新しいリポジトリを作成
2. 以下のファイル構成でアップロード：

```
chatwork-reply-assistant/
├── api/
│   └── index.js
├── index-free.html
├── gemini-proxy.js
├── package.json
├── vercel.json
└── README.md
```

### 2. Vercelへのデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでログイン
3. 「New Project」をクリック
4. 作成したリポジトリを選択
5. 「Deploy」をクリック

デプロイが完了すると、URLが発行されます（例: https://your-app.vercel.app）

### 3. APIキーの設定

デプロイ完了後、アプリにアクセスして：

1. **設定タブ**を開く
2. **Chatwork APIトークン**を入力
   - [ここから取得](https://www.chatwork.com/service/packages/chatwork/subpackages/api/token.php)
3. **Gemini APIキー**を入力
   - [Google AI Studio](https://aistudio.google.com/app/apikey)から取得
4. 「設定を保存」をクリック

## 使い方

1. **メッセージタブ**で「新着メッセージをチェック」をクリック
2. 返信したいメッセージを選択
3. 「返信案を作成（Gemini 2.5 Pro）」をクリック
4. 生成された返信文を「コピー」してチャットワークに貼り付け

## スマホでの使い方

1. ブラウザでアプリのURLを開く
2. ブラウザのメニューから「ホーム画面に追加」
3. アプリとして起動可能

## API制限

- **Gemini 2.5 Pro**: 1日100リクエスト（無料枠）
- **Chatwork API**: 制限はアカウント設定による

## トラブルシューティング

### メッセージが取得できない
- Chatwork APIトークンが正しいか確認
- デバッグタブでエラーログを確認

### 返信案が生成されない
- Gemini APIキーが正しいか確認
- APIの利用制限に達していないか確認

## セキュリティについて

- APIキーはブラウザのlocalStorageに保存されます
- サーバー側には保存されません
- 他人と端末を共有しないでください

## ライセンス

MIT License

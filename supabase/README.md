# 思い出フォト Supabase セットアップ

1. Supabase Dashboardで対象プロジェクトを開きます。
2. SQL Editorで `memories-setup.sql` の全内容を実行します。
3. Authentication > URL Configurationを開きます。
4. Redirect URLsへ次を追加します。

```text
https://junjun5429-debug.github.io/EGYPT2026-test/memories.html
```

## メール認証

Authentication > Providers > Emailを有効にします。現在のプロジェクトでは有効です。

## Google認証

1. Google Cloud ConsoleでOAuth 2.0クライアントを作成します。
2. Supabase DashboardのAuthentication > Providers > GoogleへClient IDとClient Secretを設定します。
3. Supabaseが表示するCallback URLをGoogle側の承認済みリダイレクトURIへ追加します。
4. Googleプロバイダーを有効にします。

`memories` バケットは非公開です。SQLのRLSポリシーにより、各ユーザーは `memories/{user_id}/` 以下と、自分の `travel_memories` レコードだけを操作できます。
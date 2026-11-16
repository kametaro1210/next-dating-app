"use client";

import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {

  // 新規登録とログインのどちらを行うかを管理する。
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  // 入力されたメールアドレスを保持する。
  const [email, setEmail] = useState<string>("");

  // 入力されたパスワードを保持する。
  const [password, setPassword] = useState<string>("");

  // 認証処理中かどうかを管理する。
  const [loading, setLoading] = useState<boolean>(false);

  // 画面に表示するエラーメッセージを保持する。
  const [error, setError] = useState<string>("");

  // Supabaseの認証機能を呼び出すクライアント。
  const supabase = createClient();

  // 現在のユーザーと認証状態の読み込み状況を取得する。
  const { user, loading: authLoading } = useAuth();

  // ページ遷移に使用するルーター。
  const router = useRouter();

  // ------------------------------------------------------------------------------------

  /*
    メールアドレスとパスワードで認証する処理

    【処理フロー】
    1. フォーム送信を止め、エラーを消して処理中にする。
    2. isSignUpがtrueなら新規登録、falseならパスワードでログインする。
    3. 新規登録後にユーザーが作成され、セッションがない場合は
        確認メールの案内を表示して終了する。
    4. 認証に失敗した場合はエラーメッセージを表示する。
        成功時は認証状態が更新され、トップページへ移動する。
    5. 成否にかかわらず、処理中の状態を解除する。

    ※ 認証データは返さず、画面状態の更新で結果を表示する。
  */

  // 認証済みのユーザーをトップページへ移動する。
  useEffect(() => {
    if (user && !authLoading) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  async function handleAuth(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setError("確認リンクのメールをご確認ください。");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-red-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TestMatch
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isSignUp ? "アカウントを作成する" : "アカウントにサインインする"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleAuth}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
              placeholder="メールアドレスを入力してください"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-800 dark:text-white"
              placeholder="Passwordを入力してください"
            />
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300 text-sm"
          >
            {isSignUp
              ? "すでにアカウントをお持ちですか？"
              : "アカウントをお持ちでないですか？"}
          </button>
        </div>
      </div>
    </div>
  );
}
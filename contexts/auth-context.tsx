"use client";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  // 現在ログインしているユーザー。未ログインの場合はnull。
  user: User | null;

  // 認証状態を確認中かどうか。
  loading: boolean;

  // ログアウトして認証ページへ移動する関数。
  signOut: () => Promise<void>;
}

// 認証情報を子コンポーネントへ共有するContext。Provider外ではundefined。
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  // 現在ログインしているユーザーを保持する。
  const [user, setUser] = useState<User | null>(null);

  // 認証状態を確認中かどうかを保持する。
  const [loading, setLoading] = useState<boolean>(false);

  // Supabaseの認証機能を呼び出すクライアント。
  const supabase = createClient();

  // 認証成功後などのページ遷移に使用するルーター。
  const router = useRouter();

  // ---------------------------------------------------------------------------------------

    /*
    Supabaseから現在のユーザーを確認し、認証状態の変更を監視する処理

    【処理フロー】
    1. 現在のセッションを取得し、ユーザー情報をstateに保存する。未ログインの場合はnullにする。
    2. 認証状態が変わったら、新しいユーザー情報をstateに保存する。
    3. エラーが発生した場合は、日本語の説明とエラー内容をコンソールに出力する。
    4. 処理の終了後、確認中の状態を解除する。
  */

  useEffect(() => {
    async function checkUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setUser(session?.user ?? null);
        console.log(session?.user);
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("ユーザー情報の確認中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [supabase.auth]);

    // ---------------------------------------------------------------------------------------

  /*
    Supabaseからログアウトし、認証ページへ移動する処理

    【処理フロー】
    1. Supabaseのログアウト処理を呼び出す。
    2. ログアウト処理の呼び出しが完了したら認証ページへ移動する。
    3. 例外が発生した場合は、日本語の説明とエラー内容をコンソールに出力する。
  */

  async function signOut() {
    try {
      await supabase.auth.signOut();
      router.push("/auth");
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

  // ---------------------------------------------------------------------------------------

/*
  AuthContextから認証情報を取得するカスタムフック

  【処理フロー】
  1. AuthContextから認証情報を取得する。
  2. AuthProviderの外で呼び出された場合はエラーにする。
  3. AuthProvider内で呼び出された場合は、認証情報を返す。
*/

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthはAuthProvider内で使用してください。");
  }
  return context;
}
"use server";

import { createClient } from "../supabase/server";

export async function getCurrentUserProfile() {

  // Supabaseの認証・データ取得に使うクライアントを取得する。
  const supabase = await createClient();

  // 現在ログインしているユーザー情報を取得する。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン中のユーザーがいないか判定する。
  if (!user) {
    return null;
  }

  // ユーザーIDに一致するプロフィール情報と取得時のエラーを受け取る。
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // プロフィール情報の取得に失敗したか判定する。
  if (error) {
    console.error("プロフィールの取得に失敗しました:", error);
    return null;
  }

  return profile;
}


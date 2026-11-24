"use server";

import type { UserPreferences, UserProfile } from "@/app/profile/page";
import { createClient } from "../supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidUserPreferences(value: unknown): value is UserPreferences {
  if (!isRecord(value) || !isRecord(value.age_range)) {
    return false;
  }

  // 年齢範囲の下限・上限を取得する。
  const { min, max } = value.age_range;
  // 希望距離と希望する性別を取得する。
  const { distance, gender_preference } = value;

  return (
    typeof min === "number" &&
    Number.isInteger(min) &&
    min >= 18 &&
    typeof max === "number" &&
    Number.isInteger(max) &&
    max >= min &&
    typeof distance === "number" &&
    Number.isFinite(distance) &&
    distance > 0 &&
    Array.isArray(gender_preference) &&
    gender_preference.every(
      (gender: unknown) =>
        gender === "male" || gender === "female" || gender === "other"
    )
  );
}

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

export async function updateUserProfile(profileData: Partial<UserProfile>) {
  
  // Supabaseの認証・データ更新に使うクライアントを取得する。
  const supabase = await createClient();

  // 現在ログインしているユーザー情報を取得する。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン中のユーザーがいないか判定する。
  if (!user) {
    return { success: false, error: "ログインしていません。" };
  }

  if (
    profileData.preferences !== undefined &&
    !isValidUserPreferences(profileData.preferences)
  ) {
    return {
      success: false,
      error: "お相手の希望条件を正しく入力してください。",
    };
  }

  // プロフィール更新で発生したエラーを受け取る。
  const { error } = await supabase
    .from("users")
    .update({
      full_name: profileData.full_name,
      username: profileData.username,
      bio: profileData.bio,
      gender: profileData.gender,
      birthdate: profileData.birthdate,
      avatar_url: profileData.avatar_url,
      ...(profileData.preferences === undefined
        ? {}
        : { preferences: profileData.preferences }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  // プロフィールの更新に失敗したか判定する。
  if (error) {
    console.error("プロフィールの更新に失敗しました:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}


export async function uploadProfilePhoto(file: File) {
  // Supabaseの認証・画像保存に使うクライアントを取得する。
  const supabase = await createClient();

  // 現在ログインしているユーザー情報を取得する。
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン中のユーザーがいないか判定する。
  if (!user) {
    return { 
      success: false, 
      error: "ログインしていません。" 
    };
  }

  // アップロードする画像ファイルの拡張子を取得する。
  const fileExt = file.name.split(".").pop();

  // ユーザーID・現在時刻・拡張子を使って保存用のファイル名を作成する。
  const fileName = `${user.id}-${Date.now()}.${fileExt}`;

  // プロフィール画像を保存し、保存時のエラーを受け取る。
  const { error } = await supabase.storage
    .from("profile-photos")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  // プロフィール画像の保存に失敗したか判定する。
  if (error) {
    return { success: false, error: error.message };
  }

  // 保存したプロフィール画像の公開URLを取得する。
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(fileName);
  return { success: true, url: publicUrl };
}


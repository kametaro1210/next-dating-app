"use client";

import { getCurrentUserProfile } from "@/lib/actions/profile";
import { calculateAge } from "@/lib/helpers/calculate-age";
import Link from "next/link";
import { useEffect, useState } from "react";

// ユーザーのプロフィール情報の形式を定義する。
export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  gender: "male" | "female" | "other";
  birthdate: string;
  bio: string;
  avatar_url: string;
  preferences: UserPreferences;
  location_lat?: number;
  location_lng?: number;
  last_active: string;
  is_verified: boolean;
  is_online: boolean;
  created_at: string;
  updated_at: string;
}

// ユーザーが希望する相手の条件の形式を定義する。
export interface UserPreferences {
  age_range: {
    min: number;
    max: number;
  };
  distance: number;
  gender_preference: ("male" | "female" | "other")[];
}

export default function ProfilePage() {

  // profileは取得したプロフィール情報を保持する。
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // loadingはプロフィールを読み込み中かどうかを保持する。
  const [loading, setLoading] = useState(true);

  // errorはプロフィール取得に失敗したときのエラーメッセージを保持する。
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------------------------------

    /*
      ログイン中のユーザーのプロフィール情報を取得する処理

      【処理フロー】
      1. getCurrentUserProfileでプロフィール情報を取得する。
      2. 情報があればprofileに設定し、なければエラーメッセージを設定する。
      3. 取得中にエラーが発生した場合も、エラーメッセージを設定する。
      4. 取得処理が終わったら、読み込み状態を解除する。
    */

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getCurrentUserProfile();
        console.log(profileData);
        if (profileData) {
          setProfile(profileData);
        } else {
          setError("プロフィールを読み込めませんでした。");
        }
      } catch (err) {
        console.error("プロフィールの読み込み中にエラーが発生しました:", err);
        setError("プロフィールを読み込めませんでした。");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // ----------------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            プロフィールを読み込んでいます...
          </p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            プロフィールが見つかりません
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "プロフィールを読み込めませんでした。もう一度お試しください。"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            プロフィール
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            プロフィールとお相手の希望条件を管理できます
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={profile.avatar_url || "/default-avatar.png"}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {profile.full_name}, {calculateAge(profile.birthdate)}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      @{profile.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      登録日{" "}
                      {new Date(profile.created_at).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      自己紹介
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {profile.bio || "自己紹介はまだ登録されていません。"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      基本情報
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          性別
                        </label>
                        <p className="text-gray-900 dark:text-white capitalize">
                          {profile.gender === "male"
                            ? "男性"
                            : profile.gender === "female"
                              ? "女性"
                              : "その他"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          誕生日
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(profile.birthdate).toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      お相手の希望条件
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          年齢
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {profile.preferences.age_range.min} -{" "}
                          {profile.preferences.age_range.max}歳
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          距離
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          最大{profile.preferences.distance} km
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  よく使う操作
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/profile/edit"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-900 dark:text-white">
                        プロフィールを編集
                      </span>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  アカウント
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-gray-900 dark:text-white">
                      ユーザー名
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      @{profile.username}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
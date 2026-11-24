"use client";

import PhotoUpload from "@/components/PhotoUpload";
import {
  getCurrentUserProfile,
  updateUserProfile,
} from "@/lib/actions/profile";
import type { UserPreferences } from "@/app/profile/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PreferencesFormData = {
  age_range: {
    min: string;
    max: string;
  };
  distance: string;
  gender_preference: UserPreferences["gender_preference"];
};

// 希望条件が未登録の場合にフォームへ表示する初期値。
const DEFAULT_PREFERENCES_FORM_DATA: PreferencesFormData = {
  age_range: { min: "18", max: "50" },
  distance: "25",
  gender_preference: [],
};

// フォームで選択できる相手の性別と表示名。
const GENDER_OPTIONS: {
  value: UserPreferences["gender_preference"][number];
  label: string;
}[] = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
];

export default function EditProfilePage() {

  // プロフィール情報を取得中かどうかを保持する。
  const [loading, setLoading] = useState(true);

  // プロフィール情報を保存中かどうかを保持する。
  const [saving, setSaving] = useState(false);

  // 取得・保存に失敗したときに画面へ表示するメッセージを保持する。
  const [error, setError] = useState<string | null>(null);

  // プロフィール画面などへ移動するための機能を取得する。
  const router = useRouter();

  // formDataはフォームに表示し、保存時に送信するプロフィール情報を保持する。
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    gender: "male" as "male" | "female" | "other",
    birthdate: "",
    avatar_url: "",
    preferences: DEFAULT_PREFERENCES_FORM_DATA,
  });

  // --------------------------------------------------------------------------------------

    /*
      保存済みのプロフィール情報をフォームに読み込む処理

      【処理フロー】
      1. getCurrentUserProfileでプロフィール情報を取得する。
      2. 情報があれば、各フォーム項目に設定する。
      3. 取得中にエラーが発生した場合は、画面にエラーを表示する。
      4. 取得処理が終わったら、読み込み状態を解除する。
    */

  useEffect(() => {
    async function loadProfile() {
      try {
        // ログイン中のユーザーのプロフィール情報を取得する。
        const profileData = await getCurrentUserProfile();

        if (profileData) {
          setFormData({
            full_name: profileData.full_name || "",
            username: profileData.username || "",
            bio: profileData.bio || "",
            gender: profileData.gender || "male",
            birthdate: profileData.birthdate || "",
            avatar_url: profileData.avatar_url || "",
            preferences: {
              age_range: {
                min: String(
                  profileData.preferences?.age_range?.min ??
                    DEFAULT_PREFERENCES_FORM_DATA.age_range.min
                ),
                max: String(
                  profileData.preferences?.age_range?.max ??
                    DEFAULT_PREFERENCES_FORM_DATA.age_range.max
                ),
              },
              distance: String(
                profileData.preferences?.distance ??
                  DEFAULT_PREFERENCES_FORM_DATA.distance
              ),
              gender_preference:
                profileData.preferences?.gender_preference ??
                DEFAULT_PREFERENCES_FORM_DATA.gender_preference,
            },
          });
        }
      } catch (error) {
        console.error("プロフィールの読み込みに失敗しました:", error);
        setError("プロフィールの読み込みに失敗しました。");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // --------------------------------------------------------------------------------------

  /*
    入力されたプロフィール情報を保存する処理

    【処理フロー】
    1. フォームの標準送信を止め、保存中の状態にする。
    2. formDataをupdateUserProfileに渡して保存する。
    3. 保存に成功したらプロフィール画面へ移動し、失敗したらエラーを表示する。
    4. 保存処理が終わったら、保存中の状態を解除する。
  */

  async function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      // 入力された年齢と距離を数値に変換する。
      const minAge = Number(formData.preferences.age_range.min);
      const maxAge = Number(formData.preferences.age_range.max);
      const distance = Number(formData.preferences.distance);

      if (
        !Number.isInteger(minAge) ||
        minAge < 18 ||
        !Number.isInteger(maxAge) ||
        maxAge < minAge ||
        !Number.isFinite(distance) ||
        distance <= 0
      ) {
        setError("年齢と距離の希望条件を正しく入力してください。");
        return;
      }

      // 基本情報と数値入力欄を分け、保存用の希望条件を作成する。
      const { preferences, ...profileFields } = formData;
      // 入力されたプロフィール情報と希望条件を更新し、処理結果を受け取る。
      const result = await updateUserProfile({
        ...profileFields,
        preferences: {
          age_range: { min: minAge, max: maxAge },
          distance,
          gender_preference: preferences.gender_preference,
        },
      });
      if (result.success) {
        router.push("/profile");
      } else {
        console.error("プロフィールの更新に失敗しました:", result.error);
        setError("プロフィールの更新に失敗しました。");
      }
    } catch (error) {
      console.error("プロフィールの更新に失敗しました:", error);
      setError("プロフィールの更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------------------------------------------

  /*
    変更されたフォーム項目の値を更新する処理

    【引数】
    - e：入力項目の変更イベント。

    【処理フロー】
    1. 変更された項目の名前と入力値を取得する。
    2. 既存のフォーム情報を保ったまま、変更された項目の値を更新する。
  */

  function handleInputChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    // 変更された入力項目の名前と入力値を取得する。
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePreferenceNumberChange(
    field: "age_min" | "age_max" | "distance",
    value: string
  ) {
    setFormData((prev) => {
      if (field === "distance") {
        return {
          ...prev,
          preferences: { ...prev.preferences, distance: value },
        };
      }

      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          age_range: {
            ...prev.preferences.age_range,
            [field === "age_min" ? "min" : "max"]: value,
          },
        },
      };
    });
  }

  function handleGenderPreferenceChange(
    gender: UserPreferences["gender_preference"][number],
    checked: boolean
  ) {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        gender_preference: checked
          ? [...prev.preferences.gender_preference, gender]
          : prev.preferences.gender_preference.filter(
              (selectedGender) => selectedGender !== gender
            ),
      },
    }));
  }

  // --------------------------------------------------------------------------------------

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            プロフィールを編集
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            プロフィール情報を更新できます
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            onSubmit={handleFormSubmit}
          >
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                プロフィール写真
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    {formData.avatar_url ? (
                      <Image
                        src={formData.avatar_url}
                        alt="プロフィール写真"
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-semibold text-gray-500">
                        No IMAGE
                      </div>
                    )}
                  </div>
                  <PhotoUpload
                    onPhotoUploaded={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        avatar_url: url,
                      }));
                    }}
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    新しいプロフィール写真をアップロード
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    JPG、PNG、GIF形式（最大5MB）
                  </p>
                </div>
              </div>
            </div>

            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  氏名 *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="氏名を入力してください"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  ユーザー名 *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="ユーザー名を入力してください"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  性別 *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  誕生日 *
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                お相手の希望条件
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="preferred_min_age"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    希望年齢（下限）
                  </label>
                  <input
                    id="preferred_min_age"
                    type="number"
                    min={18}
                    step={1}
                    required
                    value={formData.preferences.age_range.min}
                    onChange={(event) =>
                      handlePreferenceNumberChange("age_min", event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferred_max_age"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    希望年齢（上限）
                  </label>
                  <input
                    id="preferred_max_age"
                    type="number"
                    min={Math.max(
                      18,
                      Number(formData.preferences.age_range.min) || 18
                    )}
                    step={1}
                    required
                    value={formData.preferences.age_range.max}
                    onChange={(event) =>
                      handlePreferenceNumberChange("age_max", event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preferred_distance"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    希望する距離（km）
                  </label>
                  <input
                    id="preferred_distance"
                    type="number"
                    min={1}
                    step={1}
                    required
                    value={formData.preferences.distance}
                    onChange={(event) =>
                      handlePreferenceNumberChange("distance", event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    希望する相手の性別
                  </legend>
                  <div className="flex flex-wrap gap-4">
                    {GENDER_OPTIONS.map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <input
                          type="checkbox"
                          checked={formData.preferences.gender_preference.includes(
                            value
                          )}
                          onChange={(event) =>
                            handleGenderPreferenceChange(
                              value,
                              event.target.checked
                            )
                          }
                          className="h-4 w-4 accent-pink-500"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    選択しない場合は、性別を指定しません。
                  </p>
                </fieldset>
              </div>
            </section>

            <div className="mb-8">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                自己紹介 *
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="自己紹介を入力してください..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.bio.length}/500文字
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saving ? "保存中..." : "変更を保存"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: [".env.local", ".env"] });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVER_KEY = process.env.SUPABASE_SECRET_KEY

if (!SUPABASE_URL || !SUPABASE_SERVER_KEY) {
  throw new Error(
    ".env.local または .env に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SECRET_KEY (または SUPABASE_SERVICE_ROLE_KEY) を設定してください。公開用の publishable key は使用できません。"
  );
}

const PASSWORD = "password";

// サーバー用キーを使用してSupabaseクライアントを初期化
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVER_KEY);

// ダミーのプロフィールデータ
const fakeProfiles = [
  {
    full_name: "佐藤 沙織",
    username: "sarah_j",
    email: "sarah.johnson@example.com",
    gender: "female" as const,
    birthdate: "1995-03-15",
    bio: "ハイキングとコーヒー、そして楽しいおしゃべりが大好きです。一緒に世界を旅できる人を探しています！🌍",
    avatar_url: " ",
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "陳 アレックス",
    username: "alex_c",
    email: "alex.chen@example.com",
    gender: "female" as const,
    birthdate: "1992-07-22",
    bio: "写真と旅行に情熱を注いでいます。いつでも冒険に出かける準備はできています！📸✈️",
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 28, max: 38 },
      distance: 30,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "高橋 エマ",
    username: "emma_w",
    email: "emma.wilson@example.com",
    gender: "female" as const,
    birthdate: "1990-11-08",
    bio: "読書好きでヨガにハマっています。自己成長や深い対話を大切にする人と出会いたいです。📚🧘‍♀️",
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 30, max: 40 },
      distance: 25,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "田中 マイケル",
    username: "mike_r",
    email: "michael.rodriguez@example.com",
    gender: "male" as const,
    birthdate: "1988-05-12",
    bio: "テック好きで筋トレが趣味です。一緒に冒険や美味しい食事を楽しめる人を探しています！💻🏋️‍♂️",
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 40,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "キム ジェシカ",
    username: "jess_k",
    email: "jessica.kim@example.com",
    gender: "female" as const,
    birthdate: "1993-09-18",
    bio: "アーティストでコーヒー中毒です。新しい場所を探索したり、面白い人たちと出会うのが大好きです。🎨☕",
    avatar_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 26, max: 36 },
      distance: 35,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "鈴木 デイビッド",
    username: "dave_t",
    email: "david.thompson@example.com",
    gender: "male" as const,
    birthdate: "1989-12-03",
    bio: "ミュージシャンでアウトドア派です。ギターとハイキング、そして心地よい雰囲気がすべて！🎸🏔️",
    avatar_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 24, max: 34 },
      distance: 45,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "伊藤 ソフィー",
    username: "sophie_m",
    email: "sophie.martin@example.com",
    gender: "female" as const,
    birthdate: "1994-02-28",
    bio: "グルメ好きのトラベルブロガーです。いつも最高のレストランや隠れた名店を探しています！🍕✈️",
    avatar_url:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 27, max: 37 },
      distance: 30,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "パク ライアン",
    username: "ryan_p",
    email: "ryan.park@example.com",
    gender: "male" as const,
    birthdate: "1991-06-14",
    bio: "起業家兼フィットネスコーチです。人の目標達成をサポートすることに情熱を持っています！💪🚀",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 25, max: 35 },
      distance: 50,
      gender_preference: ["female"],
    },
  },
  {
    full_name: "山本 イザベラ",
    username: "bella_g",
    email: "isabella.garcia@example.com",
    gender: "female" as const,
    birthdate: "1996-08-07",
    bio: "ダンスインストラクターでフィットネス好きです。ポジティブな気持ちと良いエネルギーを広めるのが大好き！💃✨",
    avatar_url:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 23, max: 33 },
      distance: 25,
      gender_preference: ["male"],
    },
  },
  {
    full_name: "中村 ジェームズ",
    username: "james_a",
    email: "james.anderson@example.com",
    gender: "male" as const,
    birthdate: "1987-04-25",
    bio: "ソフトウェアエンジニアでボードゲーム好きです。一緒にオタクな冒険を楽しめる人を探しています！👨‍💻🎲",
    avatar_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    preferences: {
      age_range: { min: 26, max: 36 },
      distance: 40,
      gender_preference: ["female"],
    },
  },
];

function logPermissionHint(error: { code?: string }) {
  if (error.code === "42501") {
    console.error(
      "ℹ️ Supabase SQL Editorで scripts/fix-fake-profile-permissions.sql を実行してください。"
    );
  }
}

async function createFakeProfiles() {
  console.log("🚀 ダミープロフィールの作成を開始します...");
  let hasErrors = false;

  for (let i = 0; i < fakeProfiles.length; i++) {
    const profile = fakeProfiles[i];

    try {
      console.log(`\n📝 プロフィールを作成中 (${i + 1}/10): ${profile.full_name}`);

      // 1. 認証ユーザーが既に存在するか確認
      const { data: existingAuthUsers, error: listUsersError } =
        await supabase.auth.admin.listUsers();

      if (listUsersError) {
        hasErrors = true;
        console.error(
          `❌ ${profile.full_name} の認証ユーザー確認中にエラーが発生しました:`,
          listUsersError
        );
        continue;
      }

      const existingAuthUser = existingAuthUsers.users.find(
        (u) => u.email === profile.email
      );

      let userId: string;
      let createdAuthUser = false;

      if (existingAuthUser) {
        console.log(
          `⚠️ ${profile.full_name} の認証ユーザーは既に存在するため、既存のユーザーを使用します...`
        );
        userId = existingAuthUser.id;
      } else {
        // 新しい認証ユーザーを作成
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: profile.email,
            password: PASSWORD,
            email_confirm: true, // メールアドレスを自動確認済みにする
            user_metadata: {
              full_name: profile.full_name,
              username: profile.username,
            },
          });

        if (authError) {
          hasErrors = true;
          console.error(
            `❌ ${profile.full_name} の認証ユーザー作成中にエラーが発生しました:`,
            authError
          );
          continue;
        }

        userId = authData.user.id;
        createdAuthUser = true;
        console.log(`✅ 認証ユーザーを作成しました: ${userId}`);
      }

      // 2. ユーザープロフィールが既に存在するか確認
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (existingProfileError) {
        hasErrors = true;
        console.error(
          `❌ ${profile.full_name} のプロフィール確認中にエラーが発生しました:`,
          existingProfileError
        );
        logPermissionHint(existingProfileError);
        continue;
      }

      if (existingProfile) {
        console.log(
          `⚠️ ${profile.full_name} のプロフィールは既に存在するため、更新します...`
        );

        // 既存のプロフィールを新しいデータで更新
        const { error: updateError } = await supabase
          .from("users")
          .update({
            full_name: profile.full_name,
            username: profile.username,
            email: profile.email,
            gender: profile.gender,
            birthdate: profile.birthdate,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            preferences: profile.preferences,
            location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }), // サンフランシスコ周辺
            location_lng: faker.location.longitude({
              min: -122.5,
              max: -122.4,
            }),
            is_verified: true,
            is_online: Math.random() > 0.5,
          })
          .eq("id", userId);

        if (updateError) {
          hasErrors = true;
          console.error(
            `❌ ${profile.full_name} のプロフィール更新中にエラーが発生しました:`,
            updateError
          );
          logPermissionHint(updateError);
          continue;
        }
      } else {
        // 新しいユーザープロフィールデータを挿入
        const { error: profileError } = await supabase.from("users").insert({
          id: userId,
          full_name: profile.full_name,
          username: profile.username,
          email: profile.email,
          gender: profile.gender,
          birthdate: profile.birthdate,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          preferences: profile.preferences,
          location_lat: faker.location.latitude({ min: 37.7, max: 37.8 }), // サンフランシスコ周辺
          location_lng: faker.location.longitude({ min: -122.5, max: -122.4 }),
          is_verified: true,
          is_online: Math.random() > 0.5,
        });

        if (profileError) {
          hasErrors = true;
          console.error(
            `❌ ${profile.full_name} のプロフィール作成中にエラーが発生しました:`,
            profileError
          );
          logPermissionHint(profileError);

          if (createdAuthUser) {
            const { error: deleteError } =
              await supabase.auth.admin.deleteUser(userId);
            if (deleteError) {
              console.error(
                `❌ ${profile.full_name} の認証ユーザー削除中にエラーが発生しました:`,
                deleteError
              );
            }
          }
          continue;
        }
      }

      console.log(`✅ ${profile.full_name} のプロフィールを正常に作成しました`);
      console.log(`   📧 メールアドレス: ${profile.email}`);
      console.log(`   🔑 パスワード: ${PASSWORD}`);
      console.log(`   👤 ユーザー名: ${profile.username}`);
    } catch (error) {
      hasErrors = true;
      console.error(
        `❌ ${profile.full_name} のプロフィール作成中に予期しないエラーが発生しました:`,
        error
      );
    }
  }

  if (hasErrors) {
    console.error("\n❌ エラーが発生したため、ダミープロフィール作成は未完了です。");
    process.exitCode = 1;
    return;
  }

  console.log("\n🎉 ダミープロフィールの作成が完了しました！");
  console.log("\n📋 概要:");
  console.log('すべてのアカウントのパスワードは "password" です');
  console.log("すべてのメールアドレスは自動確認済みです");
  console.log("プロフィールにはサンフランシスコ周辺のランダムな位置情報が含まれています");
  console.log("テスト用に一部のユーザーはオンライン状態に設定されています");
}

// スクリプトを実行
createFakeProfiles().catch(console.error);
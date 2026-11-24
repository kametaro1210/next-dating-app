export const calculateAge = (birthdate: string) => {

  // 現在の日付を取得する。
  const today = new Date();

  // 引数の生年月日をDate型の日付として取得する。
  const birthDate = new Date(birthdate);

  // 現在の年から生まれた年を引いた年齢を取得する。
  let age = today.getFullYear() - birthDate.getFullYear();
  
  // 現在の月から誕生月を引いた差を取得する。
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // 今年の誕生日をまだ迎えていないか判定する。
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};
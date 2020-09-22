export default function (user_answer: string, answer: string) {
  let isCorrect = false;

  const correct_answers = answer.split(",");
  for (let i = 0; i < correct_answers.length; i++) {
    let mod_user_answer = user_answer;
    let correct_answer = correct_answers[i];
    const matches = correct_answer.match(/_(.*?)_(.+)/);
    if (matches) {
      correct_answer = matches[2];
      const modifiers = matches[1].split(" ");
      const contains_regex_mod = modifiers.includes("REGEX")
      if (modifiers.includes("IC")) {
        if (!contains_regex_mod)
          correct_answer = correct_answer.toLowerCase();
        mod_user_answer = mod_user_answer.toLowerCase();
      }
      if (modifiers.includes("IS")) {
        if (!contains_regex_mod)
          correct_answer = correct_answer.replace(/\s/g, '');
        mod_user_answer = mod_user_answer.replace(/\s/g, '');
      }
      if (contains_regex_mod) {
        const flags = modifiers.find(modifier => modifier.match(/FLAGS=\w+/));
        const does_match = Boolean(mod_user_answer.match(new RegExp(String(correct_answer), flags?.split("=")[1] ?? "")));
        if (does_match) correct_answer = mod_user_answer;
      }
    }
    isCorrect = correct_answer === mod_user_answer;
    if (isCorrect) break;
  }
  return isCorrect;
}
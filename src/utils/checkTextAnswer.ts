function extractGlobalMods(answer: string) {
  const matches = answer.match(/\((.*?)\)(.+)/);
  const global_modifiers = matches?.[1].split(" ") ?? [];
  const correct_answers = matches?.[2].split(",") ?? [answer];
  let alts: number[] = [];
  global_modifiers.forEach((global_mod => {
    const match = global_mod.match(/ALT=(\d)/);
    if (match) alts = match[1].replace("ALT=", '').split(",").map(alt => parseInt(alt))
  }));
  return {
    correct_answers,
    alts,
    global_modifiers
  }
}

function matchAnswer(answer: string, user_answer: string) {
  let isCorrect = false;
  const { correct_answers, alts, global_modifiers } = extractGlobalMods(answer);

  for (let i = 0; i < correct_answers.length; i++) {
    let mod_user_answer = user_answer;
    let correct_answer = correct_answers[i];
    const matches = correct_answer.match(/_?(.*?)_?(.+)/);
    if (matches || global_modifiers.length !== 0) {
      correct_answer = matches ? matches[2] : "";
      const local_modifiers = (matches ? matches[1] : "").split(" ");
      const contains_regex_mod = local_modifiers.includes("REGEX") || global_modifiers.includes("REGEX");
      if (local_modifiers.includes("IC") || global_modifiers.includes("IC")) {
        if (!contains_regex_mod)
          correct_answer = correct_answer.toLowerCase();
        mod_user_answer = mod_user_answer.toLowerCase();
      }
      if (local_modifiers.includes("IS") || global_modifiers.includes("IS")) {
        if (!contains_regex_mod)
          correct_answer = correct_answer.replace(/\s/g, '');
        mod_user_answer = mod_user_answer.replace(/\s/g, '');
      }
      if (contains_regex_mod) {
        const flags = local_modifiers.concat(global_modifiers).find(modifier => modifier.match(/FLAGS=\w+/));
        const does_match = Boolean(mod_user_answer.match(new RegExp(String(correct_answer), flags?.split("=")[1] ?? "")));
        if (does_match) correct_answer = mod_user_answer;
      }
    }
    isCorrect = correct_answer === mod_user_answer;
    if (isCorrect)
      break
  }
  return [isCorrect, alts] as [boolean, number[]];
}

export default function (user_answer: string[], answers: string[]) {
  const checked_answers: number[] = [];
  user_answer.forEach((user_answer, i) => {
    let isCorrect = false;
    const res = matchAnswer(answers[i], user_answer);
    const alts = res[1];
    if (!checked_answers.includes(i) || alts.length === 0) {
      isCorrect = res[0];
      if (isCorrect) checked_answers.push(i);
    }
    while (isCorrect === false) {
      const last_alt = alts.pop();
      if (last_alt === undefined || checked_answers.includes(last_alt)) break;
      else
        isCorrect = matchAnswer(answers[last_alt], user_answer)[0];
      if (isCorrect) checked_answers.push(last_alt)
    }
  })
  return checked_answers.length;
}
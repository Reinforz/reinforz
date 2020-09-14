import { IQuestionAnswerModifiers } from "../types";

function expander(modifier: string, answers: Record<string, string>) {
  Object.keys(answers).forEach((answer) => {
    if (modifier === 'IC') {
      const capitalized = answer.charAt(0).toUpperCase() + answer.substr(1);
      const uppercased = answer.toUpperCase();
      const lowercased = answer.toLowerCase();
      answers[uppercased] = uppercased;
      answers[lowercased] = lowercased;
      answers[capitalized] = capitalized;
    } else if (modifier === 'IS') if (answer.match(/\s/)) {
      const ans = answer.replace(/\s/g, '')
      answers[ans] = ans;
    }
  });
}
export default function (answers: string[]) {
  return answers.map((answer) => {
    const answer_modifiers: IQuestionAnswerModifiers = [];
    const all_answers: Record<string, string> = {};
    let mods_stripped = [] as string[]
    answer.split(',').forEach((chunk) => {
      const answer_modifier = chunk.match(/^_(\w{2}\s?)*_/);
      const modifiers = answer_modifier ? answer_modifier[0].split(' ').map((mod) => mod.replace(/_/, '')) : null;
      answer_modifiers.push(modifiers);
      const answer_without_modifier = answer_modifier ? chunk.replace(answer_modifier[0], '') : chunk;
      mods_stripped.push(answer_without_modifier)
      all_answers[answer_without_modifier] = answer_without_modifier;
      if (modifiers) modifiers.forEach((modifier) => expander(modifier, all_answers));
    });
    return Object.keys(all_answers).join(",");
  });
}

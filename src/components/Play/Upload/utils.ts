import shortid from 'shortid';
import { IQuizInputFull, IQuizInputPartial } from '../../../types';
import { generateQuestionInputConfigs } from '../../../utils';
import { trimLower } from '../../../utils/trimLower';

export const isDuplicate = (
  items: IQuizInputFull[],
  loadedData: IQuizInputPartial
) =>
  items.findIndex(
    (item) =>
      trimLower(item.title) === trimLower(loadedData.title) &&
      trimLower(item.subject) === trimLower(loadedData.subject)
  ) !== -1;

export const onResolved = (
  currentItems: IQuizInputFull[],
  newItems: IQuizInputPartial[]
) => {
  return currentItems.concat(
    newItems.map((quiz) => {
      quiz.questions = quiz.questions.map((question) =>
        generateQuestionInputConfigs(question)
      );
      if (!quiz._id) quiz._id = shortid();
      return quiz as IQuizInputFull;
    })
  );
};

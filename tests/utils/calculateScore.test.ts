import { calculateScore } from '../../src/utils';

describe('Correct answers', () => {
  describe('partial_score=true', () => {
    const options1 = {
      weight: 1,
      hints_used: 0,
      time_taken: 14,
      time_allocated: 60,
      partial_score: true,
      totalHints: 3
    } as const;

    describe('verdict=true', () => {
      const options2 = {
        ...options1,
        verdict: true
      };

      it(`Should work for all correct answers`, () => {
        const score = calculateScore({
          ...options2,
          totalAnswers: 1,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(1);
      });

      it(`Should work when all hints are used`, () => {
        const score = calculateScore({
          ...options2,
          hints_used: 3,
          totalAnswers: 1,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(0.85);
      });

      it(`Should work when some hints are used`, () => {
        const score = calculateScore({
          ...options2,
          hints_used: 1,
          totalAnswers: 1,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(0.95);
      });

      it(`Should work when full time allocated is used`, () => {
        const score = calculateScore({
          ...options2,
          time_taken: 59,
          totalAnswers: 1,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(0.89);
      });
    });

    describe('verdict=false', () => {
      const options2 = {
        ...options1,
        verdict: false
      };

      it(`Should work for partial correct answers`, () => {
        const score = calculateScore({
          ...options2,
          totalAnswers: 2,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(0.65);
      });
    });
  });

  describe('partial_score=false', () => {
    const options1 = {
      weight: 1,
      hints_used: 0,
      time_taken: 14,
      time_allocated: 60,
      partial_score: false,
      totalHints: 3
    } as const;

    describe('verdict=true', () => {
      const options2 = {
        ...options1,
        verdict: true
      };

      it(`Should work for all correct answers`, () => {
        const score = calculateScore({
          ...options2,
          totalAnswers: 1,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(1);
      });
    });

    describe('verdict=false', () => {
      const options2 = {
        ...options1,
        verdict: false
      };

      it(`Should work for partial correct answers`, () => {
        const score = calculateScore({
          ...options2,
          totalAnswers: 2,
          totalCorrectAnswers: 1
        });

        expect(score).toStrictEqual(0);
      });
    });
  });
});

describe('Wrong answers', () => {
  describe('partial_score=true', () => {
    it(`Should work for wrong answers`, () => {
      const score = calculateScore({
        weight: 1,
        hints_used: 0,
        time_taken: 14,
        time_allocated: 60,
        partial_score: true,
        totalAnswers: 1,
        totalCorrectAnswers: 0,
        totalHints: 3,
        verdict: false
      });

      expect(score).toStrictEqual(0.3);
    });
  });

  describe('partial_score=false', () => {
    it(`Should work for wrong answers`, () => {
      const score = calculateScore({
        weight: 1,
        hints_used: 0,
        time_taken: 14,
        time_allocated: 60,
        partial_score: false,
        totalAnswers: 1,
        totalCorrectAnswers: 0,
        totalHints: 3,
        verdict: false
      });

      expect(score).toStrictEqual(0);
    });
  });
});

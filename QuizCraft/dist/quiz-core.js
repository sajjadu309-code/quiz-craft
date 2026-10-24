/* Pure quiz rules. The browser UI uses these functions; Node tests check the same code. */
(function (root) {
  'use strict';
  function shuffle(items, random) {
    const result = items.slice();
    const rng = random || Math.random;
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function createAttempt(bank, count, seconds, name, random) {
    if (!Number.isInteger(count) || count < 5 || count > bank.length) throw new Error('Choose at least five questions within the bank size.');
    if (!Number.isFinite(seconds) || seconds <= 0) throw new Error('The time limit must be positive.');
    const questions = shuffle(bank, random).slice(0, count).map(function(q){return {...q, options:shuffle(q.options, random)};});
    return {questions:questions,seconds:seconds,name:String(name || 'Learner').trim() || 'Learner',index:0,answers:[],questionStartedAt:null,deadline:null,completedAt:null};
  }
  function beginQuestion(attempt, now) {
    attempt.questionStartedAt = now;
    attempt.deadline = now + attempt.seconds * 1000;
  }
  function remainingSeconds(attempt, now) { return Math.max(0, Math.ceil((attempt.deadline - now) / 1000)); }
  function recordAnswer(attempt, selectedId, now) {
    const question = attempt.questions[attempt.index];
    if (!question || attempt.answers[attempt.index] || attempt.deadline === null) return null;
    const timedOut = now >= attempt.deadline;
    if (!timedOut && !question.options.some(function(o){return o.id === selectedId;})) return null;
    const answer = {
      questionId:question.id,
      selectedId:timedOut ? null : selectedId,
      status:timedOut ? 'timeout' : (selectedId === question.correctId ? 'correct' : 'incorrect'),
      elapsedMs:Math.max(0, Math.min(attempt.seconds * 1000, now - attempt.questionStartedAt))
    };
    attempt.answers[attempt.index] = answer;
    return answer;
  }
  function summarize(attempt) {
    const correct = attempt.answers.filter(function(a){return a.status === 'correct';}).length;
    const incorrect = attempt.answers.filter(function(a){return a.status === 'incorrect';}).length;
    const timeout = attempt.answers.filter(function(a){return a.status === 'timeout';}).length;
    const elapsedMs = attempt.answers.reduce(function(total,a){return total + a.elapsedMs;}, 0);
    return {correct:correct,incorrect:incorrect,timeout:timeout,total:attempt.questions.length,answered:attempt.answers.length,percent:Math.round(correct / attempt.questions.length * 100),elapsedSeconds:Math.round(elapsedMs / 1000)};
  }
  const api = {shuffle:shuffle,createAttempt:createAttempt,beginQuestion:beginQuestion,remainingSeconds:remainingSeconds,recordAnswer:recordAnswer,summarize:summarize};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QuizCore = api;
})(typeof window !== 'undefined' ? window : globalThis);

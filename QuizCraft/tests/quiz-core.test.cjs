const test = require('node:test');
const assert = require('node:assert/strict');
const core = require('../dist/quiz-core.js');
const bank = require('../dist/questions.js');

function seededRandom(seed) {return function(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function newAttempt(count=5,seed=1) {return core.createAttempt(bank,count,15,'Test Learner',seededRandom(seed));}

test('question bank has 30 unique, unambiguous records',() => {
  assert.equal(bank.length,30);assert.equal(new Set(bank.map(q=>q.id)).size,30);
  for(const q of bank){assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(o=>o.id)).size,4);assert.equal(q.options.filter(o=>o.id===q.correctId).length,1);assert.ok(q.question && q.explanation);}
});
test('randomization keeps source unchanged and preserves each correct option',() => {
  const before=JSON.stringify(bank);const a=newAttempt(15,4);const b=newAttempt(15,40);
  assert.equal(new Set(a.questions.map(q=>q.id)).size,15);
  assert.notDeepEqual(a.questions.map(q=>q.id),b.questions.map(q=>q.id));
  for(const q of a.questions){const original=bank.find(item=>item.id===q.id);assert.equal(q.options.find(o=>o.id===q.correctId).text,original.options.find(o=>o.id===original.correctId).text);}
  assert.equal(JSON.stringify(bank),before);
});
test('first answer locks scoring and later clicks are ignored',() => {
  const a=newAttempt();core.beginQuestion(a,1000);
  const answer=core.recordAnswer(a,a.questions[0].correctId,2000);
  assert.equal(answer.status,'correct');assert.equal(core.recordAnswer(a,'bad-id',2100),null);assert.equal(core.summarize(a).correct,1);assert.equal(a.answers.length,1);
});
test('a click at the deadline counts as a timeout rather than a correct answer',() => {
  const a=newAttempt();core.beginQuestion(a,1000);
  assert.equal(core.remainingSeconds(a,15999),1);
  assert.equal(core.remainingSeconds(a,16000),0);
  assert.equal(core.recordAnswer(a,a.questions[0].correctId,16000).status,'timeout');
  assert.equal(a.answers[0].selectedId,null);assert.equal(a.answers[0].elapsedMs,15000);
});
test('background delay cannot award extra answering time',() => {
  const a=newAttempt();core.beginQuestion(a,1000);
  assert.equal(core.recordAnswer(a,a.questions[0].correctId,81000).status,'timeout');
  assert.equal(core.remainingSeconds(a,81000),0);assert.equal(a.answers[0].elapsedMs,15000);
});
test('invalid choice before deadline does not consume the question',() => {
  const a=newAttempt();core.beginQuestion(a,1000);
  assert.equal(core.recordAnswer(a,'not-an-option',2000),null);assert.equal(a.answers.length,0);
});
test('mixed result totals and percentage are calculated from all questions',() => {
  const a=newAttempt();
  for(let i=0;i<5;i++){
    a.index=i;core.beginQuestion(a,1000);
    const q=a.questions[i];
    const selected=i<3?q.correctId:q.options.find(o=>o.id!==q.correctId).id;
    core.recordAnswer(a,selected,i===4?20000:2000);
  }
  assert.deepEqual(core.summarize(a),{correct:3,incorrect:1,timeout:1,total:5,answered:5,percent:60,elapsedSeconds:19});
});
test('all configured question counts return the requested unique sample',() => {
  for(const count of [5,10,15])assert.equal(newAttempt(count).questions.length,count);
  assert.throws(()=>newAttempt(4));assert.throws(()=>newAttempt(31));
});

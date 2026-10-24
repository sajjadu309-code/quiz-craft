/* DOM updates and user interactions. All quiz rules are in quiz-core.js. */
(function () {
  'use strict';
  const $ = function(id){return document.getElementById(id);};
  const core = window.QuizCore;
  let attempt = null;
  let timerId = null;
  let screen = 'welcome';
  let lastSecond = null;
  const screens = ['welcome','quiz','results'];
  const statusLabels = {correct:'Correct',incorrect:'Incorrect',timeout:'Timed out'};

  function readStorage(key) { try { return localStorage.getItem(key); } catch (_) { return null; } }
  function writeStorage(key, value) { try { localStorage.setItem(key,value); } catch (_) { /* Quiz still works when storage is unavailable. */ } }
  function icon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','icon'); svg.setAttribute('aria-hidden','true');
    const use = document.createElementNS('http://www.w3.org/2000/svg','use');
    use.setAttribute('href','#i-' + name); svg.appendChild(use); return svg;
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.setAttribute('data-bs-theme',theme);
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    $('theme-toggle').setAttribute('aria-label',label); $('theme-toggle').title = label;
    $('theme-toggle').replaceChildren(icon(theme === 'dark' ? 'sun' : 'moon'));
    writeStorage('quizcraft-theme',theme);
  }
  function showScreen(name) {
    screen = name;
    screens.forEach(function(s){$(s + '-screen').hidden = s !== name;});
    window.scrollTo({top:0,behavior:'instant'});
  }
  function stopTimer() { if (timerId !== null) clearInterval(timerId); timerId = null; }
  function updateEstimate() {
    const maxSeconds = Number($('question-count').value) * Number($('time-limit').value);
    $('duration-estimate').textContent = 'About ' + Math.ceil(maxSeconds / 60) + ' minutes';
  }
  function renderProgress() {
    const progress = $('question-progress'); progress.replaceChildren();
    attempt.questions.forEach(function(q,i){
      const item = document.createElement('li');
      const answer = attempt.answers[i];
      const status = answer ? answer.status : (i === attempt.index ? 'current' : 'upcoming');
      item.className = status;
      item.setAttribute('aria-label','Question ' + (i + 1) + ': ' + (statusLabels[status] || status));
      item.title = item.getAttribute('aria-label');
      if (status === 'current') item.setAttribute('aria-current','step');
      if (status === 'correct') item.appendChild(icon('check'));
      else if (status === 'incorrect') item.appendChild(icon('x'));
      else if (status === 'timeout') item.appendChild(icon('clock'));
      else item.textContent = String(i + 1);
      progress.appendChild(item);
    });
    const stats = core.summarize(attempt);
    $('progress-label').textContent = 'Question ' + (attempt.index + 1) + ' of ' + stats.total;
    $('progress-percent').textContent = Math.round(stats.answered / stats.total * 100) + '% complete';
    $('live-score').textContent = String(stats.correct);
  }
  function updateTimer() {
    if (!attempt || screen !== 'quiz' || attempt.answers[attempt.index]) return;
    const now = performance.now();
    const seconds = core.remainingSeconds(attempt,now);
    if (seconds !== lastSecond) {
      $('timer-seconds').textContent = String(seconds);
      $('timer').classList.toggle('urgent',seconds <= 5);
      $('timer').setAttribute('aria-label',seconds + ' seconds remaining');
      lastSecond = seconds;
    }
    if (seconds === 0) submitAnswer(null,now);
  }
  function startQuestion() {
    stopTimer();
    const question = attempt.questions[attempt.index];
    $('question-category').textContent = question.category;
    $('question-title').textContent = question.question;
    $('answer-options').replaceChildren();
    $('answer-feedback').hidden = true;
    $('answer-feedback').replaceChildren();
    $('next-question').disabled = true;
    $('next-question').replaceChildren(document.createTextNode(attempt.index === attempt.questions.length - 1 ? 'See my results ' : 'Next question '),icon('arrow'));
    question.options.forEach(function(option,i){
      const button = document.createElement('button'); button.type = 'button'; button.className = 'answer-option'; button.dataset.optionId = option.id;
      const letter = document.createElement('span'); letter.className = 'option-letter'; letter.textContent = String.fromCharCode(65+i); letter.setAttribute('aria-hidden','true');
      const text = document.createElement('span'); text.className = 'option-text'; text.textContent = option.text;
      button.append(letter,text); button.addEventListener('click',function(){submitAnswer(option.id,performance.now());});
      $('answer-options').appendChild(button);
    });
    $('answer-hint').replaceChildren();
    const hint = document.createElement('span'); hint.className = 'key-hint'; hint.textContent = '1–4';
    $('answer-hint').append(hint,document.createTextNode(' to select an answer'));
    renderProgress();
    core.beginQuestion(attempt,performance.now()); lastSecond = null;
    updateTimer(); timerId = setInterval(updateTimer,100);
    $('question-title').focus({preventScroll:true});
  }
  function submitAnswer(selectedId,now) {
    if (!attempt || screen !== 'quiz') return;
    const answer = core.recordAnswer(attempt,selectedId,now);
    if (!answer) return;
    stopTimer();
    const question = attempt.questions[attempt.index];
    document.querySelectorAll('.answer-option').forEach(function(button){
      button.disabled = true;
      const id = button.dataset.optionId;
      if (id === question.correctId || (id === answer.selectedId && answer.status === 'incorrect')) {
        const correct = id === question.correctId;
        button.classList.add(correct ? 'correct-answer' : 'incorrect-answer');
        const state = document.createElement('span'); state.className = 'option-state';
        state.append(document.createTextNode(correct ? 'Correct answer' : 'Your answer'),icon(correct ? 'check' : 'x'));
        button.appendChild(state);
      }
    });
    const feedback = $('answer-feedback'); feedback.className = 'answer-feedback ' + answer.status;
    const lead = document.createElement('strong');
    lead.textContent = {correct:'That’s right. Nicely done!',incorrect:'Not quite. Here’s something to take away.',timeout:'Time’s up. Let’s learn from this one.'}[answer.status];
    const detail = document.createElement('p'); detail.textContent = question.explanation;
    feedback.replaceChildren(lead,detail); feedback.hidden = false;
    $('answer-hint').textContent = answer.status === 'timeout' ? 'No answer recorded' : 'Answer locked';
    $('next-question').disabled = false;
    $('timer').setAttribute('aria-label',answer.status === 'timeout' ? 'Time expired' : 'Timer stopped');
    if (answer.status === 'timeout') $('timer-seconds').textContent = '0';
    renderProgress();
  }
  function startQuiz() {
    stopTimer();
    attempt = core.createAttempt(window.QUESTION_BANK,Number($('question-count').value),Number($('time-limit').value),$('learner-name').value);
    $('session-count').textContent = String(attempt.questions.length);
    $('session-time').textContent = attempt.seconds + ' sec';
    showScreen('quiz'); startQuestion();
  }
  function addReviewField(parent,label,value) {
    const p = document.createElement('p'); const strong = document.createElement('strong'); strong.textContent = label + ' ';
    p.append(strong,document.createTextNode(value)); parent.appendChild(p);
  }
  function showResults() {
    stopTimer(); attempt.completedAt = new Date().toISOString();
    const stats = core.summarize(attempt);
    $('score-ring').style.background = 'conic-gradient(var(--primary) ' + stats.percent + '%, var(--border) ' + stats.percent + '%)';
    $('score-percent').textContent = stats.percent + '%';
    $('correct-total').textContent = String(stats.correct); $('incorrect-total').textContent = String(stats.incorrect);
    $('timeout-total').textContent = String(stats.timeout);
    $('elapsed-total').textContent = stats.elapsedSeconds >= 60 ? Math.floor(stats.elapsedSeconds/60) + 'm ' + stats.elapsedSeconds%60 + 's' : stats.elapsedSeconds + 's';
    $('score-title').textContent = stats.percent >= 80 ? 'That’s a strong foundation.' : stats.percent >= 50 ? 'Good progress. Keep building.' : 'Every attempt is a new beginning.';
    $('score-description').textContent = 'You answered ' + stats.correct + ' of ' + stats.total + ' questions correctly. ' + (stats.percent >= 80 ? 'Keep the momentum going.' : 'Review the explanations and give it another go.');
    $('results-greeting').textContent = (attempt.name === 'Learner' ? 'Your session is complete.' : 'Well done, ' + attempt.name + '.') + ' Here’s the full picture.';
    const storedBest = Number(readStorage('quizcraft-best'));
    const best = Math.max(Number.isFinite(storedBest) ? storedBest : 0,stats.percent);
    writeStorage('quizcraft-best',String(best)); $('best-score-label').textContent = 'Best score on this browser: ' + best + '%';
    $('review-count').textContent = stats.total + ' questions';
    $('answer-review').replaceChildren(); $('download-status').textContent = '';
    attempt.questions.forEach(function(q,i){
      const answer = attempt.answers[i];
      const item = document.createElement('details'); item.className = 'review-item';
      if (answer.status !== 'correct') item.open = true;
      const summary = document.createElement('summary');
      const number = document.createElement('span'); number.className = 'review-number'; number.textContent = String(i+1);
      const title = document.createElement('span'); title.className = 'review-question'; title.textContent = q.question;
      const status = document.createElement('span'); status.className = 'status-pill ' + answer.status; status.textContent = statusLabels[answer.status];
      const chevron = document.createElement('span'); chevron.className = 'review-chevron'; chevron.textContent = '⌄'; chevron.setAttribute('aria-hidden','true');
      summary.append(number,title,status,chevron);
      const body = document.createElement('div'); body.className = 'review-body';
      const chosen = q.options.find(function(o){return o.id === answer.selectedId;});
      addReviewField(body,'Your answer:',chosen ? chosen.text : 'Not answered (time expired)');
      addReviewField(body,'Correct answer:',q.options.find(function(o){return o.id === q.correctId;}).text);
      const explanation = document.createElement('p'); explanation.className = 'review-explanation'; explanation.textContent = q.explanation; body.appendChild(explanation);
      item.append(summary,body); $('answer-review').appendChild(item);
    });
    showScreen('results'); $('results-title').setAttribute('tabindex','-1'); $('results-title').focus({preventScroll:true});
  }
  function goHome() { stopTimer(); attempt = null; showScreen('welcome'); $('learner-name').focus({preventScroll:true}); }
  function requestExit() { if(screen === 'quiz') $('exit-dialog').showModal(); else goHome(); }

  setTheme(readStorage('quizcraft-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  $('theme-toggle').addEventListener('click',function(){setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');});
  $('question-count').addEventListener('change',updateEstimate); $('time-limit').addEventListener('change',updateEstimate); updateEstimate();
  $('setup-form').addEventListener('submit',function(event){event.preventDefault(); startQuiz();});
  $('next-question').addEventListener('click',function(){
    if (!attempt || !attempt.answers[attempt.index]) return;
    if (attempt.index === attempt.questions.length - 1) showResults();
    else {attempt.index++; startQuestion();}
  });
  $('retry-quiz').addEventListener('click',startQuiz);
  $('download-results').addEventListener('click',function(){
    try { window.QuizPDF.download(attempt); $('download-status').textContent = 'Your PDF download is ready. Check your browser downloads.'; }
    catch (error) { $('download-status').textContent = 'The PDF could not be created. Please try again.'; console.error('PDF export failed:',error); }
  });
  $('help-button').addEventListener('click',function(){$('help-dialog').showModal();});
  document.querySelectorAll('.close-dialog').forEach(function(button){button.addEventListener('click',function(){$('help-dialog').close();});});
  $('exit-quiz').addEventListener('click',requestExit); $('practice-nav').addEventListener('click',requestExit);
  $('continue-quiz').addEventListener('click',function(){$('exit-dialog').close();});
  $('confirm-exit').addEventListener('click',function(){$('exit-dialog').close(); goHome();});
  document.querySelectorAll('a.brand').forEach(function(link){link.addEventListener('click',function(event){event.preventDefault(); requestExit();});});
  document.addEventListener('keydown',function(event){
    if (screen !== 'quiz' || event.repeat || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    const index = Number(event.key) - 1;
    if (event.key >= '1' && event.key <= '4') {
      const button = $('answer-options').children[index];
      if (button && !button.disabled) {event.preventDefault();button.click();}
    }
  });
  document.addEventListener('visibilitychange',function(){if(!document.hidden) updateTimer();});
})();

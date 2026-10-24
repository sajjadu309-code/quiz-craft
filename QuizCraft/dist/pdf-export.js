/* A real downloadable PDF is generated locally with the bundled jsPDF library. */
(function (root) {
  'use strict';
  // The standard PDF font supports Latin text; normalize names safely for this font.
  function pdfText(value) { return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E\n]/g,'?'); }
  function create(attempt) {
    if (!attempt || attempt.answers.length !== attempt.questions.length) throw new Error('Finish the quiz before exporting.');
    if (!root.jspdf) throw new Error('The local PDF library is unavailable.');
    const doc = new root.jspdf.jsPDF({unit:'mm',format:'a4'});
    if (!root.QuizPDFFonts) throw new Error('The local PDF font files are unavailable.');
    // Embed fonts so the result looks consistent in PDF viewers on different systems.
    doc.addFileToVFS('QuizSans-Regular.ttf',root.QuizPDFFonts.regular);
    doc.addFont('QuizSans-Regular.ttf','QuizSans','normal');
    doc.addFileToVFS('QuizSans-Bold.ttf',root.QuizPDFFonts.bold);
    doc.addFont('QuizSans-Bold.ttf','QuizSans','bold');
    const stats = root.QuizCore.summarize(attempt);
    const margin = 18; const width = 174; let y = 22;
    doc.setProperties({title:'QuizCraft Quiz Results',subject:'Web Technologies practice results',author:'QuizCraft'});
    function text(value,size,bold,color) {
      doc.setFont('QuizSans',bold ? 'bold' : 'normal');doc.setFontSize(size || 10);doc.setTextColor(...(color || [38,39,58]));
      const lines = doc.splitTextToSize(pdfText(value),width);
      const height = (size || 10) * 0.3528 * 1.25;
      lines.forEach(function(line){if(y > 275){doc.addPage();y=22;}doc.text(line,margin,y);y += height;});
      return lines.length * height;
    }
    text('QuizCraft',25,true,[93,66,192]);y += 2;
    text('WEB TECHNOLOGIES QUIZ RESULTS',10,true);y += 6;
    text('Learner: ' + attempt.name,11,true);
    text('Completed: ' + new Date(attempt.completedAt).toLocaleString('en-GB'),10);
    text('Score: ' + stats.correct + ' / ' + stats.total + ' (' + stats.percent + '%)',13,true);
    text('Correct: ' + stats.correct + '   Incorrect: ' + stats.incorrect + '   Timed out: ' + stats.timeout,10);
    text('Answering time: ' + stats.elapsedSeconds + ' seconds   |   Limit: ' + attempt.seconds + ' seconds per question',10);y += 8;
    text('ANSWER REVIEW',12,true);y += 5;
    attempt.questions.forEach(function(q,index){
      if(y > 232){doc.addPage();y=22;}
      const answer = attempt.answers[index];
      const chosen = q.options.find(function(o){return o.id === answer.selectedId;});
      const correct = q.options.find(function(o){return o.id === q.correctId;});
      text((index+1) + '. ' + q.question,11,true);
      const label = {correct:'Correct',incorrect:'Incorrect',timeout:'Timed out'}[answer.status];
      const color = {correct:[22,119,84],incorrect:[184,45,65],timeout:[141,91,4]}[answer.status];
      text('Status: ' + label + '   |   Category: ' + q.category,9,true,color);
      text('Your answer: ' + (chosen ? chosen.text : 'Not answered (time expired)'),10);
      text('Correct answer: ' + correct.text,10);
      text('Explanation: ' + q.explanation,9,false,[83,87,104]);y += 7;
    });
    const pages = doc.getNumberOfPages();
    for(let i=1;i<=pages;i++){doc.setPage(i);doc.setDrawColor(225,226,233);doc.line(18,283,192,283);doc.setFont('QuizSans','normal');doc.setFontSize(8);doc.setTextColor(110,112,128);doc.text('QuizCraft | CSC336 Web Technologies',18,289);doc.text(i + ' / ' + pages,192,289,{align:'right'});}
    return doc;
  }
  function download(attempt) {
    const name = attempt.name.replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,35) || 'Learner';
    const url = URL.createObjectURL(create(attempt).output('blob'));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'QuizCraft-Results-' + name + '.pdf';
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},40000);
  }
  root.QuizPDF = {create:create,download:download};
})(window);

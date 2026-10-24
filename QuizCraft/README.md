# QuizCraft Web Technologies Quiz

A responsive, interactive quiz for **CSC336 Web Technologies Assignment 2**, COMSATS University Islamabad, Vehari Campus.

## Run in VS Code

1. Extract the downloaded ZIP. Do not run the files from inside the ZIP.
2. Open **VS Code > File > Open Folder** and select the `QuizCraft` folder containing `package.json`.
3. Open **Terminal > New Terminal**.
4. Run:

   ```sh
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser. Keep the terminal running.
6. Press **Ctrl+C** in the terminal to stop the server.

Node.js 18 or newer and npm are required for this method. There are no npm dependencies to install. Use a currently supported Node.js LTS release if you need to install Node.

**Without Node.js:** open `dist/index.html` in Chrome, Edge or Firefox. All CSS and JavaScript libraries are bundled locally. You can also open that file with the VS Code Live Server extension.

**PowerShell blocks npm.ps1:** run `npm.cmd run dev` instead. You do not need to change the execution policy.

**npm is not recognized:** install Node.js LTS from https://nodejs.org, then close and reopen VS Code. Alternatively, use the direct HTML method above.

**package.json not found:** open the folder containing `package.json`, not its parent folder or the `dist` folder.

**Port already in use:** stop the previous server with Ctrl+C. In PowerShell, you can use a different port with `$env:PORT=5174` followed by `npm.cmd run dev`, then open http://localhost:5174.

## Assignment requirements implemented

| Requirement | Implementation |
| --- | --- |
| HTML, CSS, JavaScript and Bootstrap | Semantic HTML, custom CSS, plain JavaScript and local Bootstrap 5.3.8 CSS |
| Multiple-choice questions | Four choices and exactly one correct answer per question |
| At least five randomized questions | 5 by default; options for 10 or 15 from a bank of 30 |
| Randomization | Fisher-Yates shuffle for questions and answer choices; no duplicate questions in an attempt |
| Multi-colored segmented progress | One segment per question; green correct, red incorrect, amber timeout, purple current |
| Countdown timer | 15, 30 or 45 seconds for each question; deadline-based validation |
| Correct and incorrect highlighting | Green correct choice, red selected wrong choice and an explanation |
| Dark and light modes | Theme toggle with a saved browser preference |
| Download results as PDF | Local jsPDF 3.0.3 export with score, answers, statuses and explanations |
| Responsive devices | Bootstrap columns and CSS media queries for desktop, tablet and mobile widths |
| PDF report and screenshots | Included in the `report` folder |

Question order is random, so a new attempt can share questions with an earlier attempt. A question never repeats within the same attempt.

## How to use

1. Optionally enter your name, choose question count and time, then start.
2. Click an answer or press 1, 2, 3 or 4. The first answer locks the question.
3. Read the explanation, then select **Next question**. On the last question, select **See my results**.
4. If time expires, the question earns zero points and the correct answer appears. Select Next when ready.
5. Review all answers and select **Download results PDF**.
6. Select **Try a fresh quiz** to start a new randomized attempt with the same settings.

The timer continues in background tabs and while an exit confirmation is open. Time used in results counts time spent answering; it excludes time spent reading feedback. A browser refresh discards the current attempt. The app stores only theme preference and best percentage in localStorage; there is no login, database or server-side score storage. Names in PDF exports use Latin characters supported by the bundled PDF font.

## Project files

| File | Purpose |
| --- | --- |
| `dist/index.html` | Page structure and the three screens |
| `dist/styles.css` | Layout, themes, question states and responsive rules |
| `dist/questions.js` | Thirty questions, answer IDs and explanations |
| `dist/quiz-core.js` | Shuffle, attempt state, timer validation and scoring |
| `dist/app.js` | DOM rendering, button events and screen changes |
| `dist/pdf-export.js` | Result PDF creation and download |
| `dist/vendor/` | Bootstrap CSS, jsPDF and their licenses |
| `server.cjs` | Small Node HTTP server using built-in modules |
| `tests/quiz-core.test.cjs` | Eight automated tests for quiz rules |
| `report/` | Assignment PDF report and actual website screenshots |
| `VIVA_GUIDE.md` | Simple English and Roman Urdu explanations |

No build command is needed. `dist` contains the actual editable source files, not generated minified application code.

## Change questions

Edit `dist/questions.js`. A record contains an ID, category, question text, four choices, the correct choice index (0 to 3) and an explanation. Each ID must be unique and every question must have exactly one correct answer. Do not change the vendor files.

## Verification

```sh
npm test
npm run check
```

Eight rule tests cover unique question records, randomization, locked answers, deadline boundaries, delayed callbacks, invalid choices, mixed scores and question counts. Browser checks and screenshots cover correct and incorrect feedback, a timeout, theme changes, completed results and responsive widths. PDF generation was separately checked for five and fifteen question results.

## GitHub and submission

The instructor requires a GitHub repository URL in the PDF report. A repository URL has not been invented or added to the report.

1. Sign in to your own GitHub account and create a repository named `quizcraft-csc336`.
2. Upload the **contents of the extracted QuizCraft folder**, including `dist`, `tests`, `package.json` and the report. Do not upload only the ZIP.
3. Commit the uploaded files. Make sure your instructor can access the repository.
4. Copy the actual repository URL.
5. Open `report/QuizCraft_Assignment_2_Report.pdf` in a PDF viewer that supports form fields. Fill your registration number and GitHub URL on page 1, then save a copy.
6. Submit the saved report with screenshots as requested. The hosted demo link, if supplied separately, does not replace the GitHub repository link.

## Libraries and references

- Bootstrap 5.3.8, MIT license: https://getbootstrap.com/docs/5.3/getting-started/download/
- jsPDF 3.0.3, MIT license: https://github.com/parallax/jsPDF
- MDN DOM reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById
- MDN media queries: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using

DejaVu Sans fonts are embedded in the exported PDFs for consistent rendering. Third-party library and font license notices are retained in `dist/vendor/`.

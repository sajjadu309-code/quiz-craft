# QuizCraft Viva Guide

## What does this project do

QuizCraft is a browser quiz app. It randomly selects questions, checks one answer per question, shows feedback, tracks time and exports a result PDF.

**Roman Urdu:** Yeh browser mein chalne wali quiz app hai. Sawalat random aate hain, jawab check hota hai, timer chalta hai aur result PDF mein milta hai.

## Which technologies are used

- HTML makes the page structure.
- CSS controls spacing, colors, layouts and dark mode.
- Bootstrap supplies the responsive grid and form styles.
- JavaScript controls the quiz behavior.
- jsPDF creates the result file inside the browser.
- Node.js only serves local files when we run `npm run dev`. The quiz itself runs in the browser.

**Roman Urdu:** HTML structure banata hai, CSS design karta hai aur JavaScript actions sambhalta hai. Bootstrap mobile layout mein madad karta hai. Node sirf local files browser ko deta hai; quiz ka logic browser mein chalta hai.

## How are questions randomized

`shuffle()` uses the Fisher-Yates method. It copies an array and swaps each element with a randomly chosen earlier position. The app takes the first 5, 10 or 15 questions and separately shuffles their choices. Stable option IDs keep the correct answer connected to its text after shuffling.

**Roman Urdu:** Array ki copy mein items ki jagah random swap hoti hai. Phir required sawalat liye jate hain. Options ki position badalne se sahi jawab nahi badalta kyun ke uski ID same rehti hai.

## How does the timer work

When a question starts, the app stores a deadline using `performance.now()`. An interval checks the remaining time. Every answer is checked against the deadline, so a late callback cannot give extra time. When time expires, answers lock and the question scores zero.

**Roman Urdu:** Har sawal ke start par aakhri waqt save hota hai. Interval sirf display update karta hai. Jawab dete waqt bhi deadline check hoti hai. Is liye tab background mein ho to bhi extra waqt nahi milta.

## How is double scoring prevented

`recordAnswer()` returns without changing the score when the question already has a recorded answer. The UI also disables all four choice buttons.

**Roman Urdu:** Pehla jawab save hone ke baad doosra click accept nahi hota. Buttons bhi disable ho jate hain, is liye score dobara nahi barhta.

## How is the percentage calculated

Percentage = correct answers / total questions x 100. Incorrect answers and timeouts earn zero points. For 3 correct answers out of 5, the result is 60 percent.

## What does each segment color mean

Green means correct, red means incorrect, amber means timed out, purple means current, and the neutral segments are upcoming questions. Icons and text labels also communicate these states.

## How does dark mode persist

The selected theme is saved in localStorage. CSS variables change the page colors. On a first visit, the app can follow the browser color preference. Storage errors do not stop the quiz.

**Roman Urdu:** Theme browser ke localStorage mein save hoti hai. CSS variables light aur dark colors change karte hain. Agar storage available na ho tab bhi quiz chalti rehti hai.

## How does PDF export work

`pdf-export.js` reads the finished attempt and uses jsPDF to write the score, each question, selected answer, correct answer, status and explanation. Longer reports continue on extra pages. Generation happens locally.

## How is the app responsive

Bootstrap column classes rearrange the setup form. CSS media queries hide the desktop sidebar, stack cards, resize text and keep buttons usable on small screens.

## Why are files separated

The question bank is separate from scoring rules, UI events and PDF export. This makes the app easier to change and lets tests check quiz rules without needing a browser.

## What are its limits

This is a front-end learning project, not a secure exam system. Answers exist in the client source, refresh resets the attempt, and there is no account or database. Best score and theme are stored on the same browser only. PDF names use the Latin character set of the standard PDF font.

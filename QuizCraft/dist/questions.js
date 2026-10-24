/* Edit this bank to add your own questions. Each question has one correct answer. */
(function (root) {
  'use strict';
  const questions = [
    ['html-1','HTML','Which HTML element creates a hyperlink?',['<a>','<link>','<href>','<url>'],0,'The <a> element creates a hyperlink. Its href attribute stores the destination URL.'],
    ['html-2','HTML','Which attribute gives an image a text alternative?',['title','src','alt','href'],2,'The alt attribute describes an image for people who cannot see it and when it cannot load.'],
    ['html-3','HTML','Which HTML element represents the main heading?',['<h6>','<header>','<heading>','<h1>'],3,'The <h1> element is the highest-level heading. Heading levels describe the content structure.'],
    ['html-4','HTML','Which input type provides built-in email format validation?',['text','email','address','mail'],1,'An input with type="email" checks the basic email format. It does not verify that an address exists.'],
    ['html-5','HTML','Which element contains the visible content of an HTML page?',['<head>','<meta>','<body>','<title>'],2,'The body element contains the page content users see, such as headings, images and buttons.'],
    ['html-6','HTML','Which element connects a visible caption to a form control?',['<label>','<caption>','<legend>','<span>'],0,'A label uses its for attribute to match an input id. Clicking the label can focus its control.'],
    ['html-7','HTML','What does the viewport meta tag help a responsive page do?',['Connect to a database','Use the device width for layout','Download a CSS framework','Store the visitor name'],1,'The viewport meta tag with width=device-width makes the layout viewport match the device width.'],
    ['html-8','HTML','Which HTML element is intended for a major navigation section?',['<article>','<aside>','<footer>','<nav>'],3,'The nav element identifies a section of navigation links for browsers and assistive technology.'],
    ['css-1','CSS','Which CSS property changes text color?',['font-style','background-color','color','text-transform'],2,'The color property sets the foreground color of text. Background color is controlled separately.'],
    ['css-2','CSS','Which CSS selector matches an element with id="quiz"?',['.quiz','#quiz','quiz','*quiz'],1,'An ID selector begins with #. A class selector begins with a period.'],
    ['css-3','CSS','Which declaration creates a flex container?',['display: flex;','position: flex;','flex: display;','layout: flexible;'],0,'display: flex makes an element a flex container so its direct children become flex items.'],
    ['css-4','CSS','Which CSS feature applies styles only at certain screen sizes?',['A keyframe','A pseudo-element','A custom font','A media query'],3,'A media query applies CSS when a condition is true, such as a maximum viewport width.'],
    ['css-5','CSS','Which property adds space inside an element border?',['margin','gap','padding','outline'],2,'Padding is the space between content and its border. Margin is the space outside the border.'],
    ['css-6','CSS','What does box-sizing: border-box include in the declared width?',['Only the content','Content, padding and border','Content and margin','Only the border'],1,'With border-box, an element width includes its content, padding and border. Margin stays outside.'],
    ['css-7','CSS','Which CSS unit is relative to the root element font size?',['px','vh','em','rem'],3,'The rem unit is based on the root element font size. The em unit depends on its context.'],
    ['js-1','JavaScript','Which JavaScript keyword declares a block-scoped variable that can be reassigned?',['var','let','const','static'],1,'let declares a block-scoped variable and allows reassignment. const does not allow reassignment.'],
    ['js-2','JavaScript','Which method selects an element by its ID?',['document.getElementById()','document.getElementsByClassName()','document.createElement()','document.querySelectorAll()'],0,'document.getElementById returns the element whose id matches the supplied string, or null.'],
    ['js-3','JavaScript','Which array method adds an element to the end?',['shift()','pop()','push()','slice()'],2,'push adds one or more elements to the end of an array and returns the new array length.'],
    ['js-4','JavaScript','Which array method removes and returns the last element?',['unshift()','map()','filter()','pop()'],3,'pop removes and returns the final element. On an empty array it returns undefined.'],
    ['js-5','JavaScript','Which method runs a callback repeatedly at a given interval?',['setTimeout()','setInterval()','clearTimeout()','addEventListener()'],1,'setInterval schedules repeated callbacks. clearInterval stops them using the returned interval ID.'],
    ['js-6','JavaScript','Which operator checks equality without type conversion?',['===','==','=','!='],0,'Strict equality (===) compares values without converting their types. The = operator assigns a value.'],
    ['js-7','JavaScript','Which method attaches an event handler to an element?',['appendChild()','getAttribute()','addEventListener()','preventDefault()'],2,'addEventListener registers a function to run when an event, such as a click, happens.'],
    ['js-8','JavaScript','Which API can save a theme preference between browser visits?',['console.log()','localStorage','setInterval()','document.write()'],1,'localStorage stores string values for an origin across visits. Browsers may restrict or clear it.'],
    ['js-9','JavaScript','Which expression converts a JavaScript object into a JSON string?',['JSON.read(value)','JSON.parse(value)','String.parse(value)','JSON.stringify(value)'],3,'JSON.stringify serializes a JavaScript value as JSON. JSON.parse reads a JSON string.'],
    ['bs-1','Bootstrap','Which Bootstrap class creates a responsive fixed-width container?',['.container','.row','.card','.btn'],0,'The container class sets responsive maximum widths and horizontal padding for page content.'],
    ['bs-2','Bootstrap','How many columns are in the standard Bootstrap grid?',['8','10','12','16'],2,'Bootstrap uses a 12-column grid. For example, col-md-6 occupies half a row at medium widths and above.'],
    ['bs-3','Bootstrap','Which Bootstrap class styles a primary button?',['.button-blue','.btn-main','.primary-button','.btn-primary'],3,'Use btn and btn-primary together to apply Bootstrap base button styles and its primary variant.'],
    ['bs-4','Bootstrap','What does the Bootstrap class col-md-6 do?',['Uses 6 columns on every device','Uses 6 of 12 columns at medium widths and above','Creates six rows','Hides a column on medium screens'],1,'col-md-6 uses half the 12-column grid from the medium breakpoint upward. Smaller screens use other applicable rules.'],
    ['bs-5','Bootstrap','Which Bootstrap class allows an image to scale within its parent?',['.img-fluid','.img-fixed','.image-responsive','.fluid-image'],0,'img-fluid applies max-width: 100% and height: auto, allowing images to shrink inside their parent.'],
    ['bs-6','Bootstrap','Which Bootstrap utility hides an element at every breakpoint?',['.visible-none','.hide-all','.d-none','.display-hidden'],2,'d-none applies display: none. Responsive display utilities can change visibility at specific breakpoints.']
  ].map(function (item) {
    return {id:item[0],category:item[1],question:item[2],options:item[3].map(function(text,index){return {id:String(index),text:text};}),correctId:String(item[4]),explanation:item[5]};
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = questions;
  else root.QUESTION_BANK = questions;
})(typeof window !== 'undefined' ? window : globalThis);

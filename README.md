# jeopardy_game
<h1>Locally Hosted Jeopardy Game</h1>

<p>
  Ready to play some Jeopardy? Download this game now! The frontend is written in HTML, JavaScript, and CSS. The backend uses relies on Express.js. Express.js, used alongside the built in HTTP packages and Socket.io, is used to make a fully local game experience for the user. 
</p>

<h2>
  Features of the Game Include:
</h2>
<ul>
  <li>Custom Game Board Builder & Editor</li>
  <li>Host Site (Be like Alex Trebek or Ken Jennings!)</li>
  <li>Indiviudal Team Clickers (COMING SOON!)</li>
  <li>QR Code Integration</li>
</ul>

<h2>Local Endpoints:</h2>
<ul>
  <li>
    <h3>/host</h3>
    <p>Navigate to this page to enter your unique game code to act as the host. Choose which teams earn or lose points. Pre-screen the questions along with answers</p>
  </li>
    <li>
    <h3>/makegame</h3>
    <p>Navigate over to this page to build your own custom gameboard. You can designate categories, questions, and answers. Best part is that you can save your progress for future editing.</p>
  </li>
    </li>
    <li>
    <h3>/clicker *COMING SOON*</h3>
    <p>Scan your QR code or navigate to this page to use your device as a clicker! The big button will ring you in to answer the question! You gotta be quick!</p>
  </li>
</ul>
<h2>Why?</h2>
<p>
  I built this game simply for fun back in high school. It actually was meant as a tool for a trivia night for my Boy Scout troop, but it never made it to its intended use. That's ok though because I built the app out and added some sweet features that I came up with during the development process. More important, it was a lot of fun to build!
</p>
<h2>Technical</h2>
<p>
  The server creates a localhost server on a specificed port. The client-side application talks to the server via Socket.io sockets. Sockets are used to transfer key data to the server to make sure the game runs smoothly. Express.js is used alongside the built in HTTP libraries to give the server its functionality. Express in this case is really just used for smooth routing. I also liked how Express operates so I chose to continue to use it. 

  The client-side app is designed using CSS. I used just CSS to practice responsive layout techniques that don't require the use of a library. Eventually I would like to update the design to make it more appealing using something like Bootstrap or React. On the client-side server aspect, 
</p>


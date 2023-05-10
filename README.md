# BubbleTalk
This is bubbletalk, a chat app using React, Express, and MySQL. 

# Clientside
In the client folder, ssl certificates are required for https and session functionality. Generate your own using mkcert. 
Client is organized by pages for each app.

API requests in Utils folder.

AuthWrapper- wrapps each page, passes in username, loggedinstatus, and screenwidth

Login/Register-render login-register-form component. passes in login and register functions. also contains input validation clientside

Profile- contains profile picture and about me bio, changing them makes an api call to server

Chatpage- contains several components, including Chatbox,ChatSiebar, ChatUserList, Popups for joining/ creating rooms,and roominfo

Chatpage uses a messageList object to hold all messages received. structured with roomLink as key, and value of arrays of messages.
Chatpage makes api request to get all rooms associated w/ user, adds them array roomsEntered. useeffect listens to socket events, adds messages
to messageList as they come. other events such as disconnects, leaving the room, joining, etc are handled by events emitted.

# Serverside
In the server folder, ssl certificates are required for https and session functionality. Generate your own using mkcert. 

server.js handles cors, passes in fs, dbexports to be passed into routes, mysql store, multer,etc

aws.js: functions for uploading profile pictures to aws s3 bucket

db.js: functions for user data, db queries, room validation, room joining, etc

inputValidation.js:checks if login info is valid, register inputs are valid, valid profiles, roomlinks, etc

routes.js:all api routes, logging in, registering, session checking, bio, room join requests, etc,

socket.js: handles socket io connections to client, emits events such as entering/leaving rooms, sending online/offline users, messages, dms,etc.


const {google} = require('googleapis');

// provide credentials
const emailAddress = 'leader1@irous.net';
const JWT = google.auth.JWT;
const authClient = new JWT({
	keyFile: 'service_account.json',	// service account with domain-wide permission.
	scopes: ['https://mail.google.com/'],
	subject: emailAddress // google admin email address to impersonate
});


// https://stackoverflow.com/questions/34546142/gmail-api-for-sending-mails-in-node-js
function makeBody(to, from, subject, message) {
    var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail;
}

let processedMessages = [];

function checkNewMessages(auth) {
	const gmail = google.gmail({version: 'v1', auth});

	// list all INBOX messages
	 gmail.users.messages.list({
	    userId: 'me',
	    labelIds: ['INBOX']
	  }, (err, res) => {

	    if (err) return console.log('The API returned an error: ' + err);

	    // console.log(res);

	    // for first time, just mark all as processed.
	    if(processedMessages.length == 0) {
	    	for(let i = 0; i < res.data.resultSizeEstimate; i++){
	    		processedMessages.push(res.data.messages[i].id);
	    	}
	    	return;
	    }

	    // later time
	    for(let i = 0; i < res.data.resultSizeEstimate; i++){
	    	    

	    	    // if this is new message
	    	    if(processedMessages.includes(res.data.messages[i].id) == false) {

	    	    	console.log(res.data.messages[i]);

	    	    	// get message content
	    	    	gmail.users.messages.get({
				    	userId: 'me',
				    	id: res.data.messages[i].id
					    }, (err2, res2)=>{
					    	if (err2) return console.log('The API returned an error2: ' + err2);

					    	// loop and print headers
							for(let k = 0; k < res2.data.payload.headers.length; k++){
								let headerItem = res2.data.payload.headers[k];
								if(headerItem.name == 'From') {
									console.log('from: ', headerItem.value);

									// auto response if from 1753102@student.hcmus.edu.vn
									const regex = new RegExp('.+ <1753102@student.hcmus.edu.vn>');
									console.log(regex.test(headerItem.value));

									if(regex.test(headerItem.value) == true) {

										// make raw email html
										var raw = makeBody(
											headerItem.value, 
											emailAddress, 
											'auto reply from irous.net', 
											'this is auto reply. you are lucky to receive this.');

										// send
										gmail.users.messages.send({

											userId: 'me',
											requestBody: {
												raw: raw
											}
										}, (err3, res3)=>{
											if (err3) return console.log('The API returned an error3: ' + err3);
											console.log("ok to send auto reply");
										});

									}

								}
								if(headerItem.name == 'To') {
									console.log('to: ', headerItem.value);
								}
							}

					    });			

	    	    	// mark as processed
	    	    	processedMessages.push(res.data.messages[i].id);

	    	    }

	    	    
	    }
	    

	  });
}

function checkNewMessagesInterval(auth) {
	console.log("checking new messages...");

	checkNewMessages(auth);

	setTimeout(()=>{ checkNewMessagesInterval(auth); }, 5000);
}


function main() {

	checkNewMessagesInterval(authClient);
}

main();
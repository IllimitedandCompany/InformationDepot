// Protect routes from 'dirty' inputs by initializing the variable(E.g. req.body.email) as a call to a function that would remove all characters that could be used to exploit the server/script.
// E.g: let email = cleanInput(req.body.email)
function cleanInput(data){
	console.log(data)
	var clean = data.replace(/[^A-Za-z0-9]/g, ' ');
	return clean
}

// Also, you could add a check for eval, which would run functions send in for example a 'dirty' input.
if(email.includes('eval')){
	return res.status(400).json({ error : "Misbehaviour found.. bla bla do this do that =) "})
}

// Proper terminology can be obtained with chatGPT or thorough research, it is what it is 8D
// - T.
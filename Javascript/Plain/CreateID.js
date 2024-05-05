// Alphanumeric Id Creation

function createId(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	counter += 1;
	}
	return result;
}

// Called with length, E.G. let id = createId(5) will create Id with 5 characters.
// For more complex operations, I recommend 'crypto' nodeJs module.
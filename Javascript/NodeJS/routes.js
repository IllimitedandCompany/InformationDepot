// Routes are the servers access points.. 

// Get Routes:
// Synchronous Route(Does not wait for promises to load data)
app.get('/LinkToAccess', function(req, res){ // Remember, this goes next to the url of server, that being localhost:port for local or domain/endpoint of app/server.

    // Renders (Directory Example for pages: Server/project/html/...)
    res.render('pages/pageToLoad') // Page does not need .extension identifier
    // OR
    // Returns (In Case you want to send response to client.) E.G. below.
    return res.status(200).json({ success : message }) // Check HTML statuses for best practices(200 success, 400 error)
    // JSON sent can be as per required.
    // OR
    res.redirect('/pageNameOnYourDirectory')
})

// Asynchronous Route (Awaits processing of functions to load results)
app.get('/LinkToAccess', async(req, res) =>{ // Remember, this goes next to the url of server, that being localhost:port for local or domain/endpoint of app/server.
    // Would be used with "await " : E.G. let result = await functionName() 
})

// Post Routes: (Complexity Increase in Asynchronous POST Route)
// Synchronous
app.post('/endpoint', function(req, res){
    
})

// Asynchronous
app.post('/endpoint/:example/:example1?', async(req, res) =>{ // Endpoint Parameters: ..Are sent on the link(endpoint used) as: .../:parameter1/:parameter2/... for a optional parameter: .../:parameter1?
    // Call parameters using: req.params.parameterName; Example here: let example = req.params.example;

})

// For now stays as is, evetually I will add all 'req' that I have been through.

// Examples used with: (as per my base)
app.use(express.static(__dirname)); // Serve static files from the server's directory structure.
app.use(express.json()); // Parse JSON bodies in incoming requests.
app.use(bodyParser.urlencoded({extended: false})); // Parse URL-encoded bodies in incoming requests with extended mode disabled.
app.set("views",__dirname + '/html'); // Set the directory for views to the 'html' subdirectory of the server's directory.
app.set('view engine', 'ejs'); // Set the view engine to EJS (Embedded JavaScript).
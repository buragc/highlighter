/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
const path = require('path');
const os   = require('os');
const fs   = require('fs');
const Busboy = require('busboy');

exports.process = (req, res) => {
    if (req.method === 'POST') {
	// Everything is okay.
	//const {sender, recipient, subject} = req.body;    
	//const debugLog = `Sender: ${sender}, subject: ${subject}`;
	// Now process the files in the request:
        let debugLog = "";
        const busboy = new Busboy({ headers: req.headers });
        const uploads = { };
        const tmpdir  = os.tmpdir();
        const payload = { };

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
	    console.log(`Processing file ${filename}`);
            if ( filename.includes("csv") ) {
		    const filepath = path.join(tmpdir, filename);
		    uploads[fieldname] = filepath;
		    file.pipe(fs.createWriteStream(filepath));
            } 
        });

        busboy.on('field', (fieldname, val, valTruncated) => { 
	    payload[fieldname] = val;
	});
         
        busboy.on('finish', () => { 
            for (const name in uploads) { 
		const file = uploads[name];
		console.log(`Processing file ${name}`);		
                fs.unlinkSync(file);
		debugLog += `\n${name}\n`;
            }
            
            //debugLog += JSON.stringify(payload);
	    console.log(debugLog);
	    // At this time we have the file, process the content...
	    res.end();
            //res.status(200).send(debugLog);
        });

        busboy.end(req.rawBody);

	// todo : Process the incoming CSV only.
	// console.log(debugLog);
	// If the processed file is GOOD bulk-insert the items into MongoDB
        // res.status(200).send(debugLog); 
    }
    else {
        res.status(500).send('Unsupported method');
    }
};


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
    let allData = "";
    if (req.method === 'POST') {
        const busboy = new Busboy({ headers: req.headers });
        // This object will accumulate all the uploaded files, keyed by their name.
        const uploads = {}
        const tmpdir = os.tmpdir();
	let dataChunks = [ ];
        // This callback will be invoked for each file uploaded.
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
	    if ( filename.indexOf('.csv') > 0) {
		    console.log("Got a CSV!");
		    // Note that os.tmpdir() is an in-memory file system, so should
		    // only be used for files small enough to fit in memory.
		    const filepath = path.join(tmpdir, filename);
		    uploads[fieldname] = filepath;

		    file.on('data', function(data) { 
			
			console.log(`Data chunk is ${data});;
			dataChunks.push(data);
		     });

		    file.on('end', function( ) {
			//console.log(Buffer.concat(dataChunks));
			allData = Buffer.concat(dataChunks).toString();
			console.log(`All data is ${allData}`);	 
		    });

		    let writer = fs.createWriteStream(filepath);
		    file.pipe(writer);


	    } else {
	    	file.resume( );
	    }
        });

        // This callback will be invoked after all uploaded files are saved.
        busboy.on('finish', () => {
            for (const name in uploads) {
                const file = uploads[name];
		fs.unlinkSync(file);
            }
            
	    //console.log(allData);
	    const csvRows = allData.split('\n');
            //console.log(JSON.stringify(csvData.split('\r\n')));
            for (const row in csvRows) {
                console.log(JSON.stringify(row));
		console.log(row);
	    }
            res.end();
        });

        // The raw bytes of the upload will be in req.rawBody. Send it to
        // busboy, and get a callback when it's finished.
        busboy.end(req.rawBody);
    } else {
        // Client error - only support POST.
        res.status(405).end();
    }

};


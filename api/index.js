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
const parse  = require('csv-parse');

exports.process = (req, res) => {
    if (req.method === 'POST') {
        const busboy = new Busboy({ headers: req.headers });
        const tmpdir  = os.tmpdir();
        let debugLog = "";
        let uploads = { };
        let payload = { };
	let csvRows = [ ];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
	    if ( filename.indexOf('.csv') > 0) {
		   console.log(`Processing file ${filename}`);
		   file.on('data', function (data) {
			console.log(`File data is ${data}`);
		    }
               }
	    }
	    //const filepath = path.join(tmpdir, filename);
	    //uploads[fieldname] = filepath;
	    //file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on('field', (fieldname, val, valTruncated) => { 
	    payload[fieldname] = val;
	});
         
        busboy.on('finish', () => { 
            /*for (const name in uploads) { 
		const file = uploads[name];
		console.log(`File contents are ${file}`);
		console.log(`Processing file ${name}`);		
                fs.unlinkSync(file);
            }*/
	    console.log(`Running finish`);
            console.log(JSON.stringify(csvRows));
	    console.log(`Done processing files`);
	    res.end();
        });

        busboy.end(req.rawBody);
    }
    else {
        res.status(500).send('Unsupported method');
    }
};


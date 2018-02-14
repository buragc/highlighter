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
        const busboy = new Busboy({ headers: req.headers });
        const tmpdir  = os.tmpdir();
        let debugLog = "";
        let uploads = { };
        let payload = { };

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
	    console.log(`Processing file ${filename}`);
	    const filepath = path.join(tmpdir, filename);
	    uploads[fieldname] = filepath;
	    file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on('field', (fieldname, val, valTruncated) => { 
	    payload[fieldname] = val;
	});
         
        busboy.on('finish', () => { 
            for (const name in uploads) { 
		const file = uploads[name];
		console.log(`Processing file ${name}`);		
                fs.unlinkSync(file);
            }
	    console.log(`Done processing files`);
	    res.end();
        });

        busboy.end(req.rawBody);
    }
    else {
        res.status(500).send('Unsupported method');
    }
};


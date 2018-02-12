/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.process = (req, res) => {

    // Everything is okay.
    const {sender, recipient, subject} = req.body;    
    const debugLog = `Sender: ${sender}, subject: ${subject}`;
    // Now process the files in the request:
    // TODO : Process the incoming CSV only.


    // If the processed file is GOOD bulk-insert the items into MongoDB
    res.status(200).send(debugLog); 

  }
};

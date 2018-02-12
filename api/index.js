/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.process = (req, res) => {
  // Example input: {"message": "Hello!"}
  if (req.body.message === undefined) {
    // This is an error case, as "message" is required.
    
    res.status(400).send('No message defined!');
  } else {
    // Everything is okay.
    const {sender, recipient, subject} = req.body;
    
    console.log(`Sender: ${sender}, subject: ${subject}`);
    res.status(200).send('Success: ' + req.body.message);
  }
};

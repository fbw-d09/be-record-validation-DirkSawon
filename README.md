## Validation and Sanitization

In this task we will introduce data validation. How we will know that the format of the email the user inserted is valid? Using `express-validator` we will validate our data before we save them in our database. If something is not valid, we will return a detailed error message to the user. After validation, we will sanitize our data using `express-validator`. Validation is about making sure our data are in the right format. Sanitzation though is all about making sure the data are also noise-free. No extra spaces, no uppercase mixed with lowercase, normalized emails etc.

**TODO**

1. Install `express-validator`.
2. Validate data for the user schema.
3. After validation of the data, please sanitize them as well.
4. In the end, please create a custom validation middleware boilerplate and bring all your validators there.

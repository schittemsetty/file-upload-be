module.exports = {
    responseObject: function(code, body, err) {
      this.code = code;
      this.body = body;
      this.error = err;
  
      this.getResObject = function() {
        if (this.error) {
          return {
            code: this.code,
            body: this.body,
            error: this.error
          };
        } else {
          return {
            code: this.code,
            body: this.body
          };
        }
      };
    }
  };
  
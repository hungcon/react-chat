var constraints = {
    email: {
      presence: {
        "allowEmpty": false
      },
      email: true
    },
    password: {
        presence: {
            "allowEmpty": false
        },
      length: {
        minimum: 6,
        maximum: 15,
        message: "must be at least 6 characters and less than 15 characters"
      }
    }
  };

export default constraints;
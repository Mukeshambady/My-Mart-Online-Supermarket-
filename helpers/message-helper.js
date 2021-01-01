const { resolve, reject } = require("promise")

module.exports = {
    otpVarification:  function () {
        return new Promise(async(resolve, reject) => {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': 'https://http-api.d7networks.com/send?username=vqkr6926&password=ToNwG5ZL&dlr-method=POST&dlr-url=https://4ba60af1.ngrok.io/receive&dlr=yes&dlr-level=3&from=smsinfo&content=This is the sample content sent to test &to=9744762630',
                'headers': {
                },
                formData: {

                }
            };
         await   request(options, function (error, response,body) {
                if (error) throw new Error(error);
                console.log('body-----------',body);
                console.log('---------------------response--body',response.body);
                resolve(response.body)
            });
        })
    }
}
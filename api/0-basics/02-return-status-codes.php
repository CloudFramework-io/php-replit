<?php
/**
* By default the API returns a 200 status code. Here you can see some examples to return
* differentes status codes and codes. About Status codes you can visit: 
*     https://restfulapi.net/http-status-codes/
* Try the API end-point
*    https://php.cloudframework.repl.co/0-basics/02-return-status-codes/200
*    https://php.cloudframework.repl.co/0-basics/02-return-status-codes/201
*    https://php.cloudframework.repl.co/0-basics/02-return-status-codes/400
*    https://php.cloudframework.repl.co/0-basics/02-return-status-codes/404
*/
class API extends RESTful
{
    function main()
    {

        //Let's use the url param $this->params[1] to responde a specific code
        $return_status_code = intval($this->params[1]??200);

        // Let's control some return status codes
        switch($return_status_code) {
          case 200:
              // Default code returned
              // code = 'ok'
              return;
          case 201:
              $this->ok = 201;
              // code = 'ok'
              return;
          case 204:
              $this->ok = 204;  // no content
              // code = 'ok'
              return;

          // Let's control a Bad Request
          case 400:
              return($this->setError('Error 400 Bad Request',400));

          // Let's control a not-found code
          case 404:
              return($this->setError('Error 404 not found',404,'not-found','try with other value'));

          // Let's control a server error code
          case 500:
              return($this->setError('Error 500 internal server error',500,'internal-server-error','Service is not available'));
          
          // return de default error if the paramaeter is not supported
          default:
             return($this->setError('['.$this->params[1].'] status code is not supported'));
          
        }

       
    }
}
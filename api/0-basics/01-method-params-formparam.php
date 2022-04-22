<?php
/**
* Receiving params, formParams in the calls [GET,POST,PUT] the API receives 
* https://replit.com/@cloudframework/php#api/0-basics/01-method-params-formparam
*/
class API extends RESTful
{
    function main()
    {

        // You can control the method (GET, POST, PUT, ..) used to call your API with 
        //     (string)$this->method
        // You can also control also the different param received in the URL
        //     (array)$this->params
        // You can also control also the different formPrams received in the call
        // In PHP the native variables are $_GET, $_POST, $_REQUEST. We offer a simplier var
        //     (array)$this->formParams
        $data = [
          'method'=>$this->method,
          'params'=>$this->params,
          'formParams'=>$this->formParams
        ];
        $this->addReturnData($data);
        // Now you can try to call 
        //     https://php.cloudframework.repl.co/0-basics/01-method-params-formparams
        // sending GET formParams, POST, etc.. and add in the url more params:
        //     https:/.../0-basics/01-method-params-formparams/param-a/param-b
       
    }
}
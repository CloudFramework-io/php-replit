<?php
/**
* Receiving params, formParams in the calls [GET,POST,PUT] the API receives 
* https://replit.com/@cloudframework/php#api/00-basics/01-method-params-formparams-headers
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
            'formParams'=>$this->formParams,
            'headers'=>$this->getHeaders(),
            'param-0'=>(isset($this->params[0]))?$this->params[0]:null,
            'param-1'=>$this->getUrlPathParamater(1),
            'param-2'=>$this->getUrlPathParamater(2),
            'param-3'=>isset($this->params[3]),
            'var1'=>(isset($this->formParams[0]))?$this->params[0]:null,
            'var2'=>$this->getFormParamater('var2'),
            'var3'=>isset($this->formParams[3]),
        ];
        $this->addReturnData($data);
        // Now you can try to call 
        //     https://php.cloudframework.repl.co/0-basics/01-method-params-formparams
        // sending GET formParams, POST, etc.. and add in the url more params:
        //     https:/.../0-basics/01-method-params-formparams/param-a/param-b
       
    }
}
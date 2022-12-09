<?php
/**
* You can control if you receive a right method, param of formParam and returning
* a default error if not
* Try the API end-point
*    https://php.cloudframework.repl.co/00-basics/05-config-vars

*/
class API extends RESTful
{
    function main()
    {

        // return a 405 status code if the call is not GET or POST
        if(!$this->checkMethod('GET,POST')) return;

        // return a 400 if the parameter 1 does not exist or it is emppty 
        // In the URL https://php.cloudframework.repl.co/0-basics/04-check-methods
        // the value of parameter 0 will be '04-check-methods'
        if(!$my_param = $this->checkMandatoryParam(0)) return;
        // also you can get the value of the formParam using: $my_param = $this->getUrlPathParamater(0);


        // return a 400 if we do not receive a formParams with the name 'var1'
        // try calling the API with ?var1=value1 to avoid the error
        if(!$my_var1 = $this->checkMandatoryFormParam('var1')) return;
        // also you can get the value of the formParam using: $my_var1 = $this->getFormParamater('var1');

        // return a 400 if we do not receive a formParams with the names 'var1' and 'var2'
        // try calling the API with ?var1=value1&var2=value to avoid the error
        if(!$this->checkMandatoryFormParams(['var1','var2'])) return;
        $my_var1 = $this->getFormParamater('var1');
        $my_var2 = $this->getFormParamater('var2');

       
    }
}
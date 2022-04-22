<?php
/**
* You can organize a library or error codes to be responded
* Try the API end-point
*    https://php.cloudframework.repl.co/0-basics/03-set-error-from-code-lib
*/
class API extends RESTful
{
    function main()
    {

        // There is a specific method to return error taking a library of default errors
        $this->setErrorFromCodeLib('params-error');

        // to return this error you have to define previously a code in the lib
        // by default are loaded the following codes:
        // $this->addCodeLib('form-params-error','Wrong form paramaters.',400);
        // $this->addCodeLib('params-error','Wrong parameters.',400);
        // $this->addCodeLib('security-error','You don\'t have right credentials.',401);
        // $this->addCodeLib('not-allowed','You are not allowed.',403);
        // $this->addCodeLib('not-found','Not Found',404);
        // $this->addCodeLib('method-error','Wrong method.',405);
        // $this->addCodeLib('conflict','There are conflicts.',409);
        // $this->addCodeLib('gone','The resource is not longer available.',410);
        // $this->addCodeLib('unsupported-media','Unsupported Media Type.',415);
        // $this->addCodeLib('server-error', 'Generic server error',500);
        // $this->addCodeLib('not-implemented', 'There is something in the server not implemented yet',501);
        // $this->addCodeLib('service-unavailable','The service is unavailable.',503);
        // $this->addCodeLib('system-error','There is a problem in the platform.',503);
        // $this->addCodeLib('datastore-error','There is a problem with the DataStore.',503);
        // $this->addCodeLib('db-error','There is a problem in the DataBase.',503);

        // You can add your own codes in the lib
        // $this->addCodeLib('my-error-code','Description of the error',{status-code-to-be-returned});
       
    }
}
<?php
/**
* Super basic structure for your first API.
*     https://php.cloudframework.repl.co/00-basics/00-hello
*/
class API extends RESTful
{
    function main()
    {
        // With this structure you have accesible $this-> to create your APIs
        // $this is a RESTfull class and it includes variables, methods and objects
        // very usefull to create your APIs
        // Your first method will be $this->addReturnData
        $data = 'hello World';
        $this->addReturnData($data);
        //It will return a basic JSON structure with this format
        /**
            {
              "success": true,
              "status": 200,
              "code": "ok",
              "time_zone": "UTC",
              "data": "hello World",
              "logs": "only restful.logs.allowed_ips. Current ip: XX.XX.XX.XX"
            }
          */
         // $data can be a string, number or array and the content will be returned
         // under node "data"
    }
}
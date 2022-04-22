<?php
/**
* Super basic structure
*/
class API extends RESTful
{
    function main()
    {
        // With this structure you have accesible:
        // $this->core [All core methods ]
        // The basic return data for your API
        $this->addReturnData('hello World');
    }
}
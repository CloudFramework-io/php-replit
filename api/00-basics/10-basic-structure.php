<?php
/**
 * Basic structure for a CloudFramework API
 * We recomment to use the following structure to build your API. Try this URLs:
 *     https://php.cloudframework.repl.co/00-basics/10-basic-structure
 *     https://php.cloudframework.repl.co/00-basics/10-basic-structure/default
 *     https://php.cloudframework.repl.co/00-basics/10-basic-structure/hello
 */
class API extends RESTful
{
    var $end_point= '';
    function main()
    {
        //You can restrict methods in main level
        if(!$this->checkMethod('GET,POST,PUT,DELETE')) return;

        //Call internal ENDPOINT_$end_point
        $this->end_point = str_replace('-','_',($this->params[1] ?? 'default'));
        if(!$this->useFunction('ENDPOINT_'.str_replace('-','_',$this->end_point))) {
            return($this->setErrorFromCodelib('params-error',"/{$this->service}/{$this->end_point} is not implemented"));
        }
    }

    /**
     * Endpoint to add a default feature. We suggest to use this endpoint to explain 
     * how to use other endpoints
     */
    public function ENDPOINT_default()
    {
        // return Data in json format by default
        $this->addReturnData(
          [
             "end-point /default [current]"=>"use /{$this->service}/default"
            ,"end-point /hello"=>"use /{$this->service}/hello"
          ]);
    }

    /**
     * Endpoint to show Hello World message
     */
    public function ENDPOINT_hello()
    {
        switch($this->method) {
          case "GET":
              $this->addReturnData('The call is GET. Hello world');
              break;
          default:
              $this->addReturnData('The Call is not GET. The call is GET. Hello world. Hello world');
              break;
        }
    }
}
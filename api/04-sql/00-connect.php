<?php
/**
 * User $this->core->user object to authentication
 * We recomment to use the following structure to build your API. Try this URLs:
 *     https://php.cloudframework.repl.co/04-sql/00-connect
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
            ,"end-point /test"=>"use /{$this->service}/test"
          ]);
    }

    /**
     * Endpoint to show Hello World message
     */
    public function ENDPOINT_test()
    {
        //region CHECK method and mandatory params
        if(!$this->checkMethod('POST')) return;
        //endregion

        //region FEED $config with mandatory params
        $config = [];
        if(!$config['dbServer'] = $this->checkMandatoryFormParam('dbServer')) return;
        if(!$config['dbUser'] = $this->checkMandatoryFormParam('dbUser')) return;
        if(!$config['dbPassword'] = $this->checkMandatoryFormParam('dbPassword')) return;
        if(!$config['dbName'] = $this->checkMandatoryFormParam('dbName')) return;
        //endregion

        //region FEED $config with optional params
        $config['dbSocket'] = $this->getFormParamater('dbSocket')?:null;
        $config['dbProxy'] = $this->getFormParamater('dbProxy')?:null;
        $config['dbProxyHeaders'] = $this->getFormParamater('dbProxyHeaders')?:null;
        $config['dbCharset'] = $this->getFormParamater('dbCharset')?:null;
        $config['dbPort'] = $this->getFormParamater('dbPort')?:null;
        //endregion

        //region SET $this->core->config->processConfigData($config);
        $this->core->config->processConfigData($config);
        //endregion

        //region CREAT $sql CloudSQL object.
        /** @var CloudSQL $sql */
        $sql = $this->core->loadClass('CloudSQL');
        if($sql->error()) return $this->setErrorFromCodelib('system-error',$sql->getError());
        //endregion

        //region CONNECT and execute SET $query_result with the result of the query: SELECT count(*) from test
        if(!$sql->connect()) return $this->setErrorFromCodelib('system-error',$sql->getError());
        $query_result = $sql->getDataFromQuery('SELECT count(*) from test');
        if($sql->error()) return $this->setErrorFromCodelib('system-error',$sql->getError());
        //endregion

        //region RETURN result
        $this->addReturnData(['SELECT count(*) from test'=>$query_result]);
        //endregion

    }
}
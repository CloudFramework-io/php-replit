<?php
/**
 * User $this->core->user object to authentication
 * We recommend to use the following structure to build your API. Try this URLs:
 *     https://php.cloudframework.repl.co/03-datastore/00-connect
 */
class API extends RESTful
{
    private $end_point= '';

    /**
     * main END-POINT Redirector /03-datastore/00-connect/<end-point>
     */
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
     * /default END-POINT to add a default feature. We suggest to use this endpoint to explain
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
     * /test END-POINT to show how to connect with a Datastore
     */
    public function ENDPOINT_test()
    {
        
        //region SET (DataStore)$datastore from $params['entity_name'=>'Countries']
        $params = [
            'entity_name'=>'Countries',
            'namespace'=>'academy',
            'schema'=>[
                'KeyName' => ['keyname', 'index'],
                'Title'=> ['string','index']
            ],
            'options'=>[
                'projectId'=>'cloudframework-academy',
                'transport'=>'rest',
                'keyFile'=>null
            ]
        ];
        /** @var DataStore $datastore */
        $datastore = $this->core->loadClass('DataStore',$params);
        if($datastore->error) return $this->setErrorFromCodelib('system-error',$datastore->errorMsg);
        //endregion

        //region QUERY $countries from $datastore
        $datastore->limit = 500; //By defult limit is 200
        $countries = $datastore->fetchAll();
        if($datastore->error) return $this->setErrorFromCodelib('system-error',$datastore->errorMsg);
        //endregion

        //region RETURN ['numrows'=>count($countries),'countries'=>$countries]
        return $this->addReturnData(['numrows'=>count($countries),'countries'=>$countries]);
        //endregion

    }

    /**
     * Endpoint to show Hello World message
     */
    public function ENDPOINT_fetch()
    {
        //region SET DB Connection
        if(!$this->assignEnvDBVariables()) return;
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

    /**
     * Assign DB environment variables as secrets to connect with Database
     * There are different ways
     */
    private function assignEnvDBVariables() {
        //region FEED $config with mandatory params
        $config = [];
        if(!$config['dbServer'] = $this->core->config->getEnvVar('ACADEMY_DB_SERVER')) return $this->setErrorFromCodelib('system-error','MISSING ACADEMY_DB_NAME env-var');
        if(!$config['dbUser'] = $this->core->config->getEnvVar('ACADEMY_DB_USER')) return $this->setErrorFromCodelib('system-error','MISSING ACADEMY_DB_USER env-var');
        if(!$config['dbPassword'] = $this->core->config->getEnvVar('ACADEMY_DB_PASSWORD')) return $this->setErrorFromCodelib('system-error','MISSING dbPassword env-var');
        if(!$config['dbName'] = $this->core->config->getEnvVar('ACADEMY_DB_NAME')) return $this->setErrorFromCodelib('system-error','MISSING ACADEMY_DB_NAME env-var');
        //endregion

        //region SET $this->core->config->processConfigData($config);
        $this->core->config->processConfigData($config);
        //endregion

        return true;
    }
}
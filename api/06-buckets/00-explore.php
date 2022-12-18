<?php
/**
 * User$this->core->user object to authentication
 * We recommend to use the following structure to build your API. Try this URLs:
 *     https://php.cloudframework.repl.co/06-datastore/00-files
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
    public function ENDPOINT_buckets()
    {

        //region SET $bucket_name from mandatory params[2]: "gs://{params[2]}"
        if(!$bucket_name = $this->checkMandatoryParam(2,'Missing 00/explore/:bucketName')) return;
        $bucket_name = "gs://{$bucket_name}";
        //endregion

        //region SET (Buckets)$bucket taking "gs://{$bucket_name}" and check if the bucket is accesible or exist
        /** @var Buckets $bucket */
        $bucket = $this->core->loadClass('Buckets',"{$bucket_name}");
        if($bucket->error) return $this->setErrorFromCodelib('system-error',$bucket->errorMsg);
        //endregion

        //region return bucket info
        $this->addReturnData(['bucket_name'=>$bucket_name,'bucket_info'=>$bucket->getInfo()]);
        //endregion
      
    }

}
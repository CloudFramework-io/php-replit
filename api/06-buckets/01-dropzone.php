<?php
/**
 * https://php.cloudframework.repl.co/php-replit/docs/classes/Buckets.html
 */
class API extends RESTful
{
    private $end_point= '';
    /** @var Buckets $bucket */
    private $bucket = null;

    /**
     * Error codes for the end-point
     */
    function __codes()
    {
        $this->addCodeLib('bucket-not-found','The bucket is not found or it is not accessible', 404);
        $this->addCodeLib('bucket-can-not-assigned','There is a problem assigning the bucket', 503);
        $this->addCodeLib('bucket-wrong-name-format','The name of the bucket is not correct', 400);
        $this->addCodeLib('bucket-path-scandir-error','path does not exist or it is incorrect', 400);
    }

    /**
     * main END-POINT Redirector /03-datastore/00-connect/<end-point>
     */
    function main()
    {
        //You can restrict methods in main level
        if(!$this->checkMethod('GET,POST,PUT,DELETE')) return;

        //region SET $bucket_name from mandatory params[2]: "gs://{params[2]}"
        if(!$bucket_name = $this->checkMandatoryParam(1,'Missing ../01-dropzone/:bucketName')) return;
        $bucket_name = "gs://{$bucket_name}";
        //endregion

        //region SET (Buckets)$this->bucket 
        $this->bucket = $this->core->loadClass('Buckets',"{$bucket_name}");
        if($this->bucket->error) return $this->setErrorFromCodelib($this->bucket->errorCode,$this->bucket->errorMsg);
        //endregion
      
        //Call internal ENDPOINT_$end_point
        $this->end_point = str_replace('-','_',($this->params[2] ?? 'default'));
        if(!$this->useFunction('ENDPOINT_'.str_replace('-','_',$this->end_point))) {
            return($this->setErrorFromCodelib('params-error',"/{$this->service}/{$this->end_point} is not implemented"));
        }
    }

    /**
     * Handle files uploaded
     */
    public function ENDPOINT_uploads()
    {
      switch($this->method) {
        case 'GET':
            $this->addReturnData(
                $this->bucket->scan('/uploads')
            );
            break;
        case 'POST':
            $this->addReturnData(
                $this->bucket->upload(
                    $this->params[0],
                    $this->params[1],
                    $this->params[2]
                )
            );
            break;
      }
    }
  
}
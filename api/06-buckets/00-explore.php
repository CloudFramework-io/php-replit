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
        $this->bucket = $this->core->loadClass('Buckets',"{$bucket_name}");
        if($this->bucket->error) return $this->setErrorFromCodelib($this->bucket->errorCode,$this->bucket->errorMsg);
        //endregion

        if(!$this->getUrlPathParamater(3)) {
            return $this->basicBucketOperations();
        } elseif($this->getUrlPathParamater(3) =='uploads') {
            return $this->handleUploadedFiles();
        }elseif($this->getUrlPathParamater(3) =='upload-url') {
            return $this->uploadUrl();
        }else {
            return $this->setErrorFromCodelib('params-error','/'.$this->getUrlPathParamater(3).' is not supported');
        }
    }

    /**
     * Execute basic operation
     */
    private function basicBucketOperations() {

        $this->addReturnData([
            '$this->bucket_name'=>$this->bucket->bucket,
            '$this->bucket'=>' $this->core->loadClass(\'Buckets\',"{$this->bucket_name}")',
            '$this->bucket->version'=>$this->bucket->version,
            'GCP URL:'=>$this->bucket->getAdminUrl(),
            '$this->bucket->getInfo()'=>$this->bucket->getInfo(),
            '$this->bucket->mkdir(\'/tmp\')'=>$this->bucket->mkdir('/tmp'),
            '$this->bucket->fastscan(\'/tmp\')'=>$this->bucket->fastScan('/tmp'),
            '$this->bucket->putContents(\'example.txt\',\'Hello world\',\'/tmp\')'=>$this->bucket->putContents('example.txt','Hello world','/tmp'),
            '$this->bucket->getFileInfo(\'/tmp/example.txt\')'=>$this->bucket->getFileInfo('/tmp/example.txt'),
            '$this->bucket->setFilePrivate(\'/tmp/example.txt\')'=>$this->bucket->setFilePrivate('/tmp/example.txt'),
            '$this->bucket->setFilePublic(\'/tmp/example.txt\')'=>$this->bucket->setFilePublic('/tmp/example.txt'),
            '$this->bucket->getPublicUrl(\'/tmp/example.txt\')'=>$this->bucket->getPublicUrl('/tmp/example.txt'),
            '$this->bucket->scan(\'/tmp\')'=>$this->bucket->scan('/tmp'),
            '$this->bucket->putContents(\'example.txt\',\'Hello world\',\'/tmp\')'=>$this->bucket->getContents('example.txt','/tmp'),
            '$this->bucket->deleteFile(\'/tmp/example.txt\')'=>$this->bucket->deleteFile('/tmp/example.txt'),
            '$this->bucket->rmdir(\'/tmp\')'=>$this->bucket->rmdir('/tmp'),
            '$this->bucket->isDir(\'/uploads\')'=>$this->bucket->isDir('/uploads'),
            '$this->bucket->uploadFile(\'/uploads/image_to_upload.jpg\',__DIR__.\'/image_to_upload.jpg\',[\'public\'=>true])'=>$this->bucket->uploadFile('/uploads/image_to_upload.jpg',__DIR__.'/image_to_upload.jpg',['public'=>true]),
            '$this->bucket->uploadContents(\'/uploads/hello.txt\',\'Hello world\',[\'public\'=>true])'=>$this->bucket->uploadContents('/uploads/hello.txt','Hello World',['public'=>true]),

        ]);
        if($this->bucket->error) return $this->setErrorFromCodelib($this->bucket->errorCode,$this->bucket->errorMsg);

    }

    /**
     * Handle uploaded files
     */
    private function handleUploadedFiles() {
        
        //region VERIFY /uploads exist and we have received files
        if(!$this->bucket->isDir('/uploads')) if(!$this->bucket->mkdir('/uploads')) return $this->setErrorFromCodelib('system-error','/uploads can not be created');
        if(!$this->bucket->uploadedFiles) return $this->setErrorFromCodelib('params-error','no files received');
        //endregion

        //region SET $options for the uploaded files
        $options = [];
        if($this->getFormParamater('public')=='1') $options['public'] = true;
        if($this->getFormParamater('apply_hash_to_filenames')=='1') $options['apply_hash_to_filenames'] = true;
        if($allowed_extensions = $this->getFormParamater('allowed_extensions')) $options['allowed_extensions'] = $allowed_extensions;
        if($allowed_content_types = $this->getFormParamater('allowed_content_types')) $options['allowed_content_types'] = $allowed_content_types;
        //endregion

        //region EXECUTE $uploaded_files = $this->bucket->manageUploadFiles('/uploads',$options);
        $uploaded_files = $this->bucket->manageUploadFiles('/uploads',$options);
        if($this->bucket->error) return $this->setErrorFromCodelib($this->bucket->errorCode,$this->bucket->errorMsg);
        //endregion

        //region return ['options'=>,
         $this->addReturnData(['options'=>$options]);
         $this->addReturnData($uploaded_files);
    }



    /**
     * Example to upload files directly into a Bucket.
     * It requires in localhost to use a service account instead of an user credential
     */
    private function uploadUrl() {

        if($id = $this->getUrlPathParamater(4)) {
            if(!$filename = $this->checkMandatoryFormParam('filename')) return;
            if(strpos($filename,'/')!==false) return $this->setErrorFromCodelib('params-error','filename can not contains char [/]');
            if(strpos($filename,'"')!==false) return $this->setErrorFromCodelib('params-error','filename can not contains char ["]');
            if(strpos($filename,'\'')!==false) return $this->setErrorFromCodelib('params-error','filename can not contains char [\']');

            $mime_type = $this->getFormParamater('mime_type')?:$this->bucket->getMimeTypeFromExtension(pathinfo($filename, PATHINFO_EXTENSION));
            $options = ['filename'=>$filename,'contentType'=>$mime_type,'contentDisposition'=>'attachment; filename="'.$filename.'"','public'=>$this->getFormParamater('public')?true:false,'private'=>$this->getFormParamater('private')?true:false];
            $object_info =$this->bucket->updateFileObject('/uploads/video_file',$options);
            if($this->bucket->error) return $this->setErrorFromCodelib($this->bucket->errorCode,$this->bucket->errorMsg);
            return $this->addReturnData(
                [
                    'temporal_download_inline_url'=>$this->bucket->getSignedDownloadUrl($object_info['name'],1,['responseDisposition'=>'inline']),
                    'temporal_download_download_url'=>$this->bucket->getSignedDownloadUrl($object_info['name'],1,['responseDisposition'=>'attachment; filename="'.$filename.'"']),
                    'object'=>$object_info
                ]);
        } else {
            $id=uniqid('rnd');
            $this->addReturnData([
                'id'=>uniqid('rnd'),
                'url'=>$this->bucket->getSignedUploadUrl('/uploads/video_file')
            ]);
            if($this->bucket->error) return $this->setErrorFromCodelib($this->bucket->errorCode,$this->bucket->errorMsg);            
        }

    }

}


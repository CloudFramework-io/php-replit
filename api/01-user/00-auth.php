<?php
/**
 * User $this->core->user object to authentication
 * We recomment to use the following structure to build your API. Try this URLs:
 *     https://php.cloudframework.repl.co/01-user/00-auth
 */
class API extends RESTful
{
    var $end_point= '';
    function main()
    {
        //You can restrict methods in main level
        if(!$this->checkMethod('GET,POST,PUT,DELETE')) return;

        //region VERIFY if we have received a secret in header:X-WEB-KEY
        if($secret = $this->getHeader('X-WEB-KEY')) {
            if (!$this->checkSecret($secret)) return $this->setErrorFromCodelib('security-error', 'Wrong X-WEB-KEY credentials');
            $this->core->user->setAuth(true);
        } else {
            $this->core->user->setAuth(false);
        }
        //endregion

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
    public function ENDPOINT_signin()
    {

        //region CHECK method and SET $user,$password from  mandatory  formParams: user,password
        if(!$this->checkMethod('POST')) return;
        if(!$user = $this->checkMandatoryFormParam('user')) return;
        if(!$password = $this->checkMandatoryFormParam('password')) return;
        //endregion

        //region VERIFY $user and $password values. If they don't match return security error
        if($user != 'test_user') return $this->setErrorFromCodelib('security-error','user is incorret');
        if($password != 'this_password_is_a_secret') return $this->setErrorFromCodelib('security-error','password is incorrect');
        //endregion

        //region RETURN X-WEB-KEY based in a basic internal algorithm
        $this->addReturnData(['X-WEB-KEY'=>$this->generateSecret()]);
        $this->ok = 201;
        //endregion

    }

    /**
     * Endpoint to show Hello World message
     */
    public function ENDPOINT_check()
    {
        if(!$this->core->user->isAuth()) return $this->setErrorFromCodelib('params-error','This end-point requires header:X-WEB-KEY credentials');
        $this->addReturnData('User is authenticated');
    }

    /**
     *  Generate a secret with an invented and very basic algorithm
     */
    private function generateSecret() {

        $secret = 'ThisIsASecret-'.uniqid('rnd');
        return $secret;
    }

    /**
     *  Check if the secret match
     * @param string $secret
     * @return bool
     */
    private function checkSecret(string $secret) {
        return (strpos($secret,'ThisIsASecret-rnd')===0);
    }
}
<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/logging/v2/logging_config.proto

namespace Google\Cloud\Logging\V2;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * The parameters to `ListExclusions`.
 *
 * Generated from protobuf message <code>google.logging.v2.ListExclusionsRequest</code>
 */
class ListExclusionsRequest extends \Google\Protobuf\Internal\Message
{
    /**
     * Required. The parent resource whose exclusions are to be listed.
     *     "projects/[PROJECT_ID]"
     *     "organizations/[ORGANIZATION_ID]"
     *     "billingAccounts/[BILLING_ACCOUNT_ID]"
     *     "folders/[FOLDER_ID]"
     *
     * Generated from protobuf field <code>string parent = 1 [(.google.api.field_behavior) = REQUIRED, (.google.api.resource_reference) = {</code>
     */
    private $parent = '';
    /**
     * Optional. If present, then retrieve the next batch of results from the
     * preceding call to this method. `pageToken` must be the value of
     * `nextPageToken` from the previous response. The values of other method
     * parameters should be identical to those in the previous call.
     *
     * Generated from protobuf field <code>string page_token = 2 [(.google.api.field_behavior) = OPTIONAL];</code>
     */
    private $page_token = '';
    /**
     * Optional. The maximum number of results to return from this request.
     * Non-positive values are ignored. The presence of `nextPageToken` in the
     * response indicates that more results might be available.
     *
     * Generated from protobuf field <code>int32 page_size = 3 [(.google.api.field_behavior) = OPTIONAL];</code>
     */
    private $page_size = 0;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type string $parent
     *           Required. The parent resource whose exclusions are to be listed.
     *               "projects/[PROJECT_ID]"
     *               "organizations/[ORGANIZATION_ID]"
     *               "billingAccounts/[BILLING_ACCOUNT_ID]"
     *               "folders/[FOLDER_ID]"
     *     @type string $page_token
     *           Optional. If present, then retrieve the next batch of results from the
     *           preceding call to this method. `pageToken` must be the value of
     *           `nextPageToken` from the previous response. The values of other method
     *           parameters should be identical to those in the previous call.
     *     @type int $page_size
     *           Optional. The maximum number of results to return from this request.
     *           Non-positive values are ignored. The presence of `nextPageToken` in the
     *           response indicates that more results might be available.
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Google\Logging\V2\LoggingConfig::initOnce();
        parent::__construct($data);
    }

    /**
     * Required. The parent resource whose exclusions are to be listed.
     *     "projects/[PROJECT_ID]"
     *     "organizations/[ORGANIZATION_ID]"
     *     "billingAccounts/[BILLING_ACCOUNT_ID]"
     *     "folders/[FOLDER_ID]"
     *
     * Generated from protobuf field <code>string parent = 1 [(.google.api.field_behavior) = REQUIRED, (.google.api.resource_reference) = {</code>
     * @return string
     */
    public function getParent()
    {
        return $this->parent;
    }

    /**
     * Required. The parent resource whose exclusions are to be listed.
     *     "projects/[PROJECT_ID]"
     *     "organizations/[ORGANIZATION_ID]"
     *     "billingAccounts/[BILLING_ACCOUNT_ID]"
     *     "folders/[FOLDER_ID]"
     *
     * Generated from protobuf field <code>string parent = 1 [(.google.api.field_behavior) = REQUIRED, (.google.api.resource_reference) = {</code>
     * @param string $var
     * @return $this
     */
    public function setParent($var)
    {
        GPBUtil::checkString($var, True);
        $this->parent = $var;

        return $this;
    }

    /**
     * Optional. If present, then retrieve the next batch of results from the
     * preceding call to this method. `pageToken` must be the value of
     * `nextPageToken` from the previous response. The values of other method
     * parameters should be identical to those in the previous call.
     *
     * Generated from protobuf field <code>string page_token = 2 [(.google.api.field_behavior) = OPTIONAL];</code>
     * @return string
     */
    public function getPageToken()
    {
        return $this->page_token;
    }

    /**
     * Optional. If present, then retrieve the next batch of results from the
     * preceding call to this method. `pageToken` must be the value of
     * `nextPageToken` from the previous response. The values of other method
     * parameters should be identical to those in the previous call.
     *
     * Generated from protobuf field <code>string page_token = 2 [(.google.api.field_behavior) = OPTIONAL];</code>
     * @param string $var
     * @return $this
     */
    public function setPageToken($var)
    {
        GPBUtil::checkString($var, True);
        $this->page_token = $var;

        return $this;
    }

    /**
     * Optional. The maximum number of results to return from this request.
     * Non-positive values are ignored. The presence of `nextPageToken` in the
     * response indicates that more results might be available.
     *
     * Generated from protobuf field <code>int32 page_size = 3 [(.google.api.field_behavior) = OPTIONAL];</code>
     * @return int
     */
    public function getPageSize()
    {
        return $this->page_size;
    }

    /**
     * Optional. The maximum number of results to return from this request.
     * Non-positive values are ignored. The presence of `nextPageToken` in the
     * response indicates that more results might be available.
     *
     * Generated from protobuf field <code>int32 page_size = 3 [(.google.api.field_behavior) = OPTIONAL];</code>
     * @param int $var
     * @return $this
     */
    public function setPageSize($var)
    {
        GPBUtil::checkInt32($var);
        $this->page_size = $var;

        return $this;
    }

}


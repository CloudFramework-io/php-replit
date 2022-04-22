<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: google/datastore/v1/query.proto

namespace Google\Cloud\Datastore\V1;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * A query for entities.
 *
 * Generated from protobuf message <code>google.datastore.v1.Query</code>
 */
class Query extends \Google\Protobuf\Internal\Message
{
    /**
     * The projection to return. Defaults to returning all properties.
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.Projection projection = 2;</code>
     */
    private $projection;
    /**
     * The kinds to query (if empty, returns entities of all kinds).
     * Currently at most 1 kind may be specified.
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.KindExpression kind = 3;</code>
     */
    private $kind;
    /**
     * The filter to apply.
     *
     * Generated from protobuf field <code>.google.datastore.v1.Filter filter = 4;</code>
     */
    private $filter = null;
    /**
     * The order to apply to the query results (if empty, order is unspecified).
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.PropertyOrder order = 5;</code>
     */
    private $order;
    /**
     * The properties to make distinct. The query results will contain the first
     * result for each distinct combination of values for the given properties
     * (if empty, all results are returned).
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.PropertyReference distinct_on = 6;</code>
     */
    private $distinct_on;
    /**
     * A starting point for the query results. Query cursors are
     * returned in query result batches and
     * [can only be used to continue the same
     * query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *
     * Generated from protobuf field <code>bytes start_cursor = 7;</code>
     */
    private $start_cursor = '';
    /**
     * An ending point for the query results. Query cursors are
     * returned in query result batches and
     * [can only be used to limit the same
     * query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *
     * Generated from protobuf field <code>bytes end_cursor = 8;</code>
     */
    private $end_cursor = '';
    /**
     * The number of results to skip. Applies before limit, but after all other
     * constraints. Optional. Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>int32 offset = 10;</code>
     */
    private $offset = 0;
    /**
     * The maximum number of results to return. Applies after all other
     * constraints. Optional.
     * Unspecified is interpreted as no limit.
     * Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>.google.protobuf.Int32Value limit = 12;</code>
     */
    private $limit = null;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type \Google\Cloud\Datastore\V1\Projection[]|\Google\Protobuf\Internal\RepeatedField $projection
     *           The projection to return. Defaults to returning all properties.
     *     @type \Google\Cloud\Datastore\V1\KindExpression[]|\Google\Protobuf\Internal\RepeatedField $kind
     *           The kinds to query (if empty, returns entities of all kinds).
     *           Currently at most 1 kind may be specified.
     *     @type \Google\Cloud\Datastore\V1\Filter $filter
     *           The filter to apply.
     *     @type \Google\Cloud\Datastore\V1\PropertyOrder[]|\Google\Protobuf\Internal\RepeatedField $order
     *           The order to apply to the query results (if empty, order is unspecified).
     *     @type \Google\Cloud\Datastore\V1\PropertyReference[]|\Google\Protobuf\Internal\RepeatedField $distinct_on
     *           The properties to make distinct. The query results will contain the first
     *           result for each distinct combination of values for the given properties
     *           (if empty, all results are returned).
     *     @type string $start_cursor
     *           A starting point for the query results. Query cursors are
     *           returned in query result batches and
     *           [can only be used to continue the same
     *           query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *     @type string $end_cursor
     *           An ending point for the query results. Query cursors are
     *           returned in query result batches and
     *           [can only be used to limit the same
     *           query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *     @type int $offset
     *           The number of results to skip. Applies before limit, but after all other
     *           constraints. Optional. Must be >= 0 if specified.
     *     @type \Google\Protobuf\Int32Value $limit
     *           The maximum number of results to return. Applies after all other
     *           constraints. Optional.
     *           Unspecified is interpreted as no limit.
     *           Must be >= 0 if specified.
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Google\Datastore\V1\Query::initOnce();
        parent::__construct($data);
    }

    /**
     * The projection to return. Defaults to returning all properties.
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.Projection projection = 2;</code>
     * @return \Google\Protobuf\Internal\RepeatedField
     */
    public function getProjection()
    {
        return $this->projection;
    }

    /**
     * The projection to return. Defaults to returning all properties.
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.Projection projection = 2;</code>
     * @param \Google\Cloud\Datastore\V1\Projection[]|\Google\Protobuf\Internal\RepeatedField $var
     * @return $this
     */
    public function setProjection($var)
    {
        $arr = GPBUtil::checkRepeatedField($var, \Google\Protobuf\Internal\GPBType::MESSAGE, \Google\Cloud\Datastore\V1\Projection::class);
        $this->projection = $arr;

        return $this;
    }

    /**
     * The kinds to query (if empty, returns entities of all kinds).
     * Currently at most 1 kind may be specified.
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.KindExpression kind = 3;</code>
     * @return \Google\Protobuf\Internal\RepeatedField
     */
    public function getKind()
    {
        return $this->kind;
    }

    /**
     * The kinds to query (if empty, returns entities of all kinds).
     * Currently at most 1 kind may be specified.
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.KindExpression kind = 3;</code>
     * @param \Google\Cloud\Datastore\V1\KindExpression[]|\Google\Protobuf\Internal\RepeatedField $var
     * @return $this
     */
    public function setKind($var)
    {
        $arr = GPBUtil::checkRepeatedField($var, \Google\Protobuf\Internal\GPBType::MESSAGE, \Google\Cloud\Datastore\V1\KindExpression::class);
        $this->kind = $arr;

        return $this;
    }

    /**
     * The filter to apply.
     *
     * Generated from protobuf field <code>.google.datastore.v1.Filter filter = 4;</code>
     * @return \Google\Cloud\Datastore\V1\Filter|null
     */
    public function getFilter()
    {
        return $this->filter;
    }

    public function hasFilter()
    {
        return isset($this->filter);
    }

    public function clearFilter()
    {
        unset($this->filter);
    }

    /**
     * The filter to apply.
     *
     * Generated from protobuf field <code>.google.datastore.v1.Filter filter = 4;</code>
     * @param \Google\Cloud\Datastore\V1\Filter $var
     * @return $this
     */
    public function setFilter($var)
    {
        GPBUtil::checkMessage($var, \Google\Cloud\Datastore\V1\Filter::class);
        $this->filter = $var;

        return $this;
    }

    /**
     * The order to apply to the query results (if empty, order is unspecified).
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.PropertyOrder order = 5;</code>
     * @return \Google\Protobuf\Internal\RepeatedField
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * The order to apply to the query results (if empty, order is unspecified).
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.PropertyOrder order = 5;</code>
     * @param \Google\Cloud\Datastore\V1\PropertyOrder[]|\Google\Protobuf\Internal\RepeatedField $var
     * @return $this
     */
    public function setOrder($var)
    {
        $arr = GPBUtil::checkRepeatedField($var, \Google\Protobuf\Internal\GPBType::MESSAGE, \Google\Cloud\Datastore\V1\PropertyOrder::class);
        $this->order = $arr;

        return $this;
    }

    /**
     * The properties to make distinct. The query results will contain the first
     * result for each distinct combination of values for the given properties
     * (if empty, all results are returned).
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.PropertyReference distinct_on = 6;</code>
     * @return \Google\Protobuf\Internal\RepeatedField
     */
    public function getDistinctOn()
    {
        return $this->distinct_on;
    }

    /**
     * The properties to make distinct. The query results will contain the first
     * result for each distinct combination of values for the given properties
     * (if empty, all results are returned).
     *
     * Generated from protobuf field <code>repeated .google.datastore.v1.PropertyReference distinct_on = 6;</code>
     * @param \Google\Cloud\Datastore\V1\PropertyReference[]|\Google\Protobuf\Internal\RepeatedField $var
     * @return $this
     */
    public function setDistinctOn($var)
    {
        $arr = GPBUtil::checkRepeatedField($var, \Google\Protobuf\Internal\GPBType::MESSAGE, \Google\Cloud\Datastore\V1\PropertyReference::class);
        $this->distinct_on = $arr;

        return $this;
    }

    /**
     * A starting point for the query results. Query cursors are
     * returned in query result batches and
     * [can only be used to continue the same
     * query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *
     * Generated from protobuf field <code>bytes start_cursor = 7;</code>
     * @return string
     */
    public function getStartCursor()
    {
        return $this->start_cursor;
    }

    /**
     * A starting point for the query results. Query cursors are
     * returned in query result batches and
     * [can only be used to continue the same
     * query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *
     * Generated from protobuf field <code>bytes start_cursor = 7;</code>
     * @param string $var
     * @return $this
     */
    public function setStartCursor($var)
    {
        GPBUtil::checkString($var, False);
        $this->start_cursor = $var;

        return $this;
    }

    /**
     * An ending point for the query results. Query cursors are
     * returned in query result batches and
     * [can only be used to limit the same
     * query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *
     * Generated from protobuf field <code>bytes end_cursor = 8;</code>
     * @return string
     */
    public function getEndCursor()
    {
        return $this->end_cursor;
    }

    /**
     * An ending point for the query results. Query cursors are
     * returned in query result batches and
     * [can only be used to limit the same
     * query](https://cloud.google.com/datastore/docs/concepts/queries#cursors_limits_and_offsets).
     *
     * Generated from protobuf field <code>bytes end_cursor = 8;</code>
     * @param string $var
     * @return $this
     */
    public function setEndCursor($var)
    {
        GPBUtil::checkString($var, False);
        $this->end_cursor = $var;

        return $this;
    }

    /**
     * The number of results to skip. Applies before limit, but after all other
     * constraints. Optional. Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>int32 offset = 10;</code>
     * @return int
     */
    public function getOffset()
    {
        return $this->offset;
    }

    /**
     * The number of results to skip. Applies before limit, but after all other
     * constraints. Optional. Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>int32 offset = 10;</code>
     * @param int $var
     * @return $this
     */
    public function setOffset($var)
    {
        GPBUtil::checkInt32($var);
        $this->offset = $var;

        return $this;
    }

    /**
     * The maximum number of results to return. Applies after all other
     * constraints. Optional.
     * Unspecified is interpreted as no limit.
     * Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>.google.protobuf.Int32Value limit = 12;</code>
     * @return \Google\Protobuf\Int32Value|null
     */
    public function getLimit()
    {
        return $this->limit;
    }

    public function hasLimit()
    {
        return isset($this->limit);
    }

    public function clearLimit()
    {
        unset($this->limit);
    }

    /**
     * Returns the unboxed value from <code>getLimit()</code>

     * The maximum number of results to return. Applies after all other
     * constraints. Optional.
     * Unspecified is interpreted as no limit.
     * Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>.google.protobuf.Int32Value limit = 12;</code>
     * @return int|null
     */
    public function getLimitValue()
    {
        return $this->readWrapperValue("limit");
    }

    /**
     * The maximum number of results to return. Applies after all other
     * constraints. Optional.
     * Unspecified is interpreted as no limit.
     * Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>.google.protobuf.Int32Value limit = 12;</code>
     * @param \Google\Protobuf\Int32Value $var
     * @return $this
     */
    public function setLimit($var)
    {
        GPBUtil::checkMessage($var, \Google\Protobuf\Int32Value::class);
        $this->limit = $var;

        return $this;
    }

    /**
     * Sets the field by wrapping a primitive type in a Google\Protobuf\Int32Value object.

     * The maximum number of results to return. Applies after all other
     * constraints. Optional.
     * Unspecified is interpreted as no limit.
     * Must be >= 0 if specified.
     *
     * Generated from protobuf field <code>.google.protobuf.Int32Value limit = 12;</code>
     * @param int|null $var
     * @return $this
     */
    public function setLimitValue($var)
    {
        $this->writeWrapperValue("limit", $var);
        return $this;}

}


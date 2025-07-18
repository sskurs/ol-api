<?php
/**
 * Copyright © 2017 Divante, Inc. All rights reserved.
 * See LICENSE for license details.
 */
namespace OpenLoyalty\Domain\Campaign;

use OpenLoyalty\Domain\Identifier;
use Assert\Assertion as Assert;

/**
 * Class LevelId.
 */
class LevelId implements Identifier
{
    /**
     * @var string
     */
    protected $levelId;

    /**
     * LevelId constructor.
     *
     * @param string $levelId
     */
    public function __construct(string $levelId)
    {
        Assert::string($levelId);
        Assert::uuid($levelId);
        $this->levelId = $levelId;
    }

    public function __toString()
    {
        return $this->levelId;
    }
}

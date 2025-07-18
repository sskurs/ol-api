<?php
/**
 * Copyright © 2017 Divante, Inc. All rights reserved.
 * See LICENSE for license details.
 */
namespace OpenLoyalty\Domain\Customer\ReadModel;

use OpenLoyalty\Domain\Customer\LevelId;

interface CustomersBelongingToOneLevelRepository
{
    public function save($readModel);

    public function find($id);

    public function findBy(array $fields);

    public function findAll();

    public function remove($id);

    public function findByLevelIdPaginated(LevelId $levelId, $page = 1, $perPage = 10, $sortField = null, $direction = 'DESC');

    public function countByLevelId(LevelId $levelId);
}

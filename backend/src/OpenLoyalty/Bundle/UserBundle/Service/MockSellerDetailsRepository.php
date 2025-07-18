<?php

namespace OpenLoyalty\Bundle\UserBundle\Service;

use OpenLoyalty\Domain\Seller\ReadModel\SellerDetailsRepository;
use Broadway\ReadModel\RepositoryInterface;

/**
 * Mock repository for SellerDetailsRepository
 */
class MockSellerDetailsRepository implements SellerDetailsRepository, RepositoryInterface
{
    public function save($readModel)
    {
        // Mock implementation - does nothing
    }

    public function find($id)
    {
        return null;
    }

    public function findBy(array $fields)
    {
        return [];
    }

    public function findAll()
    {
        return [];
    }

    public function remove($id)
    {
        return true;
    }

    public function findByParameters(array $params, $exact = true)
    {
        return [];
    }

    public function findByParametersPaginated(array $params, $exact = true, $page = 1, $perPage = 10, $sortField = null, $direction = 'DESC')
    {
        return [];
    }

    public function countTotal(array $params = [], $exact = true)
    {
        return 0;
    }
} 
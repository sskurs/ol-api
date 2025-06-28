<?php

namespace OpenLoyalty\Domain\Repository\Account;

use OpenLoyalty\Domain\Account\ReadModel\AccountDetails;
use OpenLoyalty\Domain\Repository\OloyElasticsearchRepository;

/**
 * Class AccountDetailsElasticsearchRepository.
 */
class AccountDetailsElasticsearchRepository extends OloyElasticsearchRepository implements AccountDetailsRepository
{
    /**
     * @param string $id
     * @return AccountDetails|null
     */
    public function find(string $id): ?AccountDetails
    {
        $result = $this->findBy(['id' => $id]);
        return !empty($result) ? $result[0] : null;
    }

    /**
     * @param string $customerId
     * @return AccountDetails|null
     */
    public function findByCustomerId(string $customerId): ?AccountDetails
    {
        $result = $this->findBy(['customerId' => $customerId]);
        return !empty($result) ? $result[0] : null;
    }

    /**
     * @param AccountDetails $accountDetails
     */
    public function save(AccountDetails $accountDetails): void
    {
        parent::save($accountDetails);
    }

    /**
     * @param string $id
     */
    public function remove(string $id): void
    {
        parent::remove($id);
    }

    /**
     * @return AccountDetails[]
     */
    public function findAll(): array
    {
        return parent::findAll();
    }
} 
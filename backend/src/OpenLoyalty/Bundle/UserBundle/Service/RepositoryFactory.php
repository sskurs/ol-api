<?php

namespace OpenLoyalty\Bundle\UserBundle\Service;

use OpenLoyalty\Domain\Repository\Account\AccountDetailsRepositoryImpl;
use OpenLoyalty\Domain\Account\ReadModel\PointsTransferDetailsRepositoryImpl;
use OpenLoyalty\Domain\Repository\Campaign\CampaignRepository;
use OpenLoyalty\Domain\Repository\Customer\CustomerDetailsRepository;
use OpenLoyalty\Domain\Repository\Customer\InvitationDetailsRepository;
use OpenLoyalty\Domain\Repository\Customer\SellerDetailsRepository;
use OpenLoyalty\Domain\Repository\Segment\SegmentRepository;
use OpenLoyalty\Domain\Repository\Transaction\TransactionDetailsRepository;
use OpenLoyalty\Domain\Campaign\ReadModel\CouponUsageRepositoryImpl;
use OpenLoyalty\Domain\Campaign\ReadModel\CampaignUsageRepositoryImpl;

/**
 * Repository factory to create repository instances
 */
class RepositoryFactory
{
    public function create(string $repositoryType, string $modelClass, string $repositoryClass)
    {
        // Return appropriate repository based on type
        switch ($repositoryType) {
            case 'oloy.account_details':
                return new $repositoryClass();
            case 'oloy.points_transfer_details':
                return new PointsTransferDetailsRepositoryImpl();
            case 'oloy.customer_details':
                return new CustomerDetailsRepository();
            case 'oloy.invitation_details':
                return new InvitationDetailsRepository();
            case 'oloy.seller_details':
                return new SellerDetailsRepository();
            case 'oloy.segment':
                return new SegmentRepository();
            case 'oloy.transaction_details':
                return new TransactionDetailsRepository();
            case 'oloy.campaign':
                return new CampaignRepository();
            case 'oloy.coupon_usage':
                return new CouponUsageRepositoryImpl();
            case 'oloy.campaign_usage':
                return new CampaignUsageRepositoryImpl();
            default:
                // Return a dummy repository for unknown types
                return new \stdClass();
        }
    }
} 
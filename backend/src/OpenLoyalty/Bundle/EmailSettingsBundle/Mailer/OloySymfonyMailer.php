<?php
/**
 * Copyright © 2017 Divante, Inc. All rights reserved.
 * See LICENSE for license details.
 */
namespace OpenLoyalty\Bundle\EmailSettingsBundle\Mailer;

use OpenLoyalty\Bundle\EmailBundle\Mailer\OloySymfonyMailer as BaseMailer;
use OpenLoyalty\Domain\Email\ReadModel\DoctrineEmailRepositoryInterface;
use OpenLoyalty\Bundle\EmailBundle\Model\MessageInterface;
use Symfony\Bridge\Twig\TwigEngine;
use OpenLoyalty\Domain\Email\ReadModel\Email;
use Symfony\Component\Mailer\MailerInterface;
use Twig\Environment;

/**
 * Class OloySymfonyMailer.
 */
class OloySymfonyMailer extends BaseMailer
{
    /**
     * @var DoctrineEmailRepositoryInterface
     */
    protected $emailRepository;

    /**
     * @var Environment
     */
    protected $twig;

    /**
     * {@inheritdoc}
     *
     * @param DoctrineEmailRepositoryInterface $emailRepository
     * @param Environment                     $twig
     */
    public function __construct(TwigEngine $twigEngine, MailerInterface $mailer, DoctrineEmailRepositoryInterface $emailRepository, Environment $twig)
    {
        parent::__construct($twigEngine, $mailer);

        $this->emailRepository = $emailRepository;
        $this->twig = $twig;
    }

    /**
     * {@inheritdoc}
     */
    protected function decorateMessage(MessageInterface $message)
    {
        $result = parent::decorateMessage($message);

        // decorate message with data from database
        if ($emailTemplate = $this->getEmailTemplate($message->getTemplate())) {
            $message->setSubject($emailTemplate->getSubject());
            $message->setSenderName($emailTemplate->getSenderName());
            $message->setSenderEmail($emailTemplate->getSenderEmail());

            $template = $this->twig->createTemplate($emailTemplate->getContent());
            $renderedContent = $template->render($message->getParams());
            $message->setContent($renderedContent);
        }

        return $result;
    }

    /**
     * @param $key
     *
     * @return Email|null
     */
    protected function getEmailTemplate($key)
    {
        return $this->emailRepository->getByKey($key);
    }
} 
import React, { ReactElement } from 'react';
import {
  AmazonLogo,
  AndroidLogo,
  AngularLogo,
  AppleLogo,
  AppStoreLogo,
  Atom,
  BehanceLogo,
  CodepenLogo,
  CodesandboxLogo,
  DiscordLogo,
  DribbbleLogo,
  DropboxLogo,
  FacebookLogo,
  FigmaLogo,
  FramerLogo,
  GitBranch,
  GithubLogo,
  GitlabLogo,
  GoogleChromeLogo,
  GoogleDriveLogo,
  GoogleLogo,
  GooglePhotosLogo,
  GooglePlayLogo,
  IconWeight,
  InstagramLogo,
  Link,
  LinkedinLogo,
  LinuxLogo,
  MediumLogo,
  MessengerLogo,
  MetaLogo,
  MicrosoftExcelLogo,
  MicrosoftOutlookLogo,
  MicrosoftPowerpointLogo,
  MicrosoftTeamsLogo,
  MicrosoftWordLogo,
  NotionLogo,
  PatreonLogo,
  PaypalLogo,
  PhosphorLogo,
  PinterestLogo,
  RedditLogo,
  SlackLogo,
  SnapchatLogo,
  SoundcloudLogo,
  SpotifyLogo,
  StackOverflowLogo,
  StripeLogo,
  TelegramLogo,
  TiktokLogo,
  TwitchLogo,
  TwitterLogo,
  WebhooksLogo,
  WhatsappLogo,
  WindowsLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';

const getIcon = (str: string, size = 32, weight: IconWeight = 'duotone'): ReactElement => {
  switch (str.toLowerCase()) {
    case 'amazon':
      return <AmazonLogo size={size} weight={weight} />;
    case 'android':
      return <AndroidLogo size={size} weight={weight} />;
    case 'angular':
      return <AngularLogo size={size} weight={weight} />;
    case 'apple':
      return <AppleLogo size={size} weight={weight} />;
    case 'appstore':
      return <AppStoreLogo size={size} weight={weight} />;
    case 'behance':
      return <BehanceLogo size={size} weight={weight} />;
    case 'codepen':
      return <CodepenLogo size={size} weight={weight} />;
    case 'codesandbox':
      return <CodesandboxLogo size={size} weight={weight} />;
    case 'discord':
      return <DiscordLogo size={size} weight={weight} />;
    case 'dribbble':
      return <DribbbleLogo size={size} weight={weight} />;
    case 'dropbox':
      return <DropboxLogo size={size} weight={weight} />;
    case 'facebook':
      return <FacebookLogo size={size} weight={weight} />;
    case 'figma':
      return <FigmaLogo size={size} weight={weight} />;
    case 'framer':
      return <FramerLogo size={size} weight={weight} />;
    case 'git':
      return <GitBranch size={size} weight={weight} />;
    case 'github':
      return <GithubLogo size={size} weight={weight} />;
    case 'gitlab':
      return <GitlabLogo size={size} weight={weight} />;
    case 'google':
      return <GoogleLogo size={size} weight={weight} />;
    case 'chrome':
      return <GoogleChromeLogo size={size} weight={weight} />;
    case 'drive':
      return <GoogleDriveLogo size={size} weight={weight} />;
    case 'photos':
      return <GooglePhotosLogo size={size} weight={weight} />;
    case 'play':
      return <GooglePlayLogo size={size} weight={weight} />;
    case 'instagram':
      return <InstagramLogo size={size} weight={weight} />;
    case 'linkedin':
      return <LinkedinLogo size={size} weight={weight} />;
    case 'linux':
      return <LinuxLogo size={size} weight={weight} />;
    case 'medium':
      return <MediumLogo size={size} weight={weight} />;
    case 'messenger':
      return <MessengerLogo size={size} weight={weight} />;
    case 'meta':
      return <MetaLogo size={size} weight={weight} />;
    case 'microsoftexcel':
      return <MicrosoftExcelLogo size={size} weight={weight} />;
    case 'microsoftoutlook':
      return <MicrosoftOutlookLogo size={size} weight={weight} />;
    case 'microsoftpowerpoint':
      return <MicrosoftPowerpointLogo size={size} weight={weight} />;
    case 'microsoftteams':
      return <MicrosoftTeamsLogo size={size} weight={weight} />;
    case 'microsoftword':
      return <MicrosoftWordLogo size={size} weight={weight} />;
    case 'notion':
      return <NotionLogo size={size} weight={weight} />;
    case 'patreon':
      return <PatreonLogo size={size} weight={weight} />;
    case 'paypal':
      return <PaypalLogo size={size} weight={weight} />;
    case 'phosphor':
      return <PhosphorLogo size={size} weight={weight} />;
    case 'pinterest':
      return <PinterestLogo size={size} weight={weight} />;
    case 'react':
      return <Atom size={size} weight={weight} />;
    case 'reddit':
      return <RedditLogo size={size} weight={weight} />;
    case 'slack':
      return <SlackLogo size={size} weight={weight} />;
    case 'snapchat':
      return <SnapchatLogo size={size} weight={weight} />;
    case 'soundcloud':
      return <SoundcloudLogo size={size} weight={weight} />;
    case 'spotify':
      return <SpotifyLogo size={size} weight={weight} />;
    case 'stackoverflow':
      return <StackOverflowLogo size={size} weight={weight} />;
    case 'stripe':
      return <StripeLogo size={size} weight={weight} />;
    case 'telegram':
      return <TelegramLogo size={size} weight={weight} />;
    case 'tiktok':
      return <TiktokLogo size={size} weight={weight} />;
    case 'twitch':
      return <TwitchLogo size={size} weight={weight} />;
    case 'twitter':
      return <TwitterLogo size={size} weight={weight} />;
    case 'webhooks':
      return <WebhooksLogo size={size} weight={weight} />;
    case 'whatsapp':
      return <WhatsappLogo size={size} weight={weight} />;
    case 'windows':
      return <WindowsLogo size={size} weight={weight} />;
    case 'youtube':
      return <YoutubeLogo size={size} weight={weight} />;
    default:
      return <Link size={size} weight={weight} />;
  }
};

export default getIcon;

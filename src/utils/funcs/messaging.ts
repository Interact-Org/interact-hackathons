import { Chat } from '@/types';
import { initialChatMembership } from '@/types/initials';
import Cookies from 'js-cookie';

export const getMessagingUser = (chat: Chat) => {
  const userID = Cookies.get('id');
  if (chat.memberships[0].userID == userID) return chat.memberships[1].user;
  return chat.memberships[0].user;
};

export const getMessagingMembership = (chat: Chat) => {
  const userID = Cookies.get('id');
  if (chat.memberships[0].userID == userID) return chat.memberships[1];
  return chat.memberships[0];
};

export const getSelfMembership = (chat: Chat) => {
  const userID = Cookies.get('id');
  for (const membership of chat.memberships) {
    if (membership.userID == userID) return membership;
  }
  return initialChatMembership;
};

export const isChatUnread = (chat: Chat) => {
  const userID = Cookies.get('id') || '';

  return (
    chat.latestMessageID &&
    chat.latestMessage?.userID !== userID &&
    !chat.latestMessage?.readBy?.some(r => r.userID === userID)
  );
};

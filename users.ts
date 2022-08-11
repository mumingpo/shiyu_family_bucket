import { admins, members, nonMembers } from './whitelist';
import type { Admin, Member, NonMember } from './types';

function reverseMap<T>(
  record: Record<string, readonly string[]>,
  fn: (s: string) => T,
) {
  const map: Record<string, T> = {};

  Object.keys(record).forEach((name) => {
    record[name].forEach((email) => {
      map[email] = fn(name);
    });
  });

  return map;
}

type AdminsSrcType = typeof admins;
type MembersSrcType = typeof members;
type NonMembersSrcType = typeof nonMembers;
type AdminsList = {
  [key in keyof AdminsSrcType as AdminsSrcType[key][number]]: Admin<key>
};
type MembersList = {
  [key in keyof MembersSrcType as MembersSrcType[key][number]]: Member<key>
};
type NonMembersList = {
  [key in keyof NonMembersSrcType as NonMembersSrcType[key][number]]: NonMember<key>
};
const adminsList = reverseMap<Admin>(
  admins,
  (name) => ({ alias: name, type: 'admin'}),
) as AdminsList;
const membersList = reverseMap<Member>(
  members,
  (name) => ({ alias: name,  type: 'member'}),
) as MembersList;
const nonMembersList = reverseMap<NonMember>(
  nonMembers,
  (name) => ({ alias: name, type: 'nonMember'}),
) as NonMembersList;

const users = {
  ...adminsList,
  ...membersList,
  ...nonMembersList,
} as const;

export default users;

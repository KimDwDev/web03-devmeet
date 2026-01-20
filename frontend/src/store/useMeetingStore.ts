import { MediaState, MeetingMemberInfo } from '@/types/meeting';
import { create } from 'zustand';

const INITIAL_MEDIA_STATE: MediaState = {
  videoOn: false,
  audioOn: false,
  screenShareOn: false,
  cameraPermission: 'unknown',
  micPermission: 'unknown',
};

interface MeetingState {
  media: MediaState;
  members: Record<string, MeetingMemberInfo>;
  hasNewChat: boolean;

  isInfoOpen: boolean;
  isMemberOpen: boolean;
  isChatOpen: boolean;
  isWorkspaceOpen: boolean;
  isCodeEditorOpen: boolean;
}

interface MeetingActions {
  setMedia: (media: Partial<MediaState>) => void;
  setMembers: (members: MeetingMemberInfo[]) => void;
  addMember: (member: MeetingMemberInfo) => void;
  removeMember: (userId: string) => void;
  setHasNewChat: (state: boolean) => void;

  setIsOpen: (
    type: keyof Pick<
      MeetingState,
      | 'isInfoOpen'
      | 'isMemberOpen'
      | 'isChatOpen'
      | 'isWorkspaceOpen'
      | 'isCodeEditorOpen'
    >,
    state: boolean,
  ) => void;
}

export const useMeetingStore = create<MeetingState & MeetingActions>((set) => ({
  media: INITIAL_MEDIA_STATE,
  members: {},
  hasNewChat: false,

  isInfoOpen: false,
  isMemberOpen: false,
  isChatOpen: false,
  isWorkspaceOpen: false,
  isCodeEditorOpen: false,

  setMedia: (media) => set((prev) => ({ media: { ...prev.media, ...media } })),
  setMembers: (members) =>
    set({
      members: members.reduce(
        (acc, cur) => ({ ...acc, [cur.user_id]: cur }),
        {},
      ),
    }),
  addMember: (member) =>
    set((state) => ({
      members: {
        ...state.members,
        [member.user_id]: member,
      },
    })),
  removeMember: (userId) =>
    set((state) => {
      const nextMembers = { ...state.members };
      delete nextMembers[userId];
      return { members: nextMembers };
    }),
  setHasNewChat: (state) => set({ hasNewChat: state }),

  setIsOpen: (type, state) => set({ [type]: state }),
}));

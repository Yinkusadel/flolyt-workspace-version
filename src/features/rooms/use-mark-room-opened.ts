import { useMutation } from "@tanstack/react-query";

import { markRoomOpened, type MarkRoomOpenedResponse } from "@/services/api/rooms/mark-room-opened";

// Fire-and-forget: should run on every room-detail page mount. No toast — this is a silent
// bookkeeping call, not a user-initiated action.
const useMarkRoomOpened = () => {
  const mutation = useMutation<MarkRoomOpenedResponse, Error, string>({
    mutationFn: markRoomOpened,
  });

  return {
    markRoomOpened: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useMarkRoomOpened;

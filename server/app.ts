import AuthenticatingConcept from "./concepts/authenticating";
import FriendingConcept from "./concepts/friending";
import GroupingConcept from "./concepts/grouping";
import NotifyingConcept from "./concepts/notifying";
import PermissioningConcept from "./concepts/permissioning";
import PostingConcept from "./concepts/posting";
import SchedulingConcept from "./concepts/scheduling";
import SessioningConcept from "./concepts/sessioning";

// The app is a composition of concepts instantiated here
// and synchronized together in `routes.ts`.
export const Sessioning = new SessioningConcept();
export const Authing = new AuthenticatingConcept("users");
export const Posting = new PostingConcept("posts");
export const Friending = new FriendingConcept("friends");
export const Permissioning = new PermissioningConcept("organizers", "members");
export const Scheduling = new SchedulingConcept("scheduling");
export const Grouping = new GroupingConcept("grouping");
export const Notifying = new NotifyingConcept("notifications");

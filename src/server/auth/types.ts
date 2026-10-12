/** The signed-in person the rest of the app is allowed to see. */
export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

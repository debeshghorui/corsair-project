# Corsair

The product a person uses to read mail, manage a calendar, and talk to an assistant. Data is isolated per person.

## Language

**Session**:
The signed-in person the app is acting for right now. A session has an id, an email, and an optional display name.
_Avoid_: Clerk user, account, login

**Tenant**:
The isolation boundary for one person's mail, calendar, secrets, and assistant data. A tenant id is that person's session id.
_Avoid_: workspace, organization, account

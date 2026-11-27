# Company AI Companion

At a networking event, a guest can say their email address and then correct it on screen while the voice assistant is still talking. A delayed tool call could otherwise put the old spelling back. Here the contact form has a revision number. If someone types while the model is preparing an edit, the model has to read the form again.

This is the runnable public edition of my networking companion. The browser renders a Three.js avatar and connects to a realtime model over WebRTC. A Cloudflare Worker manages host and guest sessions, calls research tools, and stores contacts and follow-up drafts in D1. Northstar Studio is the fictional host used in this edition.

## Run locally

Use Node.js 24 and npm. From a fresh checkout:

```sh
npm ci
npm run setup
npm run dev
```

Open **http://127.0.0.1:5203/start.html** and enter the owner code printed during setup. Setup generates local credentials and applies the D1 migrations. On subsequent runs the code is in your local `.dev.vars`.

**Try it without a provider account.** Edit the sample guest, save the contact, change the follow-up text, then save the draft. Both writes go through the Worker into local D1. The starting draft on this page comes from a template. The sample company tour is also available at `/business/`.

**Try the voice workflow.** Add your own `OPENAI_API_KEY` to `.dev.vars` and restart the dev server. Set `REALTIME_MODEL` and `SEARCH_MODEL` to models available to your account if needed. Unlock the workspace, open the voice companion, press Start and allow microphone access. Ask it to start a networking conversation. A guest can ask about the company, request professional research, or exchange contact details. Research requires a completed response with source citations. Voice and search use your provider account.

Delivery is optional. The default local setup saves drafts only. The mail adapters and device-activation check are included for operators who configure a sender. Use your own D1 binding and secrets for a deployment.

## Inspect the implementation

| Question | Implementation |
| --- | --- |
| What happens when a guest types during an agent edit? | [Contact canvas](public/contact-canvas.js) and [race-condition tests](test/contact-canvas.test.js) |
| How does the assistant handle an interruption? | [Conversation guard](public/conversation-guard.js) and [realtime event handling](public/app.js) |
| Where does company research run? | [Research adapter and source handling](src/guest-research.js) |
| What separates guest access from the host workspace? | [Worker session and route handlers](src/worker.js) |
| How do edits survive a new session? | [Draft storage and revision checks](src/workspace.js) and [schema](migrations/) |

## Verify

`npm test` runs the automated suite with synthetic data and provider doubles. With the local server running, use a second terminal in the checkout to run `npm run test:flow`. It creates a fictional guest, saves their contact, ends the session, then saves and reopens a draft through the HTTP API. It leaves those sample records in local D1.

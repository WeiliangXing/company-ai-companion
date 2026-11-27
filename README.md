# Company AI Companion

Two runnable components from a voice assistant built for networking conversations. In the full application, a guest can talk through a business need, research can run in the background, and a reviewed contact can lead to a follow-up draft.

## Try the public edition

With Node.js 22 or newer, run `npm test`. The tests use simulated conversation events, an in-memory form and example addresses. They exercise the same JavaScript modules as the hosted app and require no account, dependencies, microphone or API key.

* **Voice turn-taking** — replay guest speech, playback and tool events. The controller handles short intentional interruptions, ignores transcript echoes and waits for a guest to finish before continuing a tool response.
* **Contact capture** — the assistant reads a revision before editing a form. If the guest types a correction while the assistant is speaking, the revision changes and the stale update is rejected. An explicit save persists the reviewed fields before opening a draft.

Start with the first test in `test/contact-canvas.test.js`. It recreates a user correcting a misheard email address. The last test exercises what happens when saving fails.

This public edition is an extract of the independent project, developed iteratively with Codex. Live voice, research, email delivery and the hosted database belong to the full application.

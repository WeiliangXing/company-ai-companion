import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = 'http://127.0.0.1:5203';
const code = JSON.parse(readFileSync('.dev.vars', 'utf8').match(/^OWNER_CODE=(.+)$/m)[1]);
async function post(path, data, headers = {}) {
  const response = await fetch(base + '/api/' + path, {
    method: 'POST', headers: { Origin: base, 'X-Networking-App': '1', 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  assert.equal(response.status, 200, JSON.stringify(result));
  return { result, response };
}
for (const page of ['/', '/start.html', '/app.js', '/business/', '/vendor/three.module.js']) {
  assert.equal((await fetch(base + page)).status, 200, page);
}
const login = await post('login', {code});
const owner = { Cookie: login.response.headers.get('set-cookie').split(';')[0] };
const { result: session } = await post('owner/new', {}, owner);
const guest = { Authorization: 'Bearer ' + session.token };
await post('contact', { name: 'Sam Rivera', email: 'sam@example.org' }, guest);
const { result: followup } = await post('tool', { name: 'prepare_followup' }, guest);
assert.equal(followup.profile.email, 'sam@example.org');
await post('end', {resume_token: session.resume_token}, guest);
const draft = { action: 'create', kind: 'email', save_requested: true, recipient: followup.profile.email, body: 'Hi Sam, thanks for stopping by.' };
const { result: saved } = await post('owner/workspace', draft, owner);
const { result: reopened } = await post('owner/workspace', { action: 'read', id: saved.item.id }, owner);
assert.equal(reopened.item.body, draft.body);
assert.equal(reopened.email_sent, false);
console.log('Verified guest handoff, persisted contact, reopened draft, and static assets.');

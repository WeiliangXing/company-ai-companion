const el = id => document.getElementById(id);
const personId = crypto.randomUUID();
let recipient;
let draftId;
let revision;
async function api(path, data) {
  const response = await fetch('/api/' + path, {
    method: data ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'X-Networking-App': '1' },
    body: data && JSON.stringify(data)
  });
  const result = await response.json();
  if (!response.ok) throw Error(result.error);
  return result;
}
function openWorkspace() {
  el('login').hidden = true;
  el('workspace').hidden = false;
}
function submit(id, action) {
  el(id).onsubmit = async event => {
    event.preventDefault();
    const button = event.submitter;
    button.disabled = true;
    try { await action(Object.fromEntries(new FormData(el(id)))); }
    catch (error) { el('status').textContent = error.message; }
    finally { button.disabled = false; }
  };
}
submit('login', async data => {
  await api('login', data);
  if (location.hash.startsWith('#email_device=')) return location.replace('/' + location.hash);
  openWorkspace();
  el('status').textContent = '';
});
submit('contact', async data => {
  await api('owner/contact', { ...data, id: personId });
  recipient = data.email;
  el('draft').elements.body.value = `Hi ${data.name},\n\nThanks for taking the time to connect. What would you like to explore next?`;
  el('draft').hidden = false;
  el('status').textContent = 'Contact saved. Review the draft below.';
});
submit('draft', async data => {
  const { item } = await api('owner/workspace', { ...data, id: draftId, revision,
    action: draftId ? 'update' : 'create', save_requested: true, kind: 'email',
    recipient, title: 'Event follow-up', subject: 'Good meeting you' });
  draftId = item.id;
  revision = item.revision;
  el('status').textContent = 'Draft saved locally. No email was sent.';
});
api('owner/status').then(openWorkspace).catch(error => { el('status').textContent = error.message; });

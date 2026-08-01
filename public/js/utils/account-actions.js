export const AccountActions = {
  async add() {
    window.dispatchEvent(new CustomEvent('open-add-account'));
  },
  async remove(email) {
    if (!confirm(`Remove ${email}?`)) return;
    await fetch(`/api/accounts/${encodeURIComponent(email)}`, { method: 'DELETE' });
    window.dispatchEvent(new CustomEvent('accounts-updated'));
  },
  async verify(email) {
    await fetch(`/api/accounts/${encodeURIComponent(email)}/verify`, { method: 'POST' });
    window.dispatchEvent(new CustomEvent('accounts-updated'));
  }
};

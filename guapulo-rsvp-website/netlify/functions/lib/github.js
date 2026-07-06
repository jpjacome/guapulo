// Minimal GitHub REST client for the admin dashboard.
// Env vars:
//   GITHUB_TOKEN   (required) — fine-grained PAT with Contents: read/write on the repo
//   GITHUB_REPO    (optional) — "owner/repo", defaults to jpjacome/guapulo
//   GITHUB_BRANCH  (optional) — defaults to main
const API = 'https://api.github.com';

function ghEnv() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN env var is not configured');
  return {
    token,
    repo: process.env.GITHUB_REPO || 'jpjacome/guapulo',
    branch: process.env.GITHUB_BRANCH || 'main'
  };
}

async function gh(pathname, options = {}) {
  const { token } = ghEnv();
  const res = await fetch(`${API}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'guapulo-admin',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${options.method || 'GET'} ${pathname} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return res.json();
}

/** Read a file's decoded content + blob sha. */
async function getFile(filePath) {
  const { repo, branch } = ghEnv();
  const data = await gh(`/repos/${repo}/contents/${filePath}?ref=${branch}`);
  return {
    content: Buffer.from(data.content, 'base64').toString('utf8'),
    sha: data.sha
  };
}

/** List a directory's files (name + size). */
async function listDir(dirPath) {
  const { repo, branch } = ghEnv();
  const data = await gh(`/repos/${repo}/contents/${dirPath}?ref=${branch}`);
  return (Array.isArray(data) ? data : [])
    .filter((item) => item.type === 'file')
    .map((item) => ({ name: item.name, size: item.size }));
}

/**
 * Commit multiple files in a single commit (Git Data API).
 * @param {string} message commit message
 * @param {Array<{path: string, content: Buffer}>} files repo-relative paths
 * @returns {string} new commit sha
 */
async function commitFiles(message, files) {
  const { repo, branch } = ghEnv();

  const ref = await gh(`/repos/${repo}/git/ref/heads/${branch}`);
  const parentSha = ref.object.sha;
  const parentCommit = await gh(`/repos/${repo}/git/commits/${parentSha}`);

  const tree = [];
  for (const file of files) {
    const blob = await gh(`/repos/${repo}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({
        content: file.content.toString('base64'),
        encoding: 'base64'
      })
    });
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newTree = await gh(`/repos/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: parentCommit.tree.sha, tree })
  });

  const commit = await gh(`/repos/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [parentSha] })
  });

  await gh(`/repos/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha })
  });

  return commit.sha;
}

module.exports = { getFile, listDir, commitFiles };

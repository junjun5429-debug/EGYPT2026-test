const SUPABASE_URL = 'https://qqzrvdscnwdmpdrqdqtz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KZgbYMI3wmd4KE2FVyW_Xg_TH04wI69';
const BUCKET_NAME = 'memories';
const TABLE_NAME = 'travel_memories';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2560;
const IMAGE_QUALITY = 0.82;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const state = { user: null, memories: [], previewUrls: [], selectedMemory: null, selectedIds: new Set(), renderVersion: 0 };
const byId = (id) => document.getElementById(id);

const authPanel = byId('auth-panel');
const albumWorkspace = byId('album-workspace');
const authMessage = byId('auth-message');
const uploadMessage = byId('upload-message');
const editMessage = byId('edit-message');
const memoryGrid = byId('memory-grid');
const galleryStatus = byId('gallery-status');

function showMessage(element, message = '', type = '') {
  element.textContent = message;
  element.className = `status-message${type ? ` ${type}` : ''}`;
}

function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(`${date}T00:00:00`));
}

function authorDisplay(name) {
  if (!name) return 'メンバー';
  return name.includes('@') ? name.split('@')[0] : name;
}

function currentUserName() {
  return state.user.user_metadata?.name || state.user.email || 'メンバー';
}

function safeFileName(name) {
  const extension = name.split('.').pop().toLowerCase();
  const stem = name.slice(0, -(extension.length + 1)).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60) || 'photo';
  return `${stem}.${extension}`;
}

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('写真を圧縮できませんでした。')), 'image/webp', IMAGE_QUALITY);
  });
  const stem = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${stem}.webp`, { type: 'image/webp', lastModified: file.lastModified });
}

function authenticatedPhotoUrl(path) {
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET_NAME}/${encodedPath}`;
}

function clearPhotoPreviews() {
  state.previewUrls.forEach((url) => URL.revokeObjectURL(url));
  state.previewUrls = [];
  byId('photo-preview-grid').replaceChildren();
  byId('photo-preview-grid').hidden = true;
  byId('photo-selection-summary').hidden = true;
  byId('photo-prompt').hidden = false;
}

function renderPhotoPreviews(files) {
  clearPhotoPreviews();
  if (!files.length) return;

  const previews = files.map((file) => {
    const image = document.createElement('img');
    const url = URL.createObjectURL(file);
    state.previewUrls.push(url);
    image.src = url;
    image.alt = file.name;
    return image;
  });
  byId('photo-preview-grid').append(...previews);
  byId('photo-preview-grid').hidden = false;
  byId('photo-selection-summary').textContent = `${files.length}枚を選択中`;
  byId('photo-selection-summary').hidden = false;
  byId('photo-prompt').hidden = true;
}

async function signedPhotoUrl(path) {
  const { data, error } = await client.storage.from(BUCKET_NAME).createSignedUrl(path, 3600);
  if (error) throw error;
  return data.signedUrl;
}

function setSignedOut() {
  state.renderVersion += 1;
  state.user = null;
  state.memories = [];
  state.selectedIds.clear();
  authPanel.hidden = false;
  albumWorkspace.hidden = true;
  memoryGrid.replaceChildren();
}

async function setSignedIn(user) {
  state.user = user;
  authPanel.hidden = true;
  albumWorkspace.hidden = false;
  byId('account-email').textContent = user.email || 'Googleアカウント';
  await loadMemories();
}

async function loadMemories() {
  galleryStatus.hidden = false;
  galleryStatus.textContent = '写真を読み込んでいます';
  const { data, error } = await client
    .from(TABLE_NAME)
    .select('id,user_id,author_name,storage_path,photo_url,taken_on,location,comment,created_at')
    .order('taken_on', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    galleryStatus.textContent = ['42P01', 'PGRST205'].includes(error.code)
      ? 'Supabaseのアルバム設定がまだ完了していません。'
      : `写真を読み込めませんでした: ${error.message}`;
    return;
  }

  state.memories = data || [];
  const ownedIds = new Set(state.memories.filter((memory) => memory.user_id === state.user.id).map((memory) => memory.id));
  state.selectedIds.forEach((id) => {
    if (!ownedIds.has(id)) state.selectedIds.delete(id);
  });
  await renderMemories();
}

function updateSelectionBar() {
  const count = state.selectedIds.size;
  byId('selection-count').textContent = `${count}枚を選択中`;
  byId('selection-bar').hidden = count === 0;
}

function filteredMemories() {
  const date = byId('filter-date').value;
  const location = byId('filter-location').value.trim().toLocaleLowerCase('ja');
  const showOthers = byId('show-others').checked;
  return state.memories.filter((memory) => {
    const matchesScope = showOthers || memory.user_id === state.user.id;
    const matchesDate = !date || memory.taken_on === date;
    const matchesLocation = !location || memory.location.toLocaleLowerCase('ja').includes(location);
    return matchesScope && matchesDate && matchesLocation;
  });
}

async function createMemoryCard(memory) {
  const isOwner = memory.user_id === state.user.id;
  const authorLabel = isOwner ? '自分' : authorDisplay(memory.author_name);
  const article = document.createElement('article');
  article.className = `memory-card ${isOwner ? 'is-owner' : 'is-shared'}`;

  if (isOwner) {
    const selectionLabel = document.createElement('label');
    selectionLabel.className = 'memory-select';
    selectionLabel.setAttribute('aria-label', `${memory.location}の写真を選択`);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.selectedIds.has(memory.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.selectedIds.add(memory.id);
      else state.selectedIds.delete(memory.id);
      article.classList.toggle('is-selected', checkbox.checked);
      updateSelectionBar();
    });
    selectionLabel.append(checkbox);
    article.classList.toggle('is-selected', checkbox.checked);
    article.append(selectionLabel);
  }

  const photoButton = document.createElement('button');
  photoButton.type = 'button';
  photoButton.className = 'memory-photo-button';
  photoButton.setAttribute('aria-label', `${authorLabel}が保存した${memory.location}の写真を拡大表示`);

  const image = document.createElement('img');
  image.alt = `${memory.location}の思い出`;
  image.loading = 'lazy';
  try {
    image.src = await signedPhotoUrl(memory.storage_path);
  } catch {
    image.alt = '写真を表示できません';
  }
  const ownerBadge = document.createElement('span');
  ownerBadge.className = 'memory-owner-badge';
  ownerBadge.textContent = authorLabel;
  ownerBadge.setAttribute('aria-hidden', 'true');
  photoButton.append(image, ownerBadge);
  photoButton.addEventListener('click', () => openPhoto(memory, image.src));
  article.append(photoButton);
  return article;
}

async function renderMemories() {
  const renderVersion = ++state.renderVersion;
  const memories = filteredMemories();
  memoryGrid.replaceChildren();
  byId('memory-count').textContent = `${memories.length}枚`;
  updateSelectionBar();

  if (!memories.length) {
    galleryStatus.hidden = false;
    galleryStatus.textContent = state.memories.length ? '条件に一致する写真はありません。' : '最初の思い出を追加してみましょう。';
    return;
  }

  galleryStatus.hidden = true;
  const cards = await Promise.all(memories.map(createMemoryCard));
  if (renderVersion !== state.renderVersion) return;
  memoryGrid.replaceChildren(...cards);
}

function openPhoto(memory, imageUrl) {
  state.selectedMemory = memory;
  byId('dialog-image').src = imageUrl;
  byId('dialog-image').alt = `${memory.location}の思い出`;
  byId('dialog-location').textContent = memory.location;
  byId('dialog-date').textContent = formatDate(memory.taken_on);
  byId('dialog-comment').textContent = memory.comment || '';
  byId('dialog-author').textContent = memory.user_id === state.user.id
    ? '自分が保存'
    : `${authorDisplay(memory.author_name)} さんが保存`;
  byId('photo-edit-button').hidden = memory.user_id !== state.user.id;
  byId('photo-dialog').showModal();
}

function openEdit(memory) {
  if (memory.user_id !== state.user.id) return;
  byId('edit-id').value = memory.id;
  byId('edit-date').value = memory.taken_on;
  byId('edit-location').value = memory.location;
  byId('edit-comment').value = memory.comment || '';
  showMessage(editMessage);
  byId('edit-dialog').showModal();
}

async function uploadMemory(event) {
  event.preventDefault();
  const files = [...byId('photo-file').files];
  if (!files.length) return showMessage(uploadMessage, '写真を選択してください。', 'error');
  const unsupportedFile = files.find((file) => !ALLOWED_TYPES.has(file.type));
  if (unsupportedFile) return showMessage(uploadMessage, `${unsupportedFile.name}: JPEG、PNG、WebPを選択してください。`, 'error');
  const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE);
  if (oversizedFile) return showMessage(uploadMessage, `${oversizedFile.name}: 写真は10 MB以下にしてください。`, 'error');

  const uploadButton = byId('upload-button');
  uploadButton.disabled = true;
  const failures = [];
  let savedCount = 0;

  try {
    for (const [index, file] of files.entries()) {
      showMessage(uploadMessage, `${files.length}枚中${index + 1}枚目を圧縮しています。`);

      try {
        const compressedFile = await compressImage(file);
        const path = `${state.user.id}/${crypto.randomUUID()}-${safeFileName(compressedFile.name)}`;
        showMessage(uploadMessage, `${files.length}枚中${index + 1}枚目をアップロードしています。`);
        const { error: storageError } = await client.storage.from(BUCKET_NAME).upload(path, compressedFile, {
          cacheControl: '3600',
          contentType: compressedFile.type,
          upsert: false
        });
        if (storageError) throw storageError;

        const { error: databaseError } = await client.from(TABLE_NAME).insert({
          user_id: state.user.id,
          author_name: currentUserName(),
          storage_path: path,
          photo_url: authenticatedPhotoUrl(path),
          taken_on: byId('memory-date').value,
          location: byId('memory-location').value.trim(),
          comment: byId('memory-comment').value.trim() || null
        });
        if (databaseError) {
          await client.storage.from(BUCKET_NAME).remove([path]);
          throw databaseError;
        }
        savedCount += 1;
      } catch (error) {
        failures.push(`${file.name}: ${error.message}`);
      }
    }

    byId('upload-form').reset();
    clearPhotoPreviews();
    if (savedCount) await loadMemories();
    if (failures.length) {
      showMessage(uploadMessage, `${savedCount}枚を保存、${failures.length}枚は保存できませんでした。${failures.join(' / ')}`, 'error');
    } else {
      showMessage(uploadMessage, `${savedCount}枚をアルバムに保存しました。`, 'success');
    }
  } finally {
    uploadButton.disabled = false;
  }
}

async function updateMemory(event) {
  event.preventDefault();
  const id = byId('edit-id').value;
  const { error } = await client.from(TABLE_NAME).update({
    taken_on: byId('edit-date').value,
    location: byId('edit-location').value.trim(),
    comment: byId('edit-comment').value.trim() || null
  }).eq('id', id);

  if (error) return showMessage(editMessage, `更新できませんでした: ${error.message}`, 'error');
  byId('edit-dialog').close();
  await loadMemories();
}

async function deleteMemory() {
  const memory = state.memories.find((item) => item.id === byId('edit-id').value);
  if (!memory || !confirm('この写真をアルバムから削除しますか？')) return;
  showMessage(editMessage, '削除しています。');

  const { error: storageError } = await client.storage.from(BUCKET_NAME).remove([memory.storage_path]);
  if (storageError) return showMessage(editMessage, `写真を削除できませんでした: ${storageError.message}`, 'error');

  const { error: databaseError } = await client.from(TABLE_NAME).delete().eq('id', memory.id);
  if (databaseError) return showMessage(editMessage, `記録を削除できませんでした: ${databaseError.message}`, 'error');
  byId('edit-dialog').close();
  await loadMemories();
}

async function deleteSelectedMemories() {
  const memories = state.memories.filter((memory) => state.selectedIds.has(memory.id) && memory.user_id === state.user.id);
  if (!memories.length || !confirm(`選択した${memories.length}枚をアルバムから削除しますか？`)) return;

  const button = byId('delete-selected-button');
  button.disabled = true;
  galleryStatus.hidden = false;
  galleryStatus.textContent = `${memories.length}枚を削除しています。`;
  try {
    const { error: storageError } = await client.storage.from(BUCKET_NAME).remove(memories.map((memory) => memory.storage_path));
    if (storageError) throw storageError;

    const { error: databaseError } = await client.from(TABLE_NAME).delete().in('id', memories.map((memory) => memory.id));
    if (databaseError) throw databaseError;
    state.selectedIds.clear();
    await loadMemories();
  } catch (error) {
    galleryStatus.textContent = `選択した写真を削除できませんでした: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

byId('auth-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage(authMessage, 'ログインしています。');
  const { error } = await client.auth.signInWithPassword({
    email: byId('auth-email').value,
    password: byId('auth-password').value
  });
  if (error) showMessage(authMessage, `ログインできませんでした: ${error.message}`, 'error');
});

byId('sign-up-button').addEventListener('click', async () => {
  if (!byId('auth-form').reportValidity()) return;
  showMessage(authMessage, 'アカウントを作成しています。');
  const { data, error } = await client.auth.signUp({
    email: byId('auth-email').value,
    password: byId('auth-password').value,
    options: { emailRedirectTo: new URL('memories.html', location.href).href }
  });
  if (error) return showMessage(authMessage, `登録できませんでした: ${error.message}`, 'error');
  showMessage(authMessage, data.session ? '登録してログインしました。' : '確認メールを送信しました。メール内のリンクを開いてください。', 'success');
});

byId('google-button').addEventListener('click', async () => {
  showMessage(authMessage, 'Googleのログイン画面を開いています。');
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: new URL('memories.html', location.href).href }
  });
  if (error) showMessage(authMessage, `Googleログインを開始できませんでした: ${error.message}`, 'error');
});

byId('sign-out-button').addEventListener('click', () => client.auth.signOut());
byId('upload-form').addEventListener('submit', uploadMemory);
byId('edit-form').addEventListener('submit', updateMemory);
byId('delete-button').addEventListener('click', deleteMemory);
byId('delete-selected-button').addEventListener('click', deleteSelectedMemories);
byId('photo-dialog-close').addEventListener('click', () => byId('photo-dialog').close());
byId('photo-edit-button').addEventListener('click', () => {
  if (!state.selectedMemory) return;
  byId('photo-dialog').close();
  openEdit(state.selectedMemory);
});
byId('edit-dialog-close').addEventListener('click', () => byId('edit-dialog').close());
byId('filter-date').addEventListener('change', renderMemories);
byId('filter-location').addEventListener('input', renderMemories);
byId('show-others').addEventListener('change', renderMemories);
byId('clear-filters').addEventListener('click', () => {
  byId('filter-date').value = '';
  byId('filter-location').value = '';
  byId('show-others').checked = false;
  renderMemories();
});
byId('photo-file').addEventListener('change', (event) => {
  renderPhotoPreviews([...event.target.files]);
});

client.auth.onAuthStateChange((_event, session) => {
  if (session?.user) setSignedIn(session.user);
  else setSignedOut();
});

client.auth.getSession().then(({ data }) => {
  if (data.session?.user) setSignedIn(data.session.user);
  else setSignedOut();
});
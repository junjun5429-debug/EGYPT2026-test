const SUPABASE_URL = 'https://qqzrvdscnwdmpdrqdqtz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_KZgbYMI3wmd4KE2FVyW_Xg_TH04wI69';
const BUCKET_NAME = 'memories';
const TABLE_NAME = 'travel_memories';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const TARGET_FILE_SIZE = 1_000_000;
const MAX_IMAGE_DIMENSION = 2560;
const THUMBNAIL_FILE_SIZE = 100_000;
const THUMBNAIL_DIMENSION = 480;
const MIN_IMAGE_QUALITY = 0.4;
const MAX_IMAGE_QUALITY = 0.86;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const AUTH_EMAILS_STORAGE_KEY = 'egypt-memories-auth-emails';
const AUTH_MODES = Object.freeze({ REGISTER: 'register', SIGN_IN: 'signin', SIGN_IN_WITH_EMAIL: 'signin-email', RECOVERY: 'recovery' });

function authCallbackErrorMessage() {
  const parameters = new URLSearchParams(window.location.hash.slice(1));
  if (!parameters.get('error')) return '';
  if (parameters.get('error_code') === 'otp_expired') {
    return 'パスワード再設定リンクの有効期限が切れているか、すでに使用されています。もう一度再設定メールを送信し、最新のメールに記載されたリンクを開いてください。';
  }
  return 'パスワード再設定リンクを使用できません。もう一度再設定メールを送信してください。';
}

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const state = { user: null, memories: [], previewUrls: [], selectedMemory: null, selectedIds: new Set(), renderVersion: 0, selectedNickname: '', memberRegistered: false, authMode: AUTH_MODES.REGISTER, pendingUserId: '', authCallbackError: authCallbackErrorMessage() };
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
  return (state.user.user_metadata?.name || state.user.email || 'メンバー').toUpperCase();
}

function isMemoryOwner(memory) {
  return authorDisplay(memory.author_name).toUpperCase() === currentUserName();
}

function storedAuthEmails() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_EMAILS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function rememberAuthEmail(nickname, email) {
  const emails = storedAuthEmails();
  emails[nickname] = email.trim().toLowerCase();
  localStorage.setItem(AUTH_EMAILS_STORAGE_KEY, JSON.stringify(emails));
}

function selectedAuthEmail() {
  return storedAuthEmails()[state.selectedNickname] || '';
}

function setPasswordVisibility(visible) {
  byId('auth-password').type = visible ? 'text' : 'password';
  byId('auth-password-confirm').type = visible ? 'text' : 'password';
  byId('password-visibility-button').textContent = visible ? '隠す' : '表示';
  byId('password-visibility-button').setAttribute('aria-pressed', String(visible));
}

function showNicknameSelection() {
  state.selectedNickname = '';
  state.memberRegistered = false;
  byId('auth-back-button').hidden = false;
  byId('nickname-login').hidden = false;
  byId('credential-panel').hidden = true;
  byId('credential-form').reset();
  showMessage(authMessage, state.authCallbackError, state.authCallbackError ? 'error' : '');
}

function setAuthMode(mode) {
  state.authMode = mode;
  const savedEmail = selectedAuthEmail();
  const passwordOnly = mode === AUTH_MODES.SIGN_IN && Boolean(savedEmail);
  const isRegistration = mode === AUTH_MODES.REGISTER;
  const isRecovery = mode === AUTH_MODES.RECOVERY;
  const requiresPasswordConfirmation = isRegistration || isRecovery;
  byId('auth-email-field').hidden = passwordOnly || isRecovery;
  byId('auth-email').required = !passwordOnly && !isRecovery;
  byId('auth-email').value = passwordOnly ? savedEmail : '';
  byId('auth-password').value = '';
  byId('auth-password-confirm-field').hidden = !requiresPasswordConfirmation;
  byId('auth-password-confirm').required = requiresPasswordConfirmation;
  byId('auth-password-confirm').value = '';
  setPasswordVisibility(false);
  byId('auth-password').autocomplete = isRegistration || isRecovery ? 'new-password' : 'current-password';
  byId('auth-password-label').textContent = isRecovery ? '新しいパスワード' : 'パスワード';
  byId('credential-title').textContent = isRecovery ? 'パスワード再設定' : isRegistration ? '初回登録' : 'パスワード認証';
  byId('auth-submit-button').textContent = isRecovery ? 'パスワードを更新' : isRegistration ? '登録してログイン' : 'ログイン';
  byId('auth-mode-button').textContent = isRegistration
    ? 'すでに登録済みの方'
    : passwordOnly
      ? 'メール アドレスを入力してログイン'
      : state.memberRegistered ? '保存したメール アドレスでログイン' : '初回登録へ戻る';
  byId('auth-mode-button').hidden = isRecovery || (mode === AUTH_MODES.SIGN_IN_WITH_EMAIL && state.memberRegistered && !savedEmail);
  byId('password-reset-button').hidden = isRegistration || isRecovery;
  showMessage(authMessage);
}

function showPasswordRecovery(user) {
  state.selectedNickname = user.user_metadata?.name?.toLowerCase() || '';
  byId('nickname-login').hidden = true;
  byId('credential-panel').hidden = false;
  byId('auth-back-button').hidden = true;
  byId('selected-nickname').textContent = state.selectedNickname.toUpperCase();
  setAuthMode(AUTH_MODES.RECOVERY);
  byId('auth-password').focus();
}

async function selectNickname(nickname) {
  if (state.authCallbackError) {
    state.authCallbackError = '';
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
  state.selectedNickname = nickname;
  const buttons = byId('nickname-login').querySelectorAll('button');
  buttons.forEach((button) => { button.disabled = true; });
  showMessage(authMessage, '登録情報を確認しています。');

  try {
    const { data: registered, error } = await client.rpc('is_travel_member_registered', { member_nickname: nickname });
    if (error) throw error;
    state.memberRegistered = registered;
    byId('nickname-login').hidden = true;
    byId('credential-panel').hidden = false;
    byId('selected-nickname').textContent = nickname.toUpperCase();
    const mode = selectedAuthEmail()
      ? AUTH_MODES.SIGN_IN
      : registered ? AUTH_MODES.SIGN_IN_WITH_EMAIL : AUTH_MODES.REGISTER;
    setAuthMode(mode);
    (byId('auth-email-field').hidden ? byId('auth-password') : byId('auth-email')).focus();
  } catch (error) {
    state.selectedNickname = '';
    state.memberRegistered = false;
    showMessage(authMessage, `登録情報を確認できませんでした: ${error.message}`, 'error');
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
}

function safeFileName(name) {
  const extension = name.split('.').pop().toLowerCase();
  const stem = name.slice(0, -(extension.length + 1)).replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 60) || 'photo';
  return `${stem}.${extension}`;
}

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const initialScale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
  let width = Math.max(1, Math.round(bitmap.width * initialScale));
  let height = Math.max(1, Math.round(bitmap.height * initialScale));

  try {
    for (let resizeAttempt = 0; resizeAttempt < 8; resizeAttempt += 1) {
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);

      let minimumQuality = MIN_IMAGE_QUALITY;
      let maximumQuality = MAX_IMAGE_QUALITY;
      let bestBlob = null;
      for (let qualityAttempt = 0; qualityAttempt < 7; qualityAttempt += 1) {
        const quality = (minimumQuality + maximumQuality) / 2;
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((result) => result ? resolve(result) : reject(new Error('写真を圧縮できませんでした。')), 'image/jpeg', quality);
        });
        if (blob.type !== 'image/jpeg') throw new Error('このブラウザーではJPEG圧縮を利用できません。');
        if (blob.size <= TARGET_FILE_SIZE) {
          bestBlob = blob;
          minimumQuality = quality;
        } else {
          maximumQuality = quality;
        }
      }

      if (bestBlob) {
        const stem = file.name.replace(/\.[^.]+$/, '') || 'photo';
        return new File([bestBlob], `${stem}.jpg`, { type: 'image/jpeg', lastModified: file.lastModified });
      }
      width = Math.max(1, Math.round(width * 0.8));
      height = Math.max(1, Math.round(height * 0.8));
    }
  } finally {
    bitmap.close();
  }
  throw new Error('写真を1 MB以下に圧縮できませんでした。');
}

async function createThumbnail(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, THUMBNAIL_DIMENSION / Math.max(bitmap.width, bitmap.height));
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  try {
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let minimumQuality = 0.35;
    let maximumQuality = 0.8;
    let bestBlob = null;
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const quality = (minimumQuality + maximumQuality) / 2;
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('サムネイルを作成できませんでした。')), 'image/jpeg', quality);
      });
      if (blob.size <= THUMBNAIL_FILE_SIZE) {
        bestBlob = blob;
        minimumQuality = quality;
      } else {
        maximumQuality = quality;
      }
    }
    if (!bestBlob) throw new Error('サムネイルを100 KB以下に圧縮できませんでした。');
    return new File([bestBlob], 'thumbnail.jpg', { type: 'image/jpeg', lastModified: file.lastModified });
  } finally {
    bitmap.close();
  }
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
  byId('nickname-login').querySelectorAll('button').forEach((button) => {
    button.disabled = false;
  });
  authPanel.hidden = false;
  albumWorkspace.hidden = true;
  memoryGrid.replaceChildren();
  showNicknameSelection();
}

async function setSignedIn(user) {
  if (state.user?.id === user.id || state.pendingUserId === user.id) return;
  state.pendingUserId = user.id;
  try {
    const { data: claimed, error } = await client.rpc('claim_travel_member');
    if (error || !claimed) {
      await client.auth.signOut();
      showMessage(authMessage, 'このユーザーは別のアカウントで登録済みです。', 'error');
      return;
    }
    state.user = user;
    authPanel.hidden = true;
    albumWorkspace.hidden = false;
    byId('account-email').textContent = currentUserName();
    await loadMemories();
  } finally {
    state.pendingUserId = '';
  }
}

function updateLocationSuggestionState(containerId, inputId) {
  const selectedLocation = byId(inputId).value.trim().toLocaleLowerCase('ja');
  byId(containerId).querySelectorAll('.location-suggestion').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.location.toLocaleLowerCase('ja') === selectedLocation));
  });
}

function renderLocationSuggestions(locations, containerId, inputId, onSelect) {
  byId(containerId).replaceChildren(...locations.map((location) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'location-suggestion';
    button.textContent = location;
    button.dataset.location = location;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      byId(inputId).value = location;
      updateLocationSuggestionState(containerId, inputId);
      onSelect?.();
    });
    return button;
  }));
  updateLocationSuggestionState(containerId, inputId);
}

async function loadMemories() {
  galleryStatus.hidden = false;
  galleryStatus.textContent = '写真を読み込んでいます';
  const { data, error } = await client
    .from(TABLE_NAME)
    .select('id,user_id,author_name,storage_path,thumbnail_path,photo_url,taken_on,location,comment,created_at')
    .order('taken_on', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    galleryStatus.textContent = ['42P01', 'PGRST205'].includes(error.code)
      ? 'Supabaseのアルバム設定がまだ完了していません。'
      : `写真を読み込めませんでした: ${error.message}`;
    return;
  }

  state.memories = data || [];
  const locations = [...new Set(state.memories.map((memory) => memory.location?.trim()).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, 'ja'));
  renderLocationSuggestions(locations, 'memory-location-suggestions', 'memory-location');
  renderLocationSuggestions(locations, 'location-suggestions', 'filter-location', renderMemories);
  const ownedIds = new Set(state.memories.filter(isMemoryOwner).map((memory) => memory.id));
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
    const matchesScope = showOthers || isMemoryOwner(memory);
    const matchesDate = !date || memory.taken_on === date;
    const matchesLocation = !location || (memory.location || '').toLocaleLowerCase('ja').includes(location);
    return matchesScope && matchesDate && matchesLocation;
  });
}

async function createMemoryCard(memory) {
  const isOwner = isMemoryOwner(memory);
  const authorLabel = isOwner ? '自分' : authorDisplay(memory.author_name);
  const locationLabel = memory.location || '場所未設定';
  const article = document.createElement('article');
  article.className = `memory-card ${isOwner ? 'is-owner' : 'is-shared'}`;

  if (isOwner) {
    const selectionLabel = document.createElement('label');
    selectionLabel.className = 'memory-select';
    selectionLabel.setAttribute('aria-label', `${locationLabel}の写真を選択`);
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
  photoButton.setAttribute('aria-label', `${authorLabel}が保存した${locationLabel}の写真を拡大表示`);

  const image = document.createElement('img');
  image.alt = `${locationLabel}の思い出`;
  image.loading = 'lazy';
  try {
    image.src = await signedPhotoUrl(memory.thumbnail_path || memory.storage_path);
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
  updateLocationSuggestionState('location-suggestions', 'filter-location');
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

async function openPhoto(memory, imageUrl) {
  state.selectedMemory = memory;
  byId('dialog-image').src = imageUrl;
  byId('dialog-image').alt = `${memory.location || '場所未設定'}の思い出`;
  byId('dialog-location').textContent = memory.location || '場所未設定';
  byId('dialog-date').textContent = formatDate(memory.taken_on) || '撮影日未設定';
  byId('dialog-comment').textContent = memory.comment || '';
  byId('dialog-author').textContent = isMemoryOwner(memory)
    ? '自分が保存'
    : `${authorDisplay(memory.author_name)} さんが保存`;
  byId('photo-edit-button').hidden = !isMemoryOwner(memory);
  byId('photo-dialog').showModal();
  try {
    const fullImageUrl = await signedPhotoUrl(memory.storage_path);
    if (state.selectedMemory?.id === memory.id && byId('photo-dialog').open) {
      byId('dialog-image').src = fullImageUrl;
    }
  } catch {}
}

function openEdit(memory) {
  if (!isMemoryOwner(memory)) return;
  byId('edit-id').value = memory.id;
  byId('edit-date').value = memory.taken_on || '';
  byId('edit-location').value = memory.location || '';
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
        const thumbnailFile = await createThumbnail(compressedFile);
        const fileId = crypto.randomUUID();
        const path = `${state.user.id}/${fileId}-${safeFileName(compressedFile.name)}`;
        const thumbnailPath = `${state.user.id}/thumbnails/${fileId}.jpg`;
        showMessage(uploadMessage, `${files.length}枚中${index + 1}枚目をアップロードしています。`);
        const { error: storageError } = await client.storage.from(BUCKET_NAME).upload(path, compressedFile, {
          cacheControl: '3600',
          contentType: compressedFile.type,
          upsert: false
        });
        if (storageError) throw storageError;

        const { error: thumbnailError } = await client.storage.from(BUCKET_NAME).upload(thumbnailPath, thumbnailFile, {
          cacheControl: '3600',
          contentType: thumbnailFile.type,
          upsert: false
        });
        if (thumbnailError) {
          await client.storage.from(BUCKET_NAME).remove([path]);
          throw thumbnailError;
        }

        const { error: databaseError } = await client.from(TABLE_NAME).insert({
          user_id: state.user.id,
          author_name: currentUserName(),
          storage_path: path,
          thumbnail_path: thumbnailPath,
          photo_url: authenticatedPhotoUrl(path),
          taken_on: byId('memory-date').value || null,
          location: byId('memory-location').value.trim() || null,
          comment: byId('memory-comment').value.trim() || null
        });
        if (databaseError) {
          await client.storage.from(BUCKET_NAME).remove([path, thumbnailPath]);
          throw databaseError;
        }
        savedCount += 1;
      } catch (error) {
        failures.push(`${file.name}: ${error.message}`);
      }
    }

    byId('upload-form').reset();
  updateLocationSuggestionState('memory-location-suggestions', 'memory-location');
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
    taken_on: byId('edit-date').value || null,
    location: byId('edit-location').value.trim() || null,
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

  const paths = [memory.storage_path, memory.thumbnail_path].filter(Boolean);
  const { error: storageError } = await client.storage.from(BUCKET_NAME).remove(paths);
  if (storageError) return showMessage(editMessage, `写真を削除できませんでした: ${storageError.message}`, 'error');

  const { error: databaseError } = await client.from(TABLE_NAME).delete().eq('id', memory.id);
  if (databaseError) return showMessage(editMessage, `記録を削除できませんでした: ${databaseError.message}`, 'error');
  byId('edit-dialog').close();
  await loadMemories();
}

async function deleteSelectedMemories() {
  const memories = state.memories.filter((memory) => state.selectedIds.has(memory.id) && isMemoryOwner(memory));
  if (!memories.length || !confirm(`選択した${memories.length}枚をアルバムから削除しますか？`)) return;

  const button = byId('delete-selected-button');
  button.disabled = true;
  galleryStatus.hidden = false;
  galleryStatus.textContent = `${memories.length}枚を削除しています。`;
  try {
    const paths = memories.flatMap((memory) => [memory.storage_path, memory.thumbnail_path]).filter(Boolean);
    const { error: storageError } = await client.storage.from(BUCKET_NAME).remove(paths);
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

byId('nickname-login').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-nickname]');
  if (!button) return;
  await selectNickname(button.dataset.nickname);
});

byId('auth-back-button').addEventListener('click', showNicknameSelection);
byId('password-visibility-button').addEventListener('click', () => {
  setPasswordVisibility(byId('auth-password').type === 'password');
});
byId('auth-mode-button').addEventListener('click', () => {
  if (state.authMode === AUTH_MODES.REGISTER || state.authMode === AUTH_MODES.SIGN_IN) {
    setAuthMode(AUTH_MODES.SIGN_IN_WITH_EMAIL);
  } else {
    setAuthMode(state.memberRegistered ? AUTH_MODES.SIGN_IN : AUTH_MODES.REGISTER);
  }
  (byId('auth-email-field').hidden ? byId('auth-password') : byId('auth-email')).focus();
});
byId('password-reset-button').addEventListener('click', async () => {
  const email = (state.authMode === AUTH_MODES.SIGN_IN ? selectedAuthEmail() : byId('auth-email').value).trim().toLowerCase();
  if (!email) {
    showMessage(authMessage, 'メール アドレスを入力してください。', 'error');
    byId('auth-email').focus();
    return;
  }

  const button = byId('password-reset-button');
  button.disabled = true;
  showMessage(authMessage);
  try {
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: window.location.href.split('?')[0] });
    if (error) throw error;
    showMessage(authMessage, 'パスワード再設定メールを送信しました。最新のメールに記載されたリンクを開いてください。', 'success');
  } catch (error) {
    const message = error.message.toLowerCase().includes('email rate limit exceeded')
      ? '短時間に複数回送信されました。しばらく待ってから、もう一度お試しください。'
      : `再設定メールを送信できませんでした: ${error.message}`;
    showMessage(authMessage, message, 'error');
  } finally {
    button.disabled = false;
  }
});
byId('credential-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const nickname = state.selectedNickname;
  const email = (state.authMode === AUTH_MODES.SIGN_IN ? selectedAuthEmail() : byId('auth-email').value).trim().toLowerCase();
  const password = byId('auth-password').value;
  const requiresPasswordConfirmation = state.authMode === AUTH_MODES.REGISTER || state.authMode === AUTH_MODES.RECOVERY;
  if (requiresPasswordConfirmation && password !== byId('auth-password-confirm').value) {
    showMessage(authMessage, 'パスワードが一致しません。もう一度入力してください。', 'error');
    byId('auth-password-confirm').focus();
    return;
  }
  const submitButton = byId('auth-submit-button');
  submitButton.disabled = true;
  showMessage(authMessage);

  try {
    if (state.authMode === AUTH_MODES.RECOVERY) {
      const { data, error } = await client.auth.updateUser({ password });
      if (error) throw error;
      showMessage(authMessage, 'パスワードを更新しました。', 'success');
      await setSignedIn(data.user);
      return;
    }

    if (state.authMode === AUTH_MODES.REGISTER) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { name: nickname },
          emailRedirectTo: window.location.href.split('?')[0]
        }
      });
      if (error) throw error;
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        showMessage(authMessage, 'このメール アドレスは別の認証で登録済みです。初回登録には別のメール アドレスを使用してください。', 'error');
        return;
      }
      rememberAuthEmail(nickname, email);
      if (!data.session) {
        showMessage(authMessage, '確認メールを送信しました。メール内のリンクを開いて登録を完了してください。', 'success');
      }
      return;
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user.user_metadata?.name?.toLowerCase() !== nickname) {
      await client.auth.signOut();
      throw new Error('選択したユーザーとメール アドレスが一致しません。');
    }
    rememberAuthEmail(nickname, email);
  } catch (error) {
    showMessage(authMessage, `認証できませんでした: ${error.message}`, 'error');
  } finally {
    submitButton.disabled = false;
  }
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
byId('memory-location').addEventListener('input', () => {
  updateLocationSuggestionState('memory-location-suggestions', 'memory-location');
});
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

client.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY' && session?.user) {
    showPasswordRecovery(session.user);
    return;
  }
  if (state.authMode === AUTH_MODES.RECOVERY) return;
  if (session?.user && !session.user.is_anonymous) {
    const nickname = session.user.user_metadata?.name?.toLowerCase();
    if (!state.selectedNickname || nickname === state.selectedNickname) setSignedIn(session.user);
  } else if (!session?.user) setSignedOut();
});

client.auth.getSession().then(({ data }) => {
  if (data.session?.user?.is_anonymous) client.auth.signOut();
  else if (data.session?.user) {
    if (state.authMode !== AUTH_MODES.RECOVERY) setSignedIn(data.session.user);
  } else if (state.authMode !== AUTH_MODES.RECOVERY) setSignedOut();
});
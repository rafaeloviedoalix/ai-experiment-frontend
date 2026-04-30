<script lang="ts" setup>
import { ref } from 'vue'
import { ApPrimaryButton, ApSecondaryButton, ApInfoBanner } from '@ap-platforms/vue-components'
import ApModal from '@/components/shared/ApModal/ApModal.vue'
import { useRosterStore } from '@/stores/roster.store'

const store      = useRosterStore()
const stagedFile = ref<File | null>(null)
const isDragOver = ref(false)
const fileInput  = ref<HTMLInputElement | null>(null)

const MAX_BYTES = 15 * 1024 * 1024
const ACCEPTED  = ['xlsx', 'xls', 'csv']

function stageFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ACCEPTED.includes(ext ?? '')) return
  if (file.size > MAX_BYTES) return
  stagedFile.value = file
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file) stageFile(file)
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) stageFile(file)
}

function removeFile() {
  stagedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

function formatSize(bytes: number) {
  return bytes < 1_048_576
    ? (bytes / 1024).toFixed(1) + ' KB'
    : (bytes / 1_048_576).toFixed(2) + ' MB'
}

async function submit() {
  if (!stagedFile.value) return
  await store.upload(stagedFile.value)
}
</script>

<template>
  <ApModal title="Upload roster" :is-open="true" data-testId="roster-upload-modal" @close="store.closeModal()">
    <div class="roster-upload">

      <ApInfoBanner
        v-if="store.uploadError"
        type="error"
        :text="store.uploadError"
        data-testId="roster-upload-error-banner"
      />

      <div
        class="dropzone"
        :class="{ 'dropzone--over': isDragOver }"
        data-testId="roster-dropzone"
        @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false"
        @drop="onDrop"
      >
        <ApSecondaryButton
          text="Browse file"
          size="small"
          data-testId="roster-dropzone-browse-btn"
          @click="fileInput?.click()"
        />
        <p class="dropzone__hint">
          or drag your file<br>
          <span>xlsx, csv file up to 15MB</span>
        </p>
        <input
          ref="fileInput"
          type="file"
          accept=".xlsx,.xls,.csv"
          class="hidden-input"
          data-testId="roster-file-input"
          @change="onFileChange"
        />
      </div>

      <div v-if="stagedFile" class="staged-file" data-testId="roster-staged-file-row">
        <span class="staged-file__icon">📄</span>
        <div class="staged-file__info">
          <span class="staged-file__name" data-testId="roster-staged-file-name">{{ stagedFile.name }}</span>
          <span class="staged-file__size" data-testId="roster-staged-file-size">{{ formatSize(stagedFile.size) }}</span>
        </div>
        <button class="staged-file__remove" data-testId="roster-staged-file-remove-btn" @click="removeFile">✕</button>
      </div>

      <div class="roster-upload__actions">
        <ApPrimaryButton
          text="Cancel"
          variant="cancel"
          data-testId="roster-upload-cancel-btn"
          @click="store.closeModal()"
        />
        <ApPrimaryButton
          text="Upload roster"
          :disabled="!stagedFile"
          data-testId="roster-upload-submit-btn"
          @click="submit"
        />
      </div>
    </div>
  </ApModal>
</template>

<style lang="scss" scoped>
.roster-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 340px;

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

.dropzone {
  border: 2px dashed ap(lines-gray);
  border-radius: 8px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: border-color 0.15s, background 0.15s;

  &--over {
    border-color: ap(green-3);
    background: ap(green-1);
  }

  &__hint {
    font-size: 12px;
    color: ap(alix-gray);
    text-align: center;
    margin: 0;
    line-height: 1.6;
    span { opacity: 0.7; }
  }
}

.staged-file {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: ap(row);
  border: 1px solid ap(lines-gray);
  border-radius: 6px;

  &__icon  { font-size: 18px; }
  &__info  { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  &__name  { font-size: 13px; color: ap(dark-text); font-weight: 500; }
  &__size  { font-size: 11px; color: ap(alix-gray); }

  &__remove {
    background: none;
    border: none;
    color: ap(alix-gray);
    cursor: pointer;
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 4px;

    &:hover { background: ap(red-1); color: ap(red-2); }
  }
}

.hidden-input { display: none; }
</style>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ApPrimaryButton, ApSecondaryButton, ApSelect } from '@ap-platforms/vue-components'
import ApModal from '@/components/shared/ApModal/ApModal.vue'
import { useFinancialStore } from '@/stores/financial.store'

const store = useFinancialStore()

const year       = ref('')
const stagedFile = ref<File | null>(null)
const isDragOver = ref(false)
const fileInput  = ref<HTMLInputElement | null>(null)

const yearOptions = (() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => {
    const y = `FY${current - i}`
    return { label: y, value: String(current - i) }
  })
})()

const isReady   = computed(() => year.value && stagedFile.value)
const MAX_BYTES = 15 * 1024 * 1024

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

function stageFile(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!['xls', 'xlsx', 'pdf'].includes(ext ?? '')) return
  if (file.size > MAX_BYTES) return
  stagedFile.value = file
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

function onYearChange(val: string | undefined) { year.value = val ?? '' }

async function submit() {
  if (!isReady.value) return
  await store.uploadFile(year.value, stagedFile.value!)
}
</script>

<template>
  <ApModal title="Upload 10-K file" :is-open="true" @close="store.closeModal()">
    <div class="upload-modal" data-testId="financial-upload-modal">

      <ApSelect
        :model-value="year"
        :items="yearOptions"
        label="10-K year"
        placeholder="Select year"
        item-label="label"
        item-value="value"
        :required="true"
        data-testId="financial-upload-year-select"
        @update:model-value="onYearChange"
      />

      <div
        class="dropzone"
        :class="{ 'dropzone--over': isDragOver }"
        data-testId="financial-upload-dropzone"
        @dragover.prevent="isDragOver = true"
        @dragleave="isDragOver = false"
        @drop="onDrop"
      >
        <ApSecondaryButton
          text="Browse file"
          size="small"
          data-testId="financial-upload-browse-btn"
          @click="fileInput?.click()"
        />
        <p class="dropzone__hint">or drag your file<br><span>PDF file up to 15MB</span></p>
        <input ref="fileInput" type="file" accept=".xls,.xlsx,.pdf" class="hidden-input" @change="onFileChange" />
      </div>

      <div v-if="stagedFile" class="staged-file" data-testId="financial-upload-staged-file-row">
        <span class="staged-file__icon">📄</span>
        <div class="staged-file__info">
          <span class="staged-file__name">{{ stagedFile.name }}</span>
          <span class="staged-file__size">{{ formatSize(stagedFile.size) }}</span>
        </div>
        <button class="staged-file__remove" @click="removeFile">✕</button>
      </div>

      <div class="upload-modal__actions">
        <ApPrimaryButton text="Cancel" variant="cancel" data-testId="financial-upload-cancel-btn" @click="store.closeModal()" />
        <ApPrimaryButton text="Pull 10-K" :disabled="!isReady" data-testId="financial-upload-submit-btn" @click="submit" />
      </div>
    </div>
  </ApModal>
</template>

<style lang="scss" scoped>
.upload-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 340px;

  &__actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 4px;
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

  &--over { border-color: ap(green-3); background: ap(green-1); }

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

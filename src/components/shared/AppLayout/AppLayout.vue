<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ApPrimaryButton } from '@ap-platforms/vue-components'
import { useRosterStore }    from '@/stores/roster.store'
import { useFinancialStore } from '@/stores/financial.store'

const route  = useRoute()
const router = useRouter()
const rosterStore    = useRosterStore()
const financialStore = useFinancialStore()

const companyName   = ref('Company alias name')
const isEditingName = ref(false)
const nameInputRef  = ref<HTMLInputElement | null>(null)

const tabs = [
  { label: 'Roster Analysis',    route: '/roster'     },
  { label: 'Financial Data Pull', route: '/financial' },
  { label: 'Integrated Analysis', route: '/integrated' },
]

const activeRoute = computed(() => route.path)

const ctaLabel = computed(() =>
  activeRoute.value === '/roster' ? 'Upload roster' : 'Upload 10-K'
)

function onCtaClick() {
  if (activeRoute.value === '/roster') {
    rosterStore.openModal()
  } else {
    financialStore.openReimportModal()
  }
}

function startEditName() {
  isEditingName.value = true
  setTimeout(() => nameInputRef.value?.focus(), 50)
}

function commitName() {
  isEditingName.value = false
  if (!companyName.value.trim()) companyName.value = 'Company alias name'
}
</script>

<template>
  <div class="app-layout">

    <!-- Navbar -->
    <nav class="navbar" data-testId="app-navbar">
      <div class="navbar__left">
        <div class="navbar__logo" data-testId="app-navbar-logo">
          <span>AP</span>
        </div>
        <div class="navbar__divider" />
        <span class="navbar__project" data-testId="app-navbar-project-name">Project Name</span>
      </div>
      <div class="navbar__right">
        <button class="navbar__icon-btn" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" stroke="#ccc" stroke-width="1.5" fill="none"/>
            <circle cx="10" cy="17" r="1.5" fill="#ccc"/>
          </svg>
        </button>
        <button class="navbar__icon-btn" aria-label="Help">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#ccc" stroke-width="1.5"/>
            <text x="7.5" y="15" font-size="13" font-weight="600" fill="#ccc" font-family="Roboto">?</text>
          </svg>
        </button>
        <div class="navbar__avatar" data-testId="app-navbar-avatar">JB</div>
      </div>
    </nav>

    <!-- Page header -->
    <div class="page-header">
      <div class="page-header__title">
        <h1
          v-if="!isEditingName"
          class="company-name"
          data-testId="app-company-name-heading"
          @click="startEditName"
        >
          {{ companyName }}
        </h1>
        <input
          v-else
          ref="nameInputRef"
          v-model="companyName"
          class="company-name-input"
          data-testId="app-company-name-input"
          @blur="commitName"
          @keydown.enter="commitName"
        />
      </div>

      <ApPrimaryButton
        v-if="activeRoute !== '/integrated'"
        :text="ctaLabel"
        data-testId="app-cta-btn"
        @click="onCtaClick"
      />
    </div>

    <!-- Tab bar -->
    <div class="tab-bar" data-testId="app-tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.route"
        class="tab-bar__tab"
        :class="{ 'tab-bar__tab--active': activeRoute === tab.route }"
        :data-testId="`app-tab-${tab.route.replace('/', '')}`"
        @click="router.push(tab.route)"
      >
        {{ tab.label.toUpperCase() }}
      </button>
    </div>

    <!-- Content -->
    <main class="page-content">
      <slot />
    </main>

  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ap(background);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ap(black-2);
  padding: 0 20px;
  height: 48px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;

  &__left {
    display: flex;
    align-items: center;
    gap: 0;
  }

  &__logo {
    width: 36px;
    height: 36px;
    background: ap(alix-green);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    color: ap(white-1);
    cursor: pointer;
    flex-shrink: 0;
  }

  &__divider {
    width: 1px;
    height: 28px;
    background: ap(alix-green);
    margin: 0 14px;
    flex-shrink: 0;
  }

  &__project {
    color: rgba(255, 255, 255, 0.85);
    font-size: 13px;
    font-weight: 500;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    transition: background 0.15s;

    &:hover { background: rgba(255, 255, 255, 0.1); }
  }

  &__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ap(alix-green);
    color: ap(white-1);
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
  }
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px 0;
  background: ap(white-1);

  &__title { display: flex; align-items: center; }
}

.company-name {
  font-size: 20px;
  font-weight: 700;
  color: ap(black-text);
  margin: 0;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover { background: ap(background); }
}

.company-name-input {
  font-size: 20px;
  font-weight: 700;
  color: ap(black-text);
  border: 1.5px solid ap(green-3);
  border-radius: 4px;
  padding: 4px 6px;
  outline: none;
  background: ap(white-1);
  font-family: 'Roboto', sans-serif;
}

.tab-bar {
  display: flex;
  padding: 0 24px;
  background: ap(white-1);
  border-bottom: 1px solid ap(lines-gray);

  &__tab {
    padding: 10px 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: ap(alix-gray);
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    margin-bottom: -1px;
    font-family: 'Roboto', sans-serif;
    transition: color 0.15s, border-color 0.15s;

    &:hover { color: ap(green-4); }

    &--active {
      color: ap(green-4);
      font-weight: 700;
      border-bottom-color: ap(green-4);
    }
  }
}

.page-content {
  flex: 1;
  padding: 24px;
}
</style>

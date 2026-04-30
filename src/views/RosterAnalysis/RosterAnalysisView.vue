<script lang="ts" setup>
import AppLayout            from '@/components/shared/AppLayout/AppLayout.vue'
import RosterEmptyState     from '@/components/roster/RosterEmptyState/RosterEmptyState.vue'
import RosterLoadingOverlay from '@/components/roster/RosterLoadingOverlay/RosterLoadingOverlay.vue'
import RosterFilterBar      from '@/components/roster/RosterFilterBar/RosterFilterBar.vue'
import RosterKpiCards       from '@/components/roster/RosterKpiCards/RosterKpiCards.vue'
import RosterDataTable      from '@/components/roster/RosterDataTable/RosterDataTable.vue'
import RosterUploadModal    from '@/components/roster/RosterUploadModal/RosterUploadModal.vue'
import { useRosterStore }   from '@/stores/roster.store'

const store = useRosterStore()
</script>

<template>
  <AppLayout>
    <RosterLoadingOverlay v-if="store.uploadStatus === 'uploading'" />
    <RosterUploadModal    v-if="store.isModalOpen" />
    <RosterEmptyState     v-if="!store.hasData && store.uploadStatus !== 'uploading'" />
    <template v-if="store.hasData">
      <RosterFilterBar />
      <RosterKpiCards  />
      <RosterDataTable />
    </template>
  </AppLayout>
</template>

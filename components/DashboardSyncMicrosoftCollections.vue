<template>
  <div class="flex space-x-2">
    <!-- Microsoft Sync Button -->
    <button
      v-if="user?.isAdmin"
      v-pruvious-tooltip="{ content: 'Sync Microsoft collections', offset: [0, 13] }"
      @click="sync()"
      type="button"
      class="hocus:text-primary-700 flex h-8 w-8 transition"
    >
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icons-tabler-outline icon-tabler-brand-windows m-auto h-4 w-4"
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path
        d="M17.8 20l-12 -1.5c-1 -.1 -1.8 -.9 -1.8 -1.9v-9.2c0 -1 .8 -1.8 1.8 -1.9l12 -1.5c1.2 -.1 2.2 .8 2.2 1.9v12.1c0 1.2 -1.1 2.1 -2.2 1.9z"
      />
      <path d="M12 5l0 14" />
      <path d="M4 12l16 0" />
    </svg>
  </button>

  <!-- Theme Configuration Button -->
  <NuxtLink
    to="/dashboard/theme-config"
    v-pruvious-tooltip="{ content: 'Theme Configuration', offset: [0, 13] }"
    class="hocus:text-primary-700 flex h-8 w-8 transition"
  >
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler m-auto h-4 w-4"
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
      <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
      <path d="M19 11h2m-1 -1v2" />
    </svg>
  </NuxtLink>
</div>
</template>

<script lang="ts" setup>
import { isObject } from '#pruvious'
import { getRawToken, useUser } from '#pruvious/client'
import { pruviousToasterShow } from '#pruvious/dashboard'

const user = useUser()

async function sync() {
  const response = await $fetch('/api/sync-microsoft-collections', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getRawToken()}`,
    },
    onResponseError: ({ response }) => pruviousToasterShow({ message: response._data, type: 'error' }),
  }).catch(() => null)

  if (isObject(response)) {
    const { created, updated, errors } = response
    pruviousToasterShow({
      message: `Sync successful<br>(created: ${created.length}, updated: ${updated.length}, errors: ${Object.keys(errors).length})`,
    })
  }
}
</script>

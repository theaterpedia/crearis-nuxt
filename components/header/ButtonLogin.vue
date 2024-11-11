<script lang="ts" setup>
const NuxtLink = resolveComponent('NuxtLink')

const { isAuthenticated } = useAuth()
</script>

<template>
  <!-- <ClientOnly> -->
  <SfButton
    :tag="NuxtLink"
    :to="isAuthenticated ? '/my-account/personal-data' : '/login'"
    square
    variant="tertiary"
    class="hover:bg-primary-800 active:bg-primary-900 -ml-0.5 mr-1 rounded-md text-white hover:text-white active:text-white"
  >
    <template #prefix>
      <SfIconShoppingCart />
    </template>
  </SfButton>
  <!-- 
    <template #fallback>
      <SfButton
        class="group relative text-white hover:text-white active:text-white hover:bg-primary-800 active:bg-primary-900 rounded-md"
        variant="tertiary"
        square
      >
        <template #prefix>
          <Icon name="ion:person-outline" size="22px" />
        </template>
      </SfButton>
    </template>
  </ClientOnly> -->
</template>

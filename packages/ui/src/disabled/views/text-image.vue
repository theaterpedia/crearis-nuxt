<template>
  <Box layout="full-width">
    <Main>
      <!-- Example 1: Basic text-image with centered content -->
      <TextImage
        :contentAlignY="contentAlignY"
        :heightTmp="height"
        :imgTmpAlignX="imgTmpAlignX"
        :imgTmpAlignY="imgTmpAlignY"
        imgTmp="https://pruvious.com/uploads/dasei/banner.jpg"
      >
        <Prose>
          <h1><strong>Einstiege ins Theaterspiel</strong></h1>
          <p>
            <strong>Fortbildung in 6 Wochenenden:</strong>
            <br />
            Elementare und Szenische Animation
          </p>
          <p>Juni – Dezember 2023 // München, Nürnberg</p>
          <Button size="small" variant="plain">Jetzt anmelden</Button>
        </Prose>
      </TextImage>

      <!-- Example 2: Text-image with different alignment -->
      <TextImage
        :heightTmp="height"
        :imgTmpAlignX="imgTmpAlignX"
        :imgTmpAlignY="imgTmpAlignY"
        contentAlignY="top"
        imgTmp="https://dasei.eu/web/image/website/4/logo/DAS%20Ei?unique=52a580a"
      >
        <Prose>
          <h2><strong>Theaterpädagogik im Web</strong></h2>
          <p>Wir sehen Sichtbarkeit und Vernetzung im Web als Existenz-Thema</p>
          <ul>
            <li>Theaterpedia arbeitet an Lösungen</li>
            <li>Bamberg, Augsburg, Kassel, Nürnberg, Würzburg</li>
            <li>Professionelle Websites für Theaterpädagogen</li>
          </ul>
          <Button size="medium" variant="plain">Mehr erfahren</Button>
        </Prose>
      </TextImage>

      <!-- Example 3: Text-image with custom media slot -->
      <TextImage
        :heightTmp="height"
        contentAlignY="bottom"
      >
        <template #default>
          <Prose>
            <h1>Websites dringend gesucht!</h1>
            <p><strong>Custom Media Slot Example</strong></p>
            <p>
              This example uses the media slot instead of an image URL,
              allowing you to place any custom content in the right column.
            </p>
            <Button size="small">Learn More</Button>
          </Prose>
        </template>
        
        <template #media>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white;">
            <div style="text-align: center; padding: 2rem;">
              <h2 style="font-size: 3rem; margin: 0;">Custom</h2>
              <p style="font-size: 1.5rem;">Media Slot</p>
            </div>
          </div>
        </template>
      </TextImage>
    </Main>

    <button @click="settingsVisible = !settingsVisible" class="toggle">
      <svg
        fill="none"
        height="1rem"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="1rem"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>

    <div v-if="settingsVisible" class="settings">
      <Form>
        <fieldset>
          <legend>HEIGHT</legend>
          <RadioGroup
            v-model="height"
            :choices="[
              { label: 'Full', value: 'full' },
              { label: 'Prominent', value: 'prominent' },
              { label: 'Medium', value: 'medium' },
              { label: 'Mini', value: 'mini' },
            ]"
            name="height"
          />
        </fieldset>

        <fieldset>
          <legend>IMAGE ALIGN X</legend>
          <RadioGroup
            v-model="imgTmpAlignX"
            :choices="[
              { label: 'Left', value: 'left' },
              { label: 'Right', value: 'right' },
              { label: 'Center', value: 'center' },
              { label: 'Stretch', value: 'stretch' },
              { label: 'Cover', value: 'cover' },
            ]"
            name="imgTmpAlignX"
          />
        </fieldset>

        <fieldset>
          <legend>IMAGE ALIGN Y</legend>
          <RadioGroup
            v-model="imgTmpAlignY"
            :choices="[
              { label: 'Top', value: 'top' },
              { label: 'Bottom', value: 'bottom' },
              { label: 'Center', value: 'center' },
              { label: 'Stretch', value: 'stretch' },
              { label: 'Cover', value: 'cover' },
            ]"
            name="imgTmpAlignY"
          />
        </fieldset>

        <fieldset>
          <legend>CONTENT ALIGN Y</legend>
          <RadioGroup
            v-model="contentAlignY"
            :choices="[
              { label: 'Top', value: 'top' },
              { label: 'Center', value: 'center' },
              { label: 'Bottom', value: 'bottom' },
            ]"
            name="contentAlignY"
          />
        </fieldset>
      </Form>
    </div>
  </Box>
</template>

<script lang="ts" setup>
import { Box, Button, Form, Main, Prose, RadioGroup, TextImage } from '@/index'
import { ref } from 'vue'

const settingsVisible = ref(true)
const height = ref<'full' | 'prominent' | 'medium' | 'mini'>('prominent')
const imgTmpAlignX = ref<'left' | 'right' | 'center' | 'stretch' | 'cover'>('center')
const imgTmpAlignY = ref<'top' | 'bottom' | 'center' | 'stretch' | 'cover'>('center')
const contentAlignY = ref<'top' | 'bottom' | 'center'>('center')
</script>

<style scoped>
.toggle {
  position: fixed;
  z-index: 1;
  top: 1rem;
  right: 1rem;
}

.settings {
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
  width: 24rem;
  max-width: calc(100% - 1rem);
  max-height: calc(100% - 1rem);
  overflow-y: auto;
  background-color: oklch(from var(--color-card-bg) l c h / 70%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-card-contrast);
  padding: 1rem;
}
</style>

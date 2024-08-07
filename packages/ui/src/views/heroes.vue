<template>
  <Box layout="full-width">
    <Main>
      <Hero
        :contentAlignY="contentAlignY"
        :imgTmpAlignX="imgTmpAlignX"
        :imgTmpAlignY="imgTmpAlignY"
        contentType="banner"
        imgTmp="https://pruvious.com/uploads/dasei/banner.jpg"
      >
        <Banner transparent>
          <Prose>
            <h1>
              Juni – Dezember 2023 // München, Nürnberg
              <strong>Einstiege ins Theaterspiel</strong>
            </h1>
            <p>
              <strong>Fortbildung in 6 Wochenenden:</strong>
              <br />
              <strong>Elementare und Szenische Animation</strong>
            </p>
            <Button size="small" variant="plain">Jetzt anmelden</Button>
          </Prose>
        </Banner>
      </Hero>

      <Hero
        :contentAlignY="contentAlignY"
        :imgTmpAlignX="imgTmpAlignX"
        :imgTmpAlignY="imgTmpAlignY"
        :overlay="overlay"
        contentWidth="full"
        imgTmp="https://pruvious.com/uploads/dasei/banner.jpg"
      >
        <Columns :align="columnsAlign">
          <Column>
            <Prose>
              <h1><strong>Websites Theaterpädagogik dringend gesucht!</strong></h1>
              <p>Wir sehen Sichtbarkeit und Vernetzung im Web als Existenz-Thema</p>
              <ul>
                <li>Theaterpedia arbeitet an Lösungen</li>
                <li>Bamberg, Augsburg, Kassel, Nürnberg, Würzburg ...</li>
              </ul>
            </Prose>
          </Column>
          <Column>
            <img src="https://dasei.eu/web/image/website/4/logo/DAS%20Ei?unique=52a580a" />
          </Column>
        </Columns>
      </Hero>
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
          <legend>COVER ALIGN X</legend>
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
          <legend>COVER ALIGN Y</legend>
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

        <fieldset>
          <legend>COVER (2ND HERO)</legend>
          <Input v-model="overlay" label="Overlay" name="overlay" type="text" />
        </fieldset>

        <fieldset>
          <legend>COLUMNS ALIGN Y (2ND HERO)</legend>
          <RadioGroup
            v-model="columnsAlign"
            :choices="[
              { label: 'Top', value: 'top' },
              { label: 'Center', value: 'center' },
              { label: 'Bottom', value: 'bottom' },
            ]"
            name="columnsAlign"
          />
        </fieldset>
      </Form>
    </div>
  </Box>
</template>

<script lang="ts" setup>
import { Banner, Box, Button, Column, Columns, Form, Hero, Input, Main, Prose, RadioGroup } from '@/index'
import { ref } from 'vue'

const settingsVisible = ref(true)
const overlay = ref<string>(
  'linear-gradient(70deg, rgb(255, 193, 7) 18%, rgba(255, 255, 255, 0.62) 61%, rgba(255, 255, 255, 0.84) 81%)',
)
const imgTmpAlignX = ref<'left' | 'right' | 'center' | 'stretch' | 'cover'>('center')
const imgTmpAlignY = ref<'top' | 'bottom' | 'center' | 'stretch' | 'cover'>('stretch')
const contentAlignY = ref<'top' | 'bottom' | 'center'>('bottom')
const columnsAlign = ref<'top' | 'center' | 'bottom'>('center')
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
  background-color: hsl(var(--card) / 70%);
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  color: hsl(var(--card-foreground));
  padding: 1rem;
}
</style>

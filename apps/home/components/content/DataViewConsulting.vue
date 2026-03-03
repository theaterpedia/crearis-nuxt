<template>
  <div>
    <SectionContainer background="accent">
      <Heading
        :content="consulting.presetConfig.title"
        is="h3"
      />
      <p class="text-neutral-600 mt-2">{{ consulting.presetConfig.description }}</p>
    </SectionContainer>

    <!-- Stepper Navigation -->
    <StepperRoot v-model="consulting.state.step" class="flex gap-2 w-full pt-2 pb-14 bg-accent">
      <StepperItem
        v-for="(step, index) in steps"
        :key="index"
        :step="index + 1"
        :completed="index + 1 < consulting.state.step"
        :disabled="index === steps.length - 1"
        class="w-full flex justify-center gap-2 cursor-pointer group data-[disabled]:pointer-events-none relative px-4"
        :title="step.title"
      >
        <StepperTrigger 
          aria-describedby="undefined" 
          class="inline-flex items-center fill-neutral-400 group-data-[disabled]:fill-neutral-600 group-data-[state=completed]:fill-primary group-data-[state=active]:fill-primary-contrast justify-center rounded-full w-10 h-10 shrink-0 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
        >
          <StepperIndicator 
            :step="index" 
            class="bg-neutral-200 group-data-[disabled]:bg-accent group-data-[state=completed]:bg-neutral-50 group-data-[state=active]:bg-primary"
          >
            <SfIconCalendar v-if="index === 0" size="lg" />
            <SfIconPerson v-else-if="index === 1" size="lg" />
            <SfIconCheck v-else size="lg" />
          </StepperIndicator>
          <div class="absolute text-center top-full left-0 w-full mt-2">
            <StepperTitle 
              :class="index + 1 === consulting.state.step ? 'text-primary' : 'text-neutral-300'" 
              class="font-medium text-neutral-400 group-data-[disabled]:text-neutral-600"
            >
              {{ step.title }}
            </StepperTitle>
          </div>
        </StepperTrigger>
        <StepperSeparator 
          v-if="index < steps.length - 1"
          class="absolute block top-4 left-[calc(50%+30px)] right-[calc(-50%+20px)] h-0.5 rounded-full group-data-[disabled]:bg-neutral-700 bg-neutral-500 group-data-[state=completed]:bg-primary shrink-0"
        />
      </StepperItem>
    </StepperRoot>

    <SectionContainer>
      <Columns gap="medium">
        <!-- Left: Info/Context -->
        <Column>
          <div class="bg-neutral-50 p-6 rounded-lg">
            <Prose>
              <h2>Online-Beratung buchen</h2>
              <p>
                Wähle einen freien Termin für ein 15-minütiges Beratungsgespräch. 
                Nach der Buchung erhältst du eine Bestätigung mit dem Video-Call-Link per E-Mail.
              </p>
              <h3>So funktioniert's</h3>
              <ol>
                <li>Wähle einen passenden Termin</li>
                <li>Gib deine Kontaktdaten ein</li>
                <li>Du erhältst eine Bestätigung per E-Mail</li>
              </ol>
            </Prose>
          </div>
        </Column>

        <!-- Right: Stepper Content -->
        <Column class="checkout-card bg-neutral-50">
          
          <!-- Step 1: Select Slot -->
          <div v-if="consulting.state.step === 1">
            <h3 class="text-lg font-bold mb-4">Termin auswählen</h3>
            
            <!-- Loading State -->
            <div v-if="consulting.isLoading.value" class="text-center py-8">
              <SfLoaderCircular size="lg" />
              <p class="mt-4 text-neutral-500">Termine werden geladen...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="consulting.error.value" class="bg-red-50 p-4 rounded-lg">
              <p class="text-red-700">{{ consulting.error.value }}</p>
              <SfButton @click="consulting.fetchSlots()" variant="secondary" class="mt-4">
                Erneut versuchen
              </SfButton>
            </div>
            
            <!-- No Slots -->
            <div v-else-if="Object.keys(consulting.slotsByDate.value).length === 0" class="text-center py-8">
              <p class="text-neutral-500">Keine freien Termine im gewählten Zeitraum.</p>
              <p class="text-sm text-neutral-400 mt-2">
                Zeitraum: {{ formatDateRange(consulting.startDate, consulting.endDate) }}
              </p>
            </div>
            
            <!-- Slots by Date -->
            <div v-else class="space-y-6">
              <div 
                v-for="(slots, dateKey) in consulting.slotsByDate.value" 
                :key="dateKey"
                class="border-b border-neutral-200 pb-4 last:border-b-0"
              >
                <h4 class="font-semibold text-neutral-700 mb-3">
                  {{ consulting.formatDate(dateKey + 'T00:00:00') }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="slot in slots"
                    :key="slot.slotKey"
                    @click="consulting.selectSlot(slot)"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 transition-all',
                      consulting.selectedSlot.value?.slotKey === slot.slotKey
                        ? 'border-primary bg-primary text-primary-contrast font-semibold'
                        : 'border-neutral-200 bg-white hover:border-primary hover:bg-primary-50'
                    ]"
                  >
                    {{ consulting.formatTime(slot.start) }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Selected Slot Summary -->
            <div v-if="consulting.selectedSlot.value" class="mt-6 p-4 bg-primary-50 rounded-lg border border-primary">
              <p class="font-semibold">Ausgewählter Termin:</p>
              <p class="text-lg">
                {{ consulting.formatDate(consulting.selectedSlot.value.start) }}, 
                {{ consulting.formatTime(consulting.selectedSlot.value.start) }} Uhr
              </p>
              <p class="text-sm text-neutral-600">
                mit {{ consulting.selectedSlot.value.hostName }}
              </p>
            </div>
            
            <!-- Navigation -->
            <div class="flex justify-end mt-6">
              <SfButton 
                @click="consulting.nextStep()"
                :disabled="!consulting.canProceedToContact.value"
                style="background-color: var(--color-primary-bg); color: var(--color-primary-contrast)"
              >
                Weiter
              </SfButton>
            </div>
          </div>
          
          <!-- Step 2: Contact Information -->
          <div v-else-if="consulting.state.step === 2">
            <h3 class="text-lg font-bold mb-4">Kontaktdaten</h3>
            
            <form @submit.prevent="handleContactSubmit" class="space-y-4 flex flex-col h-full">
              <div class="flex gap-4">
                <label class="flex-1">
                  <UiFormLabel>Vorname *</UiFormLabel>
                  <SfInput 
                    v-model="consulting.state.contact.vorname" 
                    name="vorname" 
                    required 
                    type="text" 
                  />
                </label>
                <label class="flex-1">
                  <UiFormLabel>Nachname *</UiFormLabel>
                  <SfInput 
                    v-model="consulting.state.contact.nachname" 
                    name="nachname" 
                    required 
                    type="text" 
                  />
                </label>
              </div>
              
              <label class="block">
                <UiFormLabel>E-Mail *</UiFormLabel>
                <SfInput 
                  v-model="consulting.state.contact.email" 
                  name="email" 
                  required 
                  type="email" 
                />
              </label>
              
              <label class="block">
                <UiFormLabel>Telefon *</UiFormLabel>
                <SfInput 
                  v-model="consulting.state.contact.mobil" 
                  name="mobil" 
                  type="tel"
                  required
                />
              </label>
              
              <label class="block flex-1 flex flex-col">
                <UiFormLabel>Anmerkungen (optional)</UiFormLabel>
                <SfTextarea 
                  v-model="consulting.state.notes" 
                  name="notes"
                  placeholder="z.B. konkrete Fragen oder Themen für das Gespräch"
                  class="flex-1 min-h-[80px]"
                />
              </label>
              
              <!-- Selected Slot Reminder -->
              <div class="p-4 bg-neutral-100 rounded-lg">
                <p class="text-sm text-neutral-600">Termin:</p>
                <p class="font-semibold">
                  {{ consulting.formatDate(consulting.selectedSlot.value!.start) }}, 
                  {{ consulting.formatTime(consulting.selectedSlot.value!.start) }} Uhr
                </p>
              </div>
              
              <!-- Navigation -->
              <div class="flex justify-between mt-6">
                <SfButton @click="consulting.prevStep()" type="button" variant="secondary">
                  <SfIconArrowBack size="sm" class="mr-1" />
                  Zurück
                </SfButton>
                <SfButton 
                  type="button"
                  @click="handleContactSubmit"
                  :disabled="!consulting.isContactValid.value || consulting.isSubmitting.value"
                  style="background-color: var(--color-primary-bg); color: var(--color-primary-contrast)"
                >
                  <SfLoaderCircular v-if="consulting.isSubmitting.value" size="sm" class="mr-2" />
                  Termin buchen
                </SfButton>
              </div>
            </form>
          </div>
          
          <!-- Step 3: Confirmation -->
          <div v-else-if="consulting.state.step === 3 || consulting.state.step === 4">
            <!-- Success -->
            <div v-if="consulting.result.value?.success" class="text-center py-8">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SfIconCheck class="w-8 h-8 text-green-600" />
              </div>
              <h3 class="text-xl font-bold text-green-700 mb-2">Termin gebucht!</h3>
              <p class="text-neutral-600 mb-4">
                Du erhältst in Kürze eine Bestätigung per E-Mail an<br>
                <strong>{{ consulting.state.contact.email }}</strong>
              </p>
              <div class="p-4 bg-neutral-100 rounded-lg inline-block">
                <p class="text-sm text-neutral-600">Dein Termin:</p>
                <p class="font-semibold text-lg">
                  {{ consulting.result.value.start ? consulting.formatDate(consulting.result.value.start) : '' }}, 
                  {{ consulting.result.value.start ? consulting.formatTime(consulting.result.value.start) : '' }} Uhr
                </p>
                <p class="text-neutral-600">mit {{ consulting.result.value.hostName }}</p>
              </div>
              <!-- User's message fragment -->
              <div v-if="consulting.state.notes" class="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg text-left max-w-md mx-auto">
                <p class="text-sm text-neutral-600 mb-1">Deine Nachricht:</p>
                <p class="text-neutral-800 whitespace-pre-wrap">{{ consulting.state.notes }}</p>
              </div>
              <div class="mt-8">
                <SfButton as="a" href="/" variant="secondary">
                  Zur Startseite
                </SfButton>
              </div>
            </div>
            
            <!-- Error -->
            <div v-else-if="consulting.result.value?.error" class="text-center py-8">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SfIconClose class="w-8 h-8 text-red-600" />
              </div>
              <h3 class="text-xl font-bold text-red-700 mb-2">Buchung fehlgeschlagen</h3>
              <p class="text-neutral-600 mb-4">{{ consulting.result.value.error }}</p>
              <SfButton @click="consulting.prevStep()" variant="secondary">
                Zurück
              </SfButton>
            </div>
          </div>
          
        </Column>
      </Columns>
    </SectionContainer>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { StepperRoot, StepperItem, StepperTrigger, StepperIndicator, StepperTitle, StepperSeparator } from 'radix-vue'
import { 
  SfButton, 
  SfInput, 
  SfTextarea,
  SfLoaderCircular, 
  SfIconArrowBack,
  SfIconCalendarToday,
  SfIconPerson,
  SfIconCheck,
  SfIconClose,
  Prose,
} from '#components'
import { useConsultingSlots, type ConsultingPreset } from '~/composables/useConsultingSlots'

// Alias for template
const SfIconCalendar = SfIconCalendarToday

const props = defineProps({
  preset: {
    type: String as PropType<ConsultingPreset>,
    default: 'einstieg',
  },
  startDate: {
    type: Date,
    default: undefined,
  },
  endDate: {
    type: Date,
    default: undefined,
  },
})

// Initialize consulting composable
const consulting = useConsultingSlots({
  preset: props.preset,
  startDate: props.startDate,
  endDate: props.endDate,
})

// Stepper configuration
const steps = [
  { title: 'Termin', name: 'slot' },
  { title: 'Kontakt', name: 'contact' },
  { title: 'Bestätigung', name: 'confirm' },
]

// Format date range for display
const formatDateRange = (start: Date, end: Date): string => {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
  return `${start.toLocaleDateString('de-DE', opts)} – ${end.toLocaleDateString('de-DE', opts)}`
}

// Handle contact form submission
const handleContactSubmit = async () => {
  await consulting.submit()
}

// Fetch slots on mount
onMounted(async () => {
  await consulting.fetchSlots()
})
</script>

<style scoped>
.checkout-card {
  padding: 1.5rem;
  box-shadow:
    0px 4px 6px 1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

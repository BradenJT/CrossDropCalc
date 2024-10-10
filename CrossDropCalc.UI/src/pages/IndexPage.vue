<template>
  <q-page padding>
    <div class="q-pa-md">
      <h2 style="text-align: center">Octane Correction Calculator</h2>

      <q-input
        label="Original Gallons"
        v-model="beforeGallons"
        :error="!isBeforeGallonsValid"
        error-message="This field is required"
        @focus="handleFocus('beforeGallons')"
        type="number"
        placeholder="0"
      />

      <q-input
        label="Original Octane"
        v-model="beforeOctane"
        :error="!isBeforeOctaneValid"
        error-message="This field is required"
        @focus="handleFocus('beforeOctane')"
        type="number"
        placeholder="0"
      />

      <q-input
        label="Gallons Cross-Dropped"
        v-model="afterCrossDropGallons"
        :error="!isAfterCrossDropGallonsValid"
        error-message="This field is required"
        @focus="handleFocus('afterCrossDropGallons')"
        type="number"
        placeholder="0"
      />

      <q-input
        label="Cross-Drop Octane"
        v-model="crossDropOctane"
        :error="!isCrossDropOctaneValid"
        error-message="This field is required"
        @focus="handleFocus('crossDropOctane')"
        type="number"
        placeholder="0"
      />

      <q-input
        label="Tank Capacity"
        v-model="tankCapacity"
        :error="!isTankCapacityValid"
        error-message="This field is required"
        @focus="handleFocus('tankCapacity')"
        type="number"
        placeholder="0"
      />

      <q-input
        label="Octane Threshold"
        v-model.number="octaneThreshold"
        type="number"
        step="0.1"
        placeholder="0.3"
      />

      <q-btn
        label="Calculate Blended Octane"
        @click="handleCalculate"
        :disable="isButtonDisabled"
        class="q-mt-md"
      />

      <q-btn
        v-if="isAnyFieldFilled"
        label="Clear"
        @click="handleClear"
        class="q-ml-sm q-mt-md"
      />

      <q-dialog v-model="isDialogVisible">
        <q-card>
          <q-card-section>
            <div>
              <p>
                <strong>Current Blended Octane:</strong>
                {{ blendedOctaneInfo.blendedOctane }}
              </p>
              <p><strong>To Correct Octane:</strong></p>
              <p>
                <strong
                  >{{
                    blendedOctaneInfo.additionalGallonsBrought
                  }}
                  Gallons</strong
                >
                of
                <strong>{{ blendedOctaneInfo.octaneBroughtIn }} Octane</strong>
                Need to be Brought In.
              </p>
              <p>
                <strong
                  >{{ blendedOctaneInfo.totalGallonsPumpedOut }} Gallons</strong
                >
                Need to be Pumped Out.
              </p>
              <p>
                <strong>Corrected Octane will be:</strong>
                {{ blendedOctaneInfo.correctedOctane }}
              </p>
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Close" @click="isDialogVisible = false" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import {
  QInput,
  QBtn,
  QCard,
  QCardSection,
  QDialog,
  QCardActions,
} from 'quasar';

export default defineComponent({
  name: 'OctaneCalculator',
  components: {
    QInput,
    QBtn,
    QCard,
    QCardSection,
    QDialog,
    QCardActions,
  },
  setup() {
    const beforeGallons = ref<string | null>(null);
    const beforeOctane = ref<string | null>(null);
    const afterCrossDropGallons = ref<string | null>(null);
    const crossDropOctane = ref<string | null>(null);
    const tankCapacity = ref<string | null>(null);
    const octaneThreshold = ref<number>(0.3);
    const result = ref<string>('');
    const isButtonDisabled = ref<boolean>(true);

    const isBeforeGallonsValid = ref<boolean>(true);
    const isBeforeOctaneValid = ref<boolean>(true);
    const isAfterCrossDropGallonsValid = ref<boolean>(true);
    const isCrossDropOctaneValid = ref<boolean>(true);
    const isTankCapacityValid = ref<boolean>(true);

    const isDialogVisible = ref<boolean>(false);
    const blendedOctaneInfo = ref({
      blendedOctane: 0,
      additionalGallonsBrought: 0,
      octaneBroughtIn: 0,
      totalGallonsPumpedOut: 0,
      correctedOctane: 0,
    });

    const isAnyFieldFilled = computed(() => {
      return !!(
        beforeGallons.value ||
        beforeOctane.value ||
        afterCrossDropGallons.value ||
        crossDropOctane.value ||
        tankCapacity.value ||
        result.value
      );
    });

    watch(
      [
        beforeGallons,
        beforeOctane,
        afterCrossDropGallons,
        crossDropOctane,
        tankCapacity,
        octaneThreshold,
      ],
      () => {
        isButtonDisabled.value =
          !beforeGallons.value ||
          !beforeOctane.value ||
          !afterCrossDropGallons.value ||
          !crossDropOctane.value ||
          !tankCapacity.value;
      }
    );

    const validateInputs = () => {
      let isValid = true;
      if (!beforeGallons.value || Number(beforeGallons.value) <= 0) {
        isBeforeGallonsValid.value = false;
        isValid = false;
      } else {
        isBeforeGallonsValid.value = true;
      }

      if (!beforeOctane.value || Number(beforeOctane.value) <= 0) {
        isBeforeOctaneValid.value = false;
        isValid = false;
      } else {
        isBeforeOctaneValid.value = true;
      }

      if (
        !afterCrossDropGallons.value ||
        Number(afterCrossDropGallons.value) <= 0
      ) {
        isAfterCrossDropGallonsValid.value = false;
        isValid = false;
      } else {
        isAfterCrossDropGallonsValid.value = true;
      }

      if (!crossDropOctane.value || Number(crossDropOctane.value) <= 0) {
        isCrossDropOctaneValid.value = false;
        isValid = false;
      } else {
        isCrossDropOctaneValid.value = true;
      }

      if (!tankCapacity.value || Number(tankCapacity.value) <= 0) {
        isTankCapacityValid.value = false;
        isValid = false;
      } else {
        isTankCapacityValid.value = true;
      }

      return isValid;
    };

    const handleCalculate = () => {
      if (!validateInputs()) return;

      const blendedResult = getBlendedOctane(
        Number(beforeGallons.value),
        Number(beforeOctane.value),
        Number(afterCrossDropGallons.value),
        Number(crossDropOctane.value),
        Number(tankCapacity.value),
        octaneThreshold.value
      );
      result.value = blendedResult;
    };

    const getBlendedOctane = (
      beforeGallons: number,
      beforeOctane: number,
      afterCrossDropGallons: number,
      crossDropOctane: number,
      tankCapacity: number,
      octaneThreshold: number
    ): string => {
      const blendedOctane =
        (beforeGallons * beforeOctane +
          afterCrossDropGallons * crossDropOctane) /
        (afterCrossDropGallons + beforeGallons);

      if (blendedOctane < beforeOctane - octaneThreshold) {
        return calculateOctaneCorrection(
          beforeGallons + afterCrossDropGallons,
          beforeOctane,
          blendedOctane,
          tankCapacity,
          octaneThreshold
        );
      }

      return `Blended Octane Is: ${blendedOctane.toFixed(
        1
      )}, no Correction Needed.`;
    };

    const calculateOctaneCorrection = (
      gallonsInGround: number,
      octaneBroughtIn: number,
      blendedOctane: number,
      tankCapacity: number,
      octaneThreshold: number
    ): string => {
      let maxGallonsToBring = tankCapacity - gallonsInGround - 500;
      let additionalGallonsBrought = 0;
      let totalGallonsPumpedOut = 0;
      let correctedOctane = blendedOctane;
      let isBringingIn = true;
      let gallonsInGroundAfterPumpout = gallonsInGround;

      while (correctedOctane < octaneBroughtIn - octaneThreshold) {
        if (isBringingIn && additionalGallonsBrought < maxGallonsToBring) {
          additionalGallonsBrought += 500;
          gallonsInGround += 500;
        } else if (!isBringingIn) {
          totalGallonsPumpedOut += 500;
          gallonsInGround -= 500;
          gallonsInGroundAfterPumpout -= 500;
          maxGallonsToBring += 500;
        }

        correctedOctane =
          Math.round(
            ((gallonsInGroundAfterPumpout * blendedOctane +
              additionalGallonsBrought * octaneBroughtIn) /
              (additionalGallonsBrought + gallonsInGroundAfterPumpout)) *
              10
          ) / 10;

        if (correctedOctane >= octaneBroughtIn - octaneThreshold) {
          break;
        }

        isBringingIn = additionalGallonsBrought < maxGallonsToBring;
      }

      blendedOctaneInfo.value = {
        blendedOctane: Math.round(blendedOctane * 10) / 10,
        additionalGallonsBrought,
        octaneBroughtIn,
        totalGallonsPumpedOut,
        correctedOctane,
      };

      isDialogVisible.value = true;

      return '';
    };

    const handleFocus = (field: string) => {
      switch (field) {
        case 'beforeGallons':
          beforeGallons.value = '';
          break;
        case 'beforeOctane':
          beforeOctane.value = '';
          break;
        case 'afterCrossDropGallons':
          afterCrossDropGallons.value = '';
          break;
        case 'crossDropOctane':
          crossDropOctane.value = '';
          break;
        case 'tankCapacity':
          tankCapacity.value = '';
          break;
      }
    };

    const handleClear = () => {
      beforeGallons.value = null;
      beforeOctane.value = null;
      afterCrossDropGallons.value = null;
      crossDropOctane.value = null;
      tankCapacity.value = null;
      octaneThreshold.value = 0.3;
      result.value = '';
      isBeforeGallonsValid.value = true;
      isBeforeOctaneValid.value = true;
      isAfterCrossDropGallonsValid.value = true;
      isCrossDropOctaneValid.value = true;
      isTankCapacityValid.value = true;
    };

    return {
      beforeGallons,
      beforeOctane,
      afterCrossDropGallons,
      crossDropOctane,
      tankCapacity,
      octaneThreshold,
      result,
      isButtonDisabled,
      isBeforeGallonsValid,
      isBeforeOctaneValid,
      isAfterCrossDropGallonsValid,
      isCrossDropOctaneValid,
      isTankCapacityValid,
      isAnyFieldFilled,
      blendedOctaneInfo,
      isDialogVisible,
      handleCalculate,
      handleFocus,
      handleClear,
    };
  },
});
</script>

<style scoped>
.q-pa-md {
  max-width: 600px;
  margin: 0 auto;
}
</style>

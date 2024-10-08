"use client";

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';

const OctaneCalculator: React.FC = () => {
  const [beforeGallons, setBeforeGallons] = useState<string | null>(null);
  const [beforeOctane, setBeforeOctane] = useState<string | null>(null);
  const [afterCrossDropGallons, setAfterCrossDropGallons] = useState<string | null>(null);
  const [crossDropOctane, setCrossDropOctane] = useState<string | null>(null);
  const [tankCapacity, setTankCapacity] = useState<string | null>(null);
  const [octaneThreshold, setOctaneThreshold] = useState<number>(0.3);
  const [result, setResult] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const [isBeforeGallonsValid, setIsBeforeGallonsValid] = useState<boolean>(true);
  const [isBeforeOctaneValid, setIsBeforeOctaneValid] = useState<boolean>(true);
  const [isAfterCrossDropGallonsValid, setIsAfterCrossDropGallonsValid] = useState<boolean>(true);
  const [isCrossDropOctaneValid, setIsCrossDropOctaneValid] = useState<boolean>(true);
  const [isTankCapacityValid, setIsTankCapacityValid] = useState<boolean>(true);

  const isAnyFieldFilled = !!(
    beforeGallons ?? beforeOctane ?? afterCrossDropGallons ?? crossDropOctane ?? tankCapacity ?? result
  );

  useEffect(() => {
    if (
      beforeGallons !== null &&
      beforeOctane !== null &&
      afterCrossDropGallons !== null &&
      crossDropOctane !== null &&
      tankCapacity !== null &&
      octaneThreshold !== null
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [beforeGallons, beforeOctane, afterCrossDropGallons, crossDropOctane, tankCapacity, octaneThreshold]);

  const validateInputs = () => {
    let isValid = true;
    if (!beforeGallons || Number(beforeGallons) <= 0) {
      setIsBeforeGallonsValid(false);
      isValid = false;
    } else {
      setIsBeforeGallonsValid(true);
    }

    if (!beforeOctane || Number(beforeOctane) <= 0) {
      setIsBeforeOctaneValid(false);
      isValid = false;
    } else {
      setIsBeforeOctaneValid(true);
    }

    if (!afterCrossDropGallons || Number(afterCrossDropGallons) <= 0) {
      setIsAfterCrossDropGallonsValid(false);
      isValid = false;
    } else {
      setIsAfterCrossDropGallonsValid(true);
    }

    if (!crossDropOctane || Number(crossDropOctane) <= 0) {
      setIsCrossDropOctaneValid(false);
      isValid = false;
    } else {
      setIsCrossDropOctaneValid(true);
    }

    if (!tankCapacity || Number(tankCapacity) <= 0) {
      setIsTankCapacityValid(false);
      isValid = false;
    } else {
      setIsTankCapacityValid(true);
    }

    return isValid;
  };

  const handleCalculate = () => {
    const isValid = validateInputs();
    if (!isValid) return;

    const blendedResult = getBlendedOctane(
      Number(beforeGallons),
      Number(beforeOctane),
      Number(afterCrossDropGallons),
      Number(crossDropOctane),
      Number(tankCapacity),
      octaneThreshold
    );
    setResult(blendedResult);
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
      (beforeGallons * beforeOctane + afterCrossDropGallons * crossDropOctane) /
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

    return `Blended Octane Is: ${blendedOctane.toFixed(1)}, no Correction Needed.`;
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

      correctedOctane = Math.round(
        ((gallonsInGroundAfterPumpout * blendedOctane) +
          (additionalGallonsBrought * octaneBroughtIn)) /
          (additionalGallonsBrought + gallonsInGroundAfterPumpout) * 10
      ) / 10;

      if (correctedOctane >= octaneBroughtIn - octaneThreshold) {
        break;
      }

      if (additionalGallonsBrought >= maxGallonsToBring) {
        isBringingIn = false;
      } else {
        isBringingIn = true;
      }
    }

    return `Current Blended Octane Is: ${blendedOctane.toFixed(1)}\n
    To Correct Octane:\n
    ${additionalGallonsBrought} Gallons of ${octaneBroughtIn} Octane Need to be Brought In.\n
    ${totalGallonsPumpedOut} Gallons Need to be Pumped Out.\n
    Corrected Octane will be: ${correctedOctane}`;
  };

  const handleFocus = (setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    setter('');
  };

  const handleClear = () => {
    setBeforeGallons(null);
    setBeforeOctane(null);
    setAfterCrossDropGallons(null);
    setCrossDropOctane(null);
    setTankCapacity(null);
    setOctaneThreshold(0.3);
    setResult('');
    setIsBeforeGallonsValid(true);
    setIsBeforeOctaneValid(true);
    setIsAfterCrossDropGallonsValid(true);
    setIsCrossDropOctaneValid(true);
    setIsTankCapacityValid(true);
  };

  return (
    <div className={styles.container}>
      <h1>Octane Calculator</h1>
      <div className={styles.inputGroup}>
        <label htmlFor="beforeGallons">Original Gallons:</label>
        <input
          id="beforeGallons"
          type="number"
          placeholder="0"
          value={beforeGallons ?? ''}
          onFocus={() => handleFocus(setBeforeGallons)}
          onChange={(e) => setBeforeGallons(e.target.value)}
        />
        {!isBeforeGallonsValid && <p className={styles.error}>This field is required</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="beforeOctane">Original Octane:</label>
        <input
          id="beforeOctane"
          type="number"
          placeholder="0"
          value={beforeOctane ?? ''}
          onFocus={() => handleFocus(setBeforeOctane)}
          onChange={(e) => setBeforeOctane(e.target.value)}
        />
        {!isBeforeOctaneValid && <p className={styles.error}>This field is required</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="afterCrossDropGallons">Gallons Cross-Dropped:</label>
        <input
          id="afterCrossDropGallons"
          type="number"
          placeholder="0"
          value={afterCrossDropGallons ?? ''}
          onFocus={() => handleFocus(setAfterCrossDropGallons)}
          onChange={(e) => setAfterCrossDropGallons(e.target.value)}
        />
        {!isAfterCrossDropGallonsValid && <p className={styles.error}>This field is required</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="crossDropOctane">Cross-Drop Octane:</label>
        <input
          id="crossDropOctane"
          type="number"
          placeholder="0"
          value={crossDropOctane ?? ''}
          onFocus={() => handleFocus(setCrossDropOctane)}
          onChange={(e) => setCrossDropOctane(e.target.value)}
        />
        {!isCrossDropOctaneValid && <p className={styles.error}>This field is required</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="tankCapacity">Tank Capacity:</label>
        <input
          id="tankCapacity"
          type="number"
          placeholder="0"
          value={tankCapacity ?? ''}
          onFocus={() => handleFocus(setTankCapacity)}
          onChange={(e) => setTankCapacity(e.target.value)}
        />
        {!isTankCapacityValid && <p className={styles.error}>This field is required</p>}
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="octaneThreshold">Octane Threshold:</label>
        <input
          id="octaneThreshold"
          type="number"
          step="0.1"
          placeholder="0.3"
          value={octaneThreshold}
          onChange={(e) => setOctaneThreshold(Number(e.target.value))}
        />
      </div>
      <button
        className={styles.button}
        onClick={handleCalculate}
        disabled={isButtonDisabled}
      >
        Calculate Blended Octane
      </button>
      {isAnyFieldFilled && (
        <button className={styles.button} onClick={handleClear} style={{ marginLeft: '10px' }}>
          Clear
        </button>
      )}
      {result && <pre className={styles.pre}>{result}</pre>}
    </div>
  );
};

export default OctaneCalculator;

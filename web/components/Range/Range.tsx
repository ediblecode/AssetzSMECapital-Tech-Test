import { ChangeEvent, FC, ReactNode, useCallback, useState } from "react";
import throttle from "just-throttle";

import { roundToTwoDecimalPlaces, displayCurrency } from "../../utils/number";

import styles from "./Range.module.css";

export interface RangeProps {
  title: ReactNode;
  name: string;
  min: number;
  max: number;
  isCurrency?: boolean;
  onChange: () => void;
}

export const Range: FC<RangeProps> = ({
  title,
  name,
  min,
  max,
  onChange,
  isCurrency = false,
}) => {
  const [minValue, setMinValue] = useState(0),
    [maxValue, setMaxValue] = useState(max);

  const handleInputChange = useCallback(
    throttle(onChange, 250, {
      leading: false,
      trailing: true,
    }),
    [onChange]
  );

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{title}</legend>
      <div className={styles.sliders}>
        <label>
          <span className={styles.labelText}>
            Min: {isCurrency ? "£" : null}
            {displayCurrency(minValue)}
          </span>

          <input
            type="range"
            min={0}
            max={roundToTwoDecimalPlaces(max)}
            step="any"
            value={minValue}
            name={`${name}Min`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMinValue(parseFloat(e.target.value));
              handleInputChange();
            }}
          />
        </label>

        <label>
          <span className={styles.labelText}>
            Max: {isCurrency ? "£" : null}
            {displayCurrency(maxValue)}
          </span>

          <input
            type="range"
            min={0}
            max={roundToTwoDecimalPlaces(max)}
            step="any"
            value={maxValue}
            name={`${name}Max`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMaxValue(parseFloat(e.target.value));
              handleInputChange();
            }}
          />
        </label>
      </div>
    </fieldset>
  );
};

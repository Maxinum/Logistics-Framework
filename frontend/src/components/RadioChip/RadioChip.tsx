import styles from "./RadioChip.module.css";

type RadioChipProps = {
  label: string;
  labelId: string;
  value: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

/**
 * Controlled radio button styled as chip
 */
export default function RadioChip({
  label,
  labelId,
  value,
  isChecked,
  onChange,
  disabled = false
}: RadioChipProps) {
  return (
    <label
      htmlFor={labelId}
      className={`${styles.label} ${isChecked ? styles.checked : ""}`}
    >
      {label}
      <input
        type="radio"
        id={labelId}
        className={styles.radioChip}
        value={value}
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
      />
    </label>
  );
}
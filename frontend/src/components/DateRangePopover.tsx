import { Popover, PopoverProps } from "@mui/material";
import { DateRange, DateRangeProps } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type DateRangePopoverProps = {
  /**
   * The element that serves as the anchor for the popover.
   */
  anchorEl: PopoverProps["anchorEl"];
  /**
   * Callback function called when the popover is closed.
   */
  onClose: PopoverProps["onClose"];
  /**
   * The selected date ranges.
   */
  ranges: DateRangeProps["ranges"];
  /**
   * Callback function called when the selected date ranges change.
   */
  onChange: DateRangeProps["onChange"];
  /**
   * Array of disabled dates.
   */
  disabledDates?: DateRangeProps["disabledDates"];
};

/**
 * DateRangePopover Component
 * Displays a popover containing a date range picker.
 *
 * @param anchorEl - The element that serves as the anchor for the popover.
 * @param onClose - Callback function called when the popover is closed.
 * @param ranges - The selected date ranges.
 * @param onChange - Callback function called when the selected date ranges change.
 * @param disabledDates[] - Array of disabled dates.
 * 
 * @example
 * function MyComponent() {
 *   const [anchorEl, setAnchorEl] = useState(null);
 *
 *   return (
 *     <div>
 *       <button onClick={({ currentTarget }) => setAnchorEl(currentTarget)}>
 *         Open Date Range
 *       </button>
 * 
 *       <DateRangePopover
 *         anchorEl={anchorEl}
 *         onClose={() => setAnchorEl(null)}
 *         ranges={[]}
 *         onChange={ranges => {
 *           // Handle date range change
 *         }}
 *       />
 *     </div>
 *   );
 * }
 */
export default function DateRangePopover({
  anchorEl,
  onClose,
  ranges,
  onChange,
  disabledDates
}: DateRangePopoverProps) {
  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{ mt: "4px" }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <DateRange
        months={2}
        ranges={ranges}
        direction="horizontal"
        rangeColors={["var(--blue)"]}
        monthDisplayFormat="LLLL"
        disabledDates={disabledDates}
        moveRangeOnFirstSelection={false}
        onChange={onChange}
      />
    </Popover>
  );
}
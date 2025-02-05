import { useSwipeable } from 'react-swipeable';
import './NumberSwipeSpinner.css';
import PropTypes from 'prop-types';

const NumberSwipeSpinner = ({ value, onChange, min = 0, max = 100 }) => {
  const handlers = useSwipeable({
    onSwipedRight: () => {
      if (value < max) {
        onChange(value + 1);
      }
    },
    onSwipedLeft: () => {
      if (value > min) {
        onChange(value - 1);
      }
    },
    // Set a threshold for detecting swipes (in pixels)
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  });

  return (
    <div className="spinner-roller" {...handlers}>
      <div className="spinner-value">
        {value}
      </div>
    </div>
  );
};
NumberSwipeSpinner.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default NumberSwipeSpinner;

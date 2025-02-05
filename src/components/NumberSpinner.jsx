
import './NumberSpinner.css';
import PropTypes from 'prop-types';

const NumberSpinner = ({ value, onChange, min = 0, max = 100 }) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="spinner-container">
      <button className="spinner-button" onClick={decrement}>–</button>
      <input 
        className="spinner-input"
        type="number" 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        readOnly
      />
      <button className="spinner-button" onClick={increment}>+</button>
    </div>
  );
};
NumberSpinner.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};


export default NumberSpinner;

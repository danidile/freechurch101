import { TextField } from '@mui/material';
import Autocomplete from '@mui/material';


const ControlledAutocomplete = ({ options = [], renderInput, getOptionLabel, onChange: ignored, control, defaultValue, name, renderOption }) => {
  return (
    <Controller
      render={({ onChange, ...props }) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
          onChange={(e, data) => onChange(data)}
          {...props}
        />
      )}
      onChange={([, data]) => data}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
}
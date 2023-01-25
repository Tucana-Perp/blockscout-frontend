import { FormControl, useToken, useColorMode } from '@chakra-ui/react';
import type { Size, CSSObjectWithLabel, OptionsOrGroups, GroupBase, SingleValue, MultiValue } from 'chakra-react-select';
import { Select } from 'chakra-react-select';
import React from 'react';
import type { FieldError } from 'react-hook-form';

import type { Option } from './types';

import { getChakraStyles } from 'ui/shared/FancySelect/utils';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  size?: Size;
  options: OptionsOrGroups<Option, GroupBase<Option>>;
  placeholder: string;
  name: string;
  onChange: (newValue: string) => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  isRequired?: boolean;
  error?: FieldError;
  value?: string;
}

const FancySelect = ({ size = 'md', options, placeholder, name, onChange, onBlur, isDisabled, isRequired, error, value: valueFromProps }: Props) => {
  const [ value, setValue ] = React.useState<SingleValue<Option> | MultiValue<Option>>();

  const menuZIndex = useToken('zIndices', 'dropdown');
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    if (!valueFromProps && value) {
      setValue(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ valueFromProps ]);

  const handleChange = React.useCallback((newValue: SingleValue<Option> | MultiValue<Option>) => {
    setValue(newValue);

    if (Array.isArray(newValue)) {
      return;
    }

    const _newValue = newValue as SingleValue<Option>;
    if (!_newValue) {
      return;
    }

    onChange(_newValue.value);
  }, [ onChange ]);

  const handleBlur = React.useCallback(() => {
    onBlur?.();
  }, [ onBlur ]);

  const styles = React.useMemo(() => ({
    menuPortal: (provided: CSSObjectWithLabel) => ({ ...provided, zIndex: menuZIndex }),
  }), [ menuZIndex ]);

  const chakraStyles = React.useMemo(() => getChakraStyles(colorMode), [ colorMode ]);

  return (
    <FormControl
      variant="floating"
      size={ size }
      isRequired={ isRequired }
      { ...(error ? { 'aria-invalid': true } : {}) }
      { ...(isDisabled ? { 'aria-disabled': true } : {}) }
      { ...(value ? { 'aria-active': true } : {}) }
    >
      <Select
        menuPortalTarget={ window.document.body }
        placeholder=""
        name={ name }
        options={ options }
        size={ size }
        styles={ styles }
        chakraStyles={ chakraStyles }
        useBasicStyles
        onChange={ handleChange }
        onBlur={ handleBlur }
        isDisabled={ isDisabled }
        isRequired={ isRequired }
        isInvalid={ Boolean(error) }
        value={ value }
      />
      <InputPlaceholder
        text={ placeholder }
        error={ error }
        isFancy
      />
    </FormControl>
  );
};

export default React.memo(FancySelect);

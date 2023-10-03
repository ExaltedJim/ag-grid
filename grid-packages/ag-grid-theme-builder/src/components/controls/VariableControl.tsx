import { useRenderedVariable } from 'atoms/renderedTheme';
import { useVariableValueAtom } from 'atoms/values';
import { useGetVariableDefault } from 'atoms/variableDefaults';
import { useVariableDescription } from 'atoms/variableDescriptions';
import { withErrorBoundary } from 'components/ErrorBoundary';
import { Control } from 'components/controls/Control';
import { Feature } from 'model/features';
import { kebabCaseToTitleCase } from 'model/utils';
import { getVariableInfoOrThrow } from 'model/variableInfo';
import { ReactElement, memo, useState } from 'react';
import { DefaultValue } from './DefaultValue';
import { BorderInput } from './inputs/BorderInput';
import { BorderStyleInput } from './inputs/BorderStyleInput';
import { ColorInput } from './inputs/ColorInput';
import { DimensionInput } from './inputs/DimensionInput';
import { DisplayInput } from './inputs/DisplayInput';

export type VariableControlProps = {
  variableName: string;
  feature: Feature;
};

const VariableControl = ({ variableName, feature }: VariableControlProps): JSX.Element => {
  const [value, setValue] = useVariableValueAtom(variableName);
  const renderedValue = useRenderedVariable(variableName);
  const getVariableDefault = useGetVariableDefault();
  const info = getVariableInfoOrThrow(variableName);
  const description = useVariableDescription(variableName);

  const [error, setError] = useState<string | null>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  if (feature.suppressEditorFor?.has(variableName)) return <></>;

  const prefix = (variableName === feature.commonVariablePrefix ? null : feature.commonVariablePrefix) || '--ag-'
  const label =  kebabCaseToTitleCase(variableName, prefix);

  const renderDefault = () => {
    const defaultValue = renderedValue || getVariableDefault(variableName);
    return (
      <Control
        label={label}
        help={description}
        onEdit={() => {
          setShouldFocus(true);
          setValue(defaultValue);
        }}
      >
        <DefaultValue value={defaultValue} />
      </Control>
    );
  };

  if (!value) {
    return renderDefault();
  }

  const renderInput = (): ReactElement => {
    const mismatchError = `${value.type} value provided for ${info.type} variable (${variableName})`;
    switch (value.type) {
      case 'color':
        if (info.type !== 'color') throw new Error(mismatchError);
        return (
          <ColorInput
            value={value}
            info={info}
            error={error}
            onErrorChange={setError}
            onValueChange={setValue}
            focus={shouldFocus}
          />
        );
      case 'dimension':
        if (info.type !== 'dimension') throw new Error(mismatchError);
        return (
          <DimensionInput
            value={value}
            info={info}
            error={error}
            onErrorChange={setError}
            onValueChange={setValue}
            focus={shouldFocus}
          />
        );
      case 'border':
        if (info.type !== 'border') throw new Error(mismatchError);
        return (
          <BorderInput
            value={value}
            info={info}
            error={error}
            onErrorChange={setError}
            onValueChange={setValue}
            focus={shouldFocus}
          />
        );
      case 'borderStyle':
        if (info.type !== 'borderStyle') throw new Error(mismatchError);
        return (
          <BorderStyleInput
            value={value}
            info={info}
            error={error}
            onErrorChange={setError}
            onValueChange={setValue}
            focus={shouldFocus}
          />
        );
      case 'display':
        if (info.type !== 'display') throw new Error(mismatchError);
        return (
          <DisplayInput
            value={value}
            info={info}
            error={error}
            onErrorChange={setError}
            onValueChange={setValue}
            focus={shouldFocus}
          />
        );
    }
  };

  return (
    <Control
      label={label}
      error={error}
      help={description}
      onReset={() => {
        setValue(null);
      }}
    >
      {renderInput()}
    </Control>
  );
};

const VariableControlWrapped = memo(withErrorBoundary(VariableControl));
export { VariableControlWrapped as VariableControl };

import React, { Fragment } from 'react';
import { Field, Formik } from 'formik';
import { object, number, string, bool, array } from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/core/Slider';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

function ValueLabelComponent(props) {
    const { children, open, value } = props;
    return (React.createElement(Tooltip, { open: open, enterTouchDelay: 0, placement: "top", title: value }, children));
}
function Form(props) {
    const { FORMIK_PROPS: { handleSubmit, dirty, isValid, isSubmitting, handleReset, setSubmitting, handleChange, handleBlur, getFieldMeta, }, FORMSCHEME_PROPS: { inputs, submitMsg, resetMsg, formButtons, resetButton, submitButton, classNames, disabled: form_disabled, submitTimeout, treeViewCollapseIcon, treeViewExpandIcon, formButtonsPlacement, errorBeforeTouched, }, children, } = props;
    const renderFormGroupItem = (input) => {
        const { type, disabled, fieldHandler, component, input_props, items, key, controlled, onKeyPress, className, full_path, placeholder, } = input;
        const { value } = getFieldMeta(full_path);
        const common_props = {
            name: full_path,
            value,
            onBlur: handleBlur,
            disabled,
            className: className || `FormScheme-input-container-${type}`,
        };
        if (!type.match(/^(slider)$/))
            common_props.onChange = handleChange;
        if (!controlled) {
            common_props.onKeyPress = onKeyPress;
            common_props.onChange = fieldHandler;
        }
        const labels = {};
        if (type.match(/(select|radio)/))
            items.forEach(item => (labels[item.value] = item.label));
        switch (type) {
            case 'component':
                return component;
            case 'select':
                return (React.createElement(Select, Object.assign({ displayEmpty: true }, common_props, input_props),
                    React.createElement(MenuItem, { value: "" }, 'None'),
                    items.map(({ value, label, icon }, index) => (React.createElement(MenuItem, { key: key + label + index, value: value },
                        icon ? React.createElement(Icon, null, icon) : null,
                        label)))));
            case 'multiselect':
                return (React.createElement(Select, Object.assign({ multiple: true, displayEmpty: true, input: React.createElement(Input, null), renderValue: (selected) => {
                        return selected.length === 0 ? (React.createElement("span", null, "None")) : (selected
                            .filter(selected => selected !== '')
                            .map(selected => labels[selected])
                            .join(', '));
                    } }, common_props, input_props),
                    React.createElement(MenuItem, { disabled: true },
                        React.createElement("span", null, "None")),
                    items.map(({ value, label, icon }, index) => {
                        return (React.createElement(MenuItem, { key: key + label + index, value: value },
                            icon ? React.createElement(Icon, null, icon) : null,
                            label));
                    })));
            case 'slider':
                return (React.createElement(Slider, Object.assign({ ValueLabelComponent: ValueLabelComponent, onChangeCommitted: (e, value) => {
                        e.target.value = value;
                        handleChange(e);
                    } }, common_props, input_props)));
            case 'checkbox':
                return (React.createElement(Field, Object.assign({ as: Checkbox, name: full_path, type: 'checkbox', color: 'primary' }, input_props)));
            case 'switch':
                return (React.createElement(Field, Object.assign({ as: Switch, name: full_path, type: 'checkbox', color: 'primary' }, input_props)));
            case 'radio':
                return (React.createElement(RadioGroup, Object.assign({ row: true }, common_props, input_props), items.map(({ label, value }, index) => (React.createElement(FormControlLabel, { key: key + label + index, control: React.createElement(Radio, { color: "primary" }), value: value, label: label, labelPlacement: "end" })))));
            case 'number':
                return (React.createElement(TextField, Object.assign({ placeholder: placeholder, type: 'number', fullWidth: true }, common_props, input_props)));
            default:
                return (React.createElement(TextField, Object.assign({ placeholder: placeholder, type: 'text', multiline: type === 'textarea', fullWidth: true }, common_props, input_props)));
        }
    };
    const renderFormGroup = (input) => {
        const { key, children, type, helperText, className, label, treeView, collapse, labelPlacement, helperTextPlacement, errorTextPlacement, full_path, row, } = input;
        const { disabled, required } = input;
        const { error, touched } = getFieldMeta(full_path);
        const show_error = type !== 'group' && error && (errorBeforeTouched || touched);
        if (disabled && required)
            throw new Error('Required fields cannot be disabled');
        return (React.createElement(FormControl, { className: className || `FormScheme-input`, key: key, disabled: disabled, fullWidth: true, margin: 'normal', style: { flexDirection: row ? 'row' : 'column' } },
            React.createElement("div", { className: "FormScheme-input-label_helpertext", style: { marginRight: 10 } },
                React.createElement(FormLabel, { style: {
                        display: 'flex',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        justifyContent: labelPlacement,
                    }, className: "FormScheme-input-label", disabled: disabled, required: required, component: "label" }, label),
                helperText && (React.createElement(FormHelperText, { required: required, disabled: disabled, className: 'FormScheme-input-helpertext', style: {
                        display: 'flex',
                        fontSize: '1rem',
                        justifyContent: helperTextPlacement,
                    } }, helperText))),
            React.createElement("div", { className: "Formscheme-input-container", style: { marginBottom: show_error ? 0 : 22.5 } }, type === 'group' ? (treeView ? (React.createElement(TreeView, { defaultCollapseIcon: treeViewCollapseIcon, defaultExpandIcon: treeViewExpandIcon, defaultExpanded: [collapse ? '0' : '1'], onNodeToggle: e => {
                    const parent = e.target.parentElement.parentElement;
                    e.target.textContent = !parent.nextElementSibling
                        ? 'Collapse'
                        : 'Expand';
                } },
                React.createElement(TreeItem, { nodeId: "1", label: React.createElement("div", { style: { width: 'calc(100% - 25px)' } }, collapse ? 'Expand' : 'Collapse') },
                    React.createElement(FormGroup, { row: false }, children.map(child => renderFormGroup(child)))))) : (React.createElement(FormGroup, { row: true }, children.map(child => renderFormGroup(child))))) : (renderFormGroupItem(input))),
            show_error && (React.createElement(FormHelperText, { className: 'FormScheme-input-errorText', error: true, disabled: disabled, style: {
                    display: 'flex',
                    fontSize: '.75rem',
                    fontWeight: 'bold',
                    justifyContent: errorTextPlacement,
                    alignItems: 'center',
                    marginLeft: row ? 10 : 0,
                } }, error))));
    };
    return (React.createElement("form", { className: classNames || `Formscheme`, onSubmit: e => {
            e.preventDefault();
            if (typeof submitTimeout === 'number') {
                setSubmitting(true);
                setTimeout(() => {
                    handleSubmit();
                    setSubmitting(false);
                }, submitTimeout);
            }
            else
                handleSubmit();
        }, onReset: () => {
            handleReset();
        } },
        React.createElement("div", { className: `Formscheme-inputs` },
            inputs.map(input => renderFormGroup(input)),
            children),
        React.createElement("div", { className: `Formscheme-buttons`, style: { display: 'flex', justifyContent: formButtonsPlacement } }, formButtons && (React.createElement(FormGroup, { row: true, style: {
                width: 'fit-content',
            } },
            resetButton && (React.createElement(Button, { style: { margin: '10px' }, variant: "contained", color: "default", type: "reset", disabled: form_disabled, className: 'Formscheme-buttons-reset' }, resetMsg)),
            submitButton && (React.createElement(Button, { style: { margin: '10px' }, className: 'Formscheme-buttons-submit', type: "submit", variant: "contained", color: "primary", disabled: !dirty || isSubmitting || !isValid || form_disabled }, submitMsg)))))));
}

function setObjectValues(parent, arr) {
    arr.forEach(entry => {
        if (Array.isArray(entry)) {
            if (typeof parent[entry[0]] === 'undefined')
                parent[entry[0]] = entry[1];
        }
        else if (typeof parent[entry] === 'undefined')
            parent[entry] = undefined;
    });
}
function generateFormSchemeInputDefaultConfigs(input, full_path = '', parent, index = 0) {
    if (!input.input_props)
        input.input_props = {};
    if (input.type === 'group') {
        if (!input.children || input.children.length === 0)
            throw new Error('Grouped FormScheme must have children components');
        setObjectValues(input, [
            ['useArray', false],
            ['useObject', input.useArray ? false : true],
            ['treeView', true],
            ['collapse', false],
            ['append', true],
        ]);
    }
    else {
        input.children = [];
        setObjectValues(input, [
            'treeView',
            'collapse',
            'append',
            'useArray',
            'useObject',
        ]);
    }
    if (!input.name)
        throw new Error('Input name is required');
    const placemant = input.type !== 'group' ? 'flex-start' : 'center';
    setObjectValues(input, [
        ['disabled', false],
        'className',
        'placeholder',
        'helperText',
        'defaultValue',
        ['type', 'text'],
        ['controlled', true],
        'onKeyPress',
        'fieldHandler',
        ['siblings', []],
        ['touched', false],
        ['required', false],
        'error',
        ['items', []],
        ['row', false],
        ['labelPlacement', placemant],
        ['helperTextPlacement', placemant],
        ['errorTextPlacement', placemant],
    ]);
    input.disabled = parent?.disabled || input.disabled;
    input.required = parent?.required || input.required;
    if (!input.label)
        input.label = input.name
            .split('_')
            .map((c) => c.charAt(0).toUpperCase() + c.substr(1))
            .join(' ');
    if (!input.key)
        input.key = full_path + input.name + index;
    const key = parent && parent.useArray ? index : input.name;
    if (input?.type?.match(/(radio|select)/) &&
        (input?.items ?? [])?.length === 0)
        throw new Error(`${input.type.charAt(0).toUpperCase() +
            input.type.substr(1)} component must have ${input.type} items`);
    input.full_path =
        full_path + `${parent ? `.${key}` : key}`;
    return input;
}
function generateFormSchemePropsDefaultConfigs(props) {
    const res = {
        FORMSCHEME_PROPS: {},
        FORMIK_CONFIGS: props.FORMIK_CONFIGS,
    };
    if (!props.FORMSCHEME_PROPS.inputs)
        throw new Error('You should pass inputs props to FORMSCHEME_PROPS');
    res.FORMSCHEME_PROPS = { ...props.FORMSCHEME_PROPS };
    setObjectValues(res.FORMSCHEME_PROPS, [
        ['formButtons', true],
        'classNames',
        ['errorBeforeTouched', true],
        ['submitMsg', 'submit'],
        ['resetMsg', 'reset'],
        ['resetButton', true],
        ['submitButton', true],
        ['disabled', false],
        'submitTimeout',
        ['treeViewExpandIcon', React.createElement("div", null, '⯆')],
        ['treeViewCollapseIcon', React.createElement("div", null, '▶')],
        ['formButtonsPlacement', 'center'],
    ]);
    return res;
}

function isPOJO(arg) {
    if (arg == null || typeof arg !== 'object')
        return false;
    const proto = Object.getPrototypeOf(arg);
    if (proto == null)
        return true;
    return proto === Object.prototype;
}
function convertToArray(object) {
    const res = JSON.parse(JSON.stringify(object));
    function inner(_object) {
        const entries = Object.entries(_object);
        entries.forEach(([key, value]) => {
            if (isPOJO(value))
                _object[key] = inner(value);
        });
        const array_like = entries.every(([key], i) => parseInt(key) === i);
        if (array_like)
            return Array.from({ ..._object, length: entries.length });
        else
            return _object;
    }
    inner(res);
    return res;
}

function FormScheme(props) {
    const populateInitialValue = () => {
        const { inputs } = props.FORMSCHEME_PROPS;
        const initialValues = {};
        const initialErrors = {};
        const initialTouched = {};
        const initialValidationSchemaShape = {};
        const types = ['values', 'errors', 'touched'];
        function inner(input, attacher, full_path = '', parent, schemaShape, index) {
            const GeneratedFormSchemeInputConfigs = generateFormSchemeInputDefaultConfigs(input, full_path, parent, index);
            const { type, children, name, touched, defaultValue, required, label, error, } = GeneratedFormSchemeInputConfigs;
            const key = parent?.useArray ?? false ? index : name;
            if (type === 'group') {
                types.forEach(type => (attacher[type][key] = {}));
                schemaShape[key] = {};
                full_path += (full_path ? '.' : '') + key;
                children.forEach((child, _index) => inner(child, types.reduce((acc, type) => ({
                    ...acc,
                    [type]: attacher[type][key],
                }), {}), full_path, GeneratedFormSchemeInputConfigs, schemaShape[key], _index));
                schemaShape[key] = object()
                    .shape(schemaShape[key])
                    .required()
                    .noUnknown()
                    .strict(true);
            }
            else {
                let default_value = null;
                const is_number = type.match(/^(slider|number)$/);
                const is_text = type.match(/^(radio|textarea|text|select)$/);
                const is_bool = type.match(/^(checkbox|switch)$/);
                const is_arr = type.match(/^(multiselect)$/);
                const items = type.match(/(radio|select)/) &&
                    input.items &&
                    input.items.map(item => item.value);
                if (is_number) {
                    schemaShape[key] = number().strict(true);
                    default_value = 0;
                }
                else if (is_text) {
                    schemaShape[key] = string().strict(true);
                    default_value = '';
                }
                else if (is_bool) {
                    schemaShape[key] = bool().strict(true);
                    default_value = false;
                }
                else if (is_arr) {
                    schemaShape[key] = array()
                        .of(string().strict(true))
                        .strict(true);
                    default_value = [];
                }
                if (items && input.items) {
                    schemaShape[key] = schemaShape[key].test({
                        name: 'Oneof checker',
                        message: `\${path} must be one of ${input.items
                            .map(item => item.label)
                            .join(',')} `,
                        test: function (values) {
                            return (!required && values === undefined) ||
                                Array.isArray(values)
                                ? values.every((val) => items.includes(val))
                                : items.includes(values);
                        },
                    });
                }
                if (required)
                    schemaShape[key] = schemaShape[key].required(`${label} is a required field`);
                attacher.values[key] = defaultValue || default_value;
                attacher.touched[key] = touched;
                attacher.errors[key] = error;
                full_path += name;
                try {
                    schemaShape[key].validateSync(attacher.values[key]);
                }
                catch (err) {
                    attacher.errors[key] = err.errors[0].replace('this', label);
                }
            }
        }
        inputs.forEach((input, index) => inner(input, {
            values: initialValues,
            errors: initialErrors,
            touched: initialTouched,
        }, '', undefined, initialValidationSchemaShape, index));
        return {
            initialValues,
            initialErrors,
            initialTouched,
            validationSchema: object()
                .shape(initialValidationSchemaShape)
                .required()
                .noUnknown()
                .strict(true),
        };
    };
    const GeneratedFormSchemeProps = generateFormSchemePropsDefaultConfigs(props);
    const { FORMIK_CONFIGS } = GeneratedFormSchemeProps;
    const { initialValues, initialErrors, initialTouched, validationSchema, } = populateInitialValue();
    FORMIK_CONFIGS.initialValues = initialValues;
    FORMIK_CONFIGS.initialErrors = initialErrors;
    FORMIK_CONFIGS.initialTouched = initialTouched;
    FORMIK_CONFIGS.validationSchema = validationSchema;
    const { children } = props;
    return (React.createElement(Formik, Object.assign({}, FORMIK_CONFIGS), formik_props => {
        const FORM = (React.createElement(Form, Object.assign({ FORMIK_PROPS: formik_props }, GeneratedFormSchemeProps)));
        return (React.createElement(Fragment, null, typeof children === 'function' ? (children({
            FORMIK_PROPS: formik_props,
            ...GeneratedFormSchemeProps,
            FORM,
        })) : (React.createElement(Fragment, null,
            FORM,
            children))));
    }));
}

export default FormScheme;
export { convertToArray };
//# sourceMappingURL=formscheme.esm.js.map

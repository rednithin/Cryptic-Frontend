import React, { useContext, useState, useMemo } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Card, Input, Button, Select, Checkbox } from "antd";
import * as yup from "yup";
import { StoreContext } from "./Store";

const onSubmit = async values => {
  window.alert(JSON.stringify(values, 0, 2));
};

const validate = async values => {
  const validator = yup.object().shape({
    filename: yup
      .string()
      .required()
      .default(""),
    strategy: yup
      .string()
      .required()
      .default(""),
    warmup: yup
      .number()
      .integer()
      .min(0)
      .default(0),
    config: yup
      .string()
      .required()
      .default("")
  });

  try {
    await validator.validate(values, { abortEarly: false });
  } catch (err) {
    const errors = err.inner.reduce(
      (formError, innerError) => ({
        ...formError,
        [innerError.path]: innerError.message
      }),
      {}
    );

    return errors;
  }
};

export default () => {
  const [store, { getFilenames }] = useContext(StoreContext);

  useMemo(getFilenames, [store.tasks]);

  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate
  });

  const [editConfig, setEditConfig] = useState(false);

  const filename = useField("filename", form);
  const strategy = useField("strategy", form);
  const warmup = useField("warmup", form);
  const config = useField("config", form);

  return (
    <Card style={{ width: "480px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            showSearch
            {...filename.input}
            value={filename.input.value || undefined}
            placeholder="Select an filename"
          >
            {store.filenames.map(filename => (
              <Select.Option key={filename} value={filename}>
                {filename}
              </Select.Option>
            ))}
          </Select>
          <font color="red">
            {filename.meta.touched && filename.meta.error && (
              <span>{filename.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div>
          <Select
            showSearch
            {...strategy.input}
            value={strategy.input.value || undefined}
            placeholder="Select an strategy"
          >
            {store.strategies.map(strategy => (
              <Select.Option key={strategy} value={strategy}>
                {strategy}
              </Select.Option>
            ))}
          </Select>
          <font color="red">
            {strategy.meta.touched && strategy.meta.error && (
              <span>{strategy.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div>
          <Input
            placeholder="Warmup Period"
            // prefix={<Icon type="file" style={{ color: "rgba(0,0,0,.25)" }} />}
            {...warmup.input}
            disabled={!values.strategy}
          />
          <font color="red">
            {warmup.meta.touched && warmup.meta.error && (
              <span>{warmup.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <Checkbox
          onChange={() => setEditConfig(!editConfig)}
          disabled={!values.strategy}
        >
          Edit Config
        </Checkbox>
        <br />
        <br />
        <div>
          <Input.TextArea
            rows={10}
            placeholder="Config"
            {...config.input}
            disabled={!values.strategy || !editConfig}
          />
          <font color="red">
            {config.meta.touched && config.meta.error && (
              <span>{config.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="primary" htmlType="submit" disabled={submitting}>
            Submit
          </Button>
          <Button
            onClick={() =>
              form.reset({
                filename: "",
                strategy: "",
                config: "",
                warmup: 0
              })
            }
            disabled={submitting || pristine}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

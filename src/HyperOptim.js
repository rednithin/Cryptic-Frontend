import React, { useContext, useEffect, useMemo } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Card, Input, Button, Select, AutoComplete } from "antd";
import * as yup from "yup";
import { StoreContext } from "./Store";

const onSubmit = async values => {
  window.alert(JSON.stringify(values, 0, 2));
};

const validate = async values => {
  const validator = yup.object().shape({
    filenames: yup
      .array()
      .min(1)
      .default([]),
    strategy: yup
      .string()
      .required()
      .default(""),
    savefile: yup
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
  const [store, { getFilenames, getStrategies }] = useContext(StoreContext);

  useMemo(getFilenames, [store.tasks]);
  useMemo(getStrategies, [store.tasks]);

  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate,
    initialValues: {
      warmup: 0
    }
  });

  useEffect(() => {
    console.log(store);
    if (values.strategy) {
      form.reset({
        ...values,
        config: store.hypers[values.strategy],
        savefile: ""
      });
    }
    return () => {};
  }, [values.strategy]);

  const filenames = useField("filenames", form);
  const strategy = useField("strategy", form);
  const warmup = useField("warmup", form);
  const config = useField("config", form);
  const savefile = useField("savefile", form);

  return (
    <Card style={{ width: "600px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            mode="multiple"
            showSearch
            {...filenames.input}
            value={filenames.input.value || undefined}
            placeholder="Select an filenames"
          >
            {store.filenames.map(filenames => (
              <Select.Option key={filenames} value={filenames}>
                {filenames}
              </Select.Option>
            ))}
          </Select>
          <font color="red">
            {filenames.meta.touched && filenames.meta.error && (
              <span>{filenames.meta.error}</span>
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
          <AutoComplete
            dataSource={
              values.strategy
                ? Object.keys(store.configs[values.strategy]).filter(file =>
                    file.startsWith(values.savefile)
                  )
                : []
            }
            // style={{ width: 450 }}
            {...savefile.input}
            // onSelect={onSelect}
            // onSearch={this.handleSearch}
            placeholder="Enter filename to save best config"
            disabled={!values.strategy}
          />
          <font color="red">
            {savefile.meta.touched && savefile.meta.error && (
              <span>{savefile.meta.error}</span>
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
        <div>
          <Input.TextArea
            rows={15}
            placeholder="Hyper Parameter Config"
            {...config.input}
            disabled={!values.strategy}
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
                filenames: "",
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

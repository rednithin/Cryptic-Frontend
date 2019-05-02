import React, { useContext, useState, useMemo, useEffect } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Card, Input, Button, Select, Checkbox, Table } from "antd";
import * as yup from "yup";
import { StoreContext } from "./Store";
import Plot from "react-plotly.js";

const validate = async values => {
  const validator = yup.object().shape({
    exchange: yup
      .string()
      .required()
      .default(""),
    pair: yup
      .string()
      .required()
      .default(""),
    interval: yup
      .string()
      .required()
      .default(""),
    strategy: yup
      .string()
      .required()
      .default(""),
    configfile: yup
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

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    name: "key"
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value"
  }
];

export default () => {
  const [store, { getFilenames, getStrategies, doPaperTrading }] = useContext(
    StoreContext
  );

  useMemo(getFilenames, [store.tasks]);
  useMemo(getStrategies, [store.tasks]);

  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit: doPaperTrading,
    validate,
    initialValues: {
      warmup: 0
    }
  });

  useEffect(() => {
    if (values.strategy) {
      form.reset({
        ...values,
        configfile: "",
        config: ""
      });
    }
    return () => {};
  }, [values.strategy]);

  useEffect(() => {
    if (values.configfile) {
      form.reset({
        ...values,
        config: store.configs[values.strategy][values.configfile]
      });
    }
    // } else {
    //   form.reset({
    //     ...values,
    //     config: null
    //   });
    // }
    return () => {};
  }, [values.configfile]);

  const [editConfig, setEditConfig] = useState(false);

  const strategy = useField("strategy", form);
  const warmup = useField("warmup", form);
  const config = useField("config", form);
  const configfile = useField("configfile", form);
  const exchange = useField("exchange", form);
  const pair = useField("pair", form);
  const interval = useField("interval", form);

  return (
    <div>
      <Card style={{ width: "600px", margin: "auto" }}>
        <form onSubmit={handleSubmit}>
          <div>
            <Select
              showSearch
              {...exchange.input}
              value={exchange.input.value || undefined}
              placeholder="Select an Exchange"
            >
              {store.exchanges.map(exchange => (
                <Select.Option key={exchange} value={exchange}>
                  {exchange}
                </Select.Option>
              ))}
            </Select>
            <font color="red">
              {exchange.meta.touched && exchange.meta.error && (
                <span>{exchange.meta.error}</span>
              )}
            </font>
          </div>
          <br />
          <div>
            <Select
              showSearch
              {...pair.input}
              value={pair.input.value || undefined}
              placeholder="Select an Pair"
              disabled={!values.exchange}
            >
              {values.exchange &&
                store.pairs[values.exchange].map(pair => (
                  <Select.Option key={pair} value={pair}>
                    {pair}
                  </Select.Option>
                ))}
            </Select>
            <font color="red">
              {pair.meta.touched && pair.meta.error && (
                <span>{pair.meta.error}</span>
              )}
            </font>
          </div>
          <br />
          <div>
            <Select
              showSearch
              {...interval.input}
              value={interval.input.value || undefined}
              placeholder="Select an Interval"
              disabled={!values.exchange}
            >
              {values.exchange &&
                store.intervals[values.exchange].map(interval => (
                  <Select.Option key={interval} value={interval}>
                    {interval}
                  </Select.Option>
                ))}
            </Select>
            <font color="red">
              {interval.meta.touched && interval.meta.error && (
                <span>{interval.meta.error}</span>
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
            <Select
              showSearch
              {...configfile.input}
              value={configfile.input.value || undefined}
              placeholder="Select a Config File"
              disabled={!values.strategy}
            >
              {values.strategy
                ? Object.keys(store.configs[values.strategy]).map(
                    configfile => (
                      <Select.Option key={configfile} value={configfile}>
                        {configfile}
                      </Select.Option>
                    )
                  )
                : null}
            </Select>
            <font color="red">
              {configfile.meta.touched && configfile.meta.error && (
                <span>{configfile.meta.error}</span>
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
              rows={15}
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
    </div>
  );
};

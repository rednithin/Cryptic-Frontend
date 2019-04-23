import React, { useContext } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Card, Input, Icon, Button, Select, DatePicker } from "antd";
import * as yup from "yup";
import { StoreContext } from "./Store";

const validate = async values => {
  const validator = yup.object().shape({
    filename: yup
      .string()
      .required()
      .default(""),
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
    daterange: yup
      .array()
      .required()
      .default([])
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
  const [store, { downloadDataset }] = useContext(StoreContext);

  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit: downloadDataset,
    validate
  });

  const filename = useField("filename", form);
  const exchange = useField("exchange", form);
  const pair = useField("pair", form);
  const interval = useField("interval", form);
  const daterange = useField("daterange", form);

  return (
    <Card style={{ width: "480px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="Filename"
            prefix={<Icon type="file" style={{ color: "rgba(0,0,0,.25)" }} />}
            {...filename.input}
          />
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
          <DatePicker.RangePicker {...daterange.input} format="DD/MM/YYYY" />

          <font color="red">
            {daterange.meta.touched && daterange.meta.error && (
              <span>{daterange.meta.error}</span>
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
                exchange: "",
                interval: "",
                pair: "",
                daterange: []
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

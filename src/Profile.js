import React, { useContext, useEffect, useMemo } from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Card, Input, Button, Select, AutoComplete } from "antd";
import * as yup from "yup";
import { StoreContext } from "./Store";
import { Redirect } from "react-router-dom";

// const onSubmit = async values => {
//   window.alert(JSON.stringify(values, 0, 2));
// };

const validate = async values => {
  const validator = yup.object().shape({
    coins: yup
      .array()
      .min(1)
      .default([]),
    user: yup
      .number()
      .integer()
      .required()
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
  const [store, { getCoins, setCoins }] = useContext(StoreContext);

  useMemo(() => {
    getCoins({ user: store.user });
  }, [store.tasks]);

  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit: setCoins,
    validate,
    initialValues: {
      user: store.user
    }
  });

  useEffect(() => {
    if (store.userCoins.length) {
      form.reset({
        coins: store.userCoins,
        user: store.user
      });
    }
    return () => {};
  }, [store.userCoins]);

  const coins = useField("coins", form);
  const user = useField("user", form);

  if (!store.user) {
    return <Redirect to="/" />;
  }
  return (
    <Card style={{ width: "600px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <Select
            mode="multiple"
            showSearch
            {...coins.input}
            value={coins.input.value || undefined}
            placeholder="Select an coins"
          >
            {store.coins &&
              store.coins.map(coin => (
                <Select.Option key={coin} value={coin}>
                  {coin}
                </Select.Option>
              ))}
          </Select>
          <font color="red">
            {coins.meta.touched && coins.meta.error && (
              <span>{coins.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="primary" htmlType="submit" disabled={submitting}>
            Submit
          </Button>
          <Button
            onClick={() => form.reset({ coins: store.userCoins })}
            disabled={submitting || pristine}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

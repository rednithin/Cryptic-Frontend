import React from "react";
import { useField, useForm } from "react-final-form-hooks";
import { Card, Input, Icon, Button } from "antd";
import * as yup from "yup";

const onSubmit = async values => {
  window.alert(JSON.stringify(values, 0, 2));
};

const validate = async values => {
  const validator = yup.object().shape({
    name: yup
      .string()
      .required()
      .default(""),
    email: yup
      .string()
      .email()
      .required()
      .default(""),
    password: yup
      .string()
      .min(8)
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
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit,
    validate
  });

  const name = useField("name", form);
  const email = useField("email", form);
  const password = useField("password", form);

  return (
    <Card style={{ width: "480px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="Name"
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            {...name.input}
          />
          <font color="red">
            {name.meta.touched && name.meta.error && (
              <span>{name.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div>
          <Input
            placeholder="Email"
            prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />}
            {...email.input}
          />
          <font color="red">
            {email.meta.touched && email.meta.error && (
              <span>{email.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div>
          <Input.Password
            placeholder="Password"
            prefix={<Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />}
            {...password.input}
          />
          <font color="red">
            {password.meta.touched && password.meta.error && (
              <span>{password.meta.error}</span>
            )}
          </font>
        </div>
        <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="primary" htmlType="submit" disabled={submitting}>
            Submit
          </Button>
          <Button
            onClick={() => form.reset()}
            disabled={submitting || pristine}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
};

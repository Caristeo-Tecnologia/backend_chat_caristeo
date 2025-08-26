import React, { useState, useEffect } from "react";

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from "react-input-mask";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import { PaymentForm } from "../../components/PaymentForm";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const PaymentSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
  cpfCnpj: Yup.string()
    .min(11, "Too Short!")
    .max(14, "Too Long!")
    .required("Required"),
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    planId: "",
    cpfCnpj: "",
    postalCode: "",
  };

  const [creditCard, setCreditCard] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const dueDate = moment().add(3, "day").format();

  const handleSignUp = async (values) => {
    setLoading(true);
    Object.assign(values, { recurrence: "MENSAL" });
    Object.assign(values, { dueDate: dueDate });
    Object.assign(values, { status: "t" });
    Object.assign(values, { campaignsEnabled: true });
    Object.assign(values, { creditCard });

    if (
      !creditCard.cardNumber ||
      !creditCard.name ||
      !creditCard.cvv ||
      !creditCard.expiryDate
    ) {
      toast.error("Preencha todos os dados do cartão de crédito.");
      return;
    }

    try {
      await api.post("/companies/cadastro", values);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (err) {
      toastError(err);
    }

    setLoading(false);
  };

  const [plans, setPlans] = useState([]);
  const { list: listPlans } = usePlans();

  useEffect(() => {
    async function fetchData() {
      const list = await listPlans();
      setPlans(list);
    }
    fetchData();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <div>
          <center>
            <img
              style={{ margin: "0 auto", width: "70%" }}
              src={logo}
              alt="Whats"
            />
          </center>
        </div>
        <Formik
          initialValues={initialState}
          enableReinitialize={true}
          validationSchema={PaymentSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSignUp(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    autoComplete="name"
                    name="name"
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    variant="outlined"
                    fullWidth
                    id="name"
                    label="Nome da Empresa"
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    id="email"
                    label={i18n.t("signup.form.email")}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    autoComplete="email"
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={InputMask}
                    mask="(99) 99999-9999"
                    variant="outlined"
                    fullWidth
                    id="phone"
                    name="phone"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                    autoComplete="phone"
                  >
                    {({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label="Telefone com (DDD)"
                        inputProps={{ maxLength: 11 }} // Definindo o limite de caracteres
                        required
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    autoComplete="cpfCnpj"
                    name="cpfCnpj"
                    error={touched.cpfCnpj && Boolean(errors.cpfCnpj)}
                    helperText={touched.cpfCnpj && errors.cpfCnpj}
                    variant="outlined"
                    fullWidth
                    id="cpfCnpj"
                    label="CPF/CNPJ"
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    autoComplete="postalCode"
                    name="postalCode"
                    error={touched.postalCode && Boolean(errors.postalCode)}
                    helperText={touched.postalCode && errors.postalCode}
                    variant="outlined"
                    fullWidth
                    id="postalCode"
                    label="CEP"
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    variant="outlined"
                    fullWidth
                    name="password"
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    label={i18n.t("signup.form.password")}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="plan-selection">Plano</InputLabel>
                  <Field
                    as={Select}
                    variant="outlined"
                    fullWidth
                    id="plan-selection"
                    label="Plano"
                    name="planId"
                    required
                  >
                    {plans.map((plan, key) => (
                      <MenuItem key={key} value={plan.id}>
                        {plan.name} - Atendentes: {plan.users} - WhatsApp:{" "}
                        {plan.connections} - Filas: {plan.queues} - R${" "}
                        {plan.value}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <PaymentForm onChange={setCreditCard} />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
                startIcon={loading ? <CircularProgress color="inherit" size={20} /> : null}
              >
                {i18n.t("signup.buttons.submit")}
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    component={RouterLink}
                    to="/login"
                  >
                    {i18n.t("signup.buttons.login")}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}>{/* <Copyright /> */}</Box>
    </Container>
  );
};

export default SignUp;

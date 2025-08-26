import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { PaymentForm } from "../PaymentForm";
import { useFormik } from "formik";
import { i18n } from "../../translate/i18n";
import InputMask from "react-input-mask";
import usePlans from "../../hooks/usePlans";
import { AuthContext } from "../../context/Auth/AuthContext";
import useCompanies from "../../hooks/useCompanies";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";

const CompanyForm = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { find: findCompany } = useCompanies();
  const [plans, setPlans] = useState([]);
  const { list: listPlans } = usePlans();
  const [creditCard, setCreditCard] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      planId: "",
      cpfCnpj: "",
      postalCode: "",
    },
    onSubmit: (values) => {
      handleSaveCompany(values);
    },
  });

  useEffect(async () => {
    setPlans(await listPlans());
    formik.setValues(await findCompany(user.companyId));
  }, []);

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      await api.put(`/companies/${user.companyId}`, {
        ...formik.values,
        creditCard,
      });
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      console.error(error);
      toastError(error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item md={4} xs={12}>
          <TextField
            name="name"
            value={formik.values.name}
            error={formik.touched.name && !!formik.errors.name}
            onChange={formik.handleChange}
            variant="outlined"
            id="name"
            autoComplete="name"
            label="Nome da Empresa"
            required
            fullWidth
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            name="email"
            value={formik.values.email}
            error={formik.touched.email && !!formik.errors.email}
            onChange={formik.handleChange}
            variant="outlined"
            id="email"
            label={i18n.t("signup.form.email")}
            required
            autoComplete="email"
            fullWidth
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <InputMask
            mask="(99) 99999-9999"
            value={formik.values.phone}
            onChange={formik.handleChange}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                type="tel"
                variant="outlined"
                id="phone"
                name="phone"
                error={formik.touched.phone && !!formik.errors.phone}
                autoComplete="phone"
                label="Telefone com (DDD)"
                required
                fullWidth
              />
            )}
          </InputMask>
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            autoComplete="postal-code"
            name="postalCode"
            value={formik.values.postalCode}
            error={formik.touched.postalCode && !!formik.errors.postalCode}
            onChange={formik.handleChange}
            variant="outlined"
            id="postalCode"
            label="CEP"
            required
            fullWidth
          />
        </Grid>
        <Grid item md={8} xs={12}>
          <InputLabel htmlFor="plan-selection">Plano</InputLabel>
          <Select
            variant="outlined"
            id="plan-selection"
            label="Plano"
            name="planId"
            value={formik.values.planId}
            onChange={formik.handleChange}
            required
            fullWidth
          >
            {plans.map((plan, key) => (
              <MenuItem key={key} value={plan.id}>
                {plan.name} - Atendentes: {plan.users} - WhatsApp:{" "}
                {plan.connections} - Filas: {plan.queues} - R$ {plan.value}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <PaymentForm onChange={setCreditCard} />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="outlined"
            fullWidth
            disabled={!formik.isValid || !formik.touched || loading}
            startIcon={
              loading ? <CircularProgress color="inherit" size={20} /> : null
            }
          >
            Atualizar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CompanyForm;
